import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

// Initialize Supabase client with environment variables
const supabaseUrl = 'https://vskzyeurkubazrigfnau.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Table where we'll store the titles - now using the database table
const TITLES_TABLE = 'suggested_titles';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache expiration

// Functions to work with the database
async function getStoredTitles(articleId?: string) {
  console.log(`Retrieving titles from database table${articleId ? ` for article_id: ${articleId}` : ''}`);
  try {
    let query = supabase
      .from(TITLES_TABLE)
      .select('titles, created_at, metadata, article_id');
      
    if (articleId) {
      // First try the direct article_id column (new style)
      query = query.eq('article_id', articleId);
    }
    
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.log("Error or no results using direct article_id column, falling back to metadata:", error);
      
      // Fall back to metadata field (old style)
      if (articleId) {
        const { data: metadataData, error: metadataError } = await supabase
          .from(TITLES_TABLE)
          .select('titles, created_at, metadata, article_id')
          .filter('metadata->article_id', 'eq', articleId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (!metadataError && metadataData) {
          console.log("Successfully retrieved titles via metadata filter");
          return {
            titles: metadataData.titles,
            articleId: articleId
          };
        }
        
        console.log("No titles found using either method for article_id:", articleId);
      }
      
      return { titles: [], articleId: null };
    }
    
    if (!data) {
      console.log("No titles found in database");
      return { titles: [], articleId: null };
    }
    
    const createdAt = new Date(data.created_at).getTime();
    const now = Date.now();
    const isCacheExpired = now - createdAt > CACHE_TTL;
    
    if (isCacheExpired) {
      console.log("Cache expired, titles considered stale");
      // Clean up expired entries
      await clearTitlesFromDatabase("expired");
    }
    
    // Get article_id from direct column or metadata, prioritizing direct column
    let storedArticleId = data.article_id || null;
    
    // If not found in direct column, check metadata
    if (!storedArticleId && data.metadata?.article_id) {
      storedArticleId = data.metadata.article_id;
    }
    
    console.log(`Retrieved ${data.titles.length} titles from database${storedArticleId ? ` for article_id: ${storedArticleId}` : ''}`);
    return {
      titles: data.titles,
      articleId: storedArticleId
    };
  } catch (error) {
    console.error("Error in getStoredTitles:", error);
    return { titles: [], articleId: null };
  }
}

async function storeTitles(titles: string[], articleId?: string) {
  console.log(`Storing ${titles.length} titles in database${articleId ? ` for article_id: ${articleId}` : ''}`);
  try {
    // Prepare metadata with the article_id for backward compatibility
    const metadata = articleId ? { article_id: articleId } : {};
    
    // First clear any existing titles for this article_id if specified
    if (articleId) {
      await clearTitlesFromDatabase("filtered", articleId);
    } else {
      // Otherwise, clear all titles
      await clearTitlesFromDatabase("all");
    }
    
    // Insert new titles - using both direct column and metadata for compatibility
    const { data, error } = await supabase
      .from(TITLES_TABLE)
      .insert({
        titles: titles,
        article_id: articleId || null,
        metadata: metadata
      });
    
    if (error) {
      console.error("Error storing titles:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in storeTitles:", error);
    return false;
  }
}

async function clearTitlesFromDatabase(mode = "all", articleId?: string) {
  console.log(`Clearing titles from database (mode: ${mode})${articleId ? ` for article_id: ${articleId}` : ''}`);
  try {
    let query = supabase.from(TITLES_TABLE).delete();
    
    if (mode === "expired") {
      // Only delete entries older than CACHE_TTL
      const expiryTime = new Date(Date.now() - CACHE_TTL);
      query = query.lt('created_at', expiryTime.toISOString());
    } else if (mode === "filtered" && articleId) {
      // Try direct article_id column first (new style)
      try {
        query = query.eq('article_id', articleId);
      } catch (err) {
        console.log("Error using direct article_id for deletion, trying metadata filter:", err);
        try {
          // Fall back to metadata filter (old style)
          query = query.filter('metadata->article_id', 'eq', articleId);
        } catch (innerErr) {
          console.log("Error using metadata filter for deletion, proceeding without filters:", innerErr);
          // If both fail, don't apply filters (will delete everything if mode is "all")
          if (mode !== "all") {
            console.warn("Could not apply article_id filter, skipping deletion");
            return true; // Skip deletion rather than delete everything
          }
        }
      }
    }
    
    const { error } = await query;
    
    if (error) {
      console.log("Error clearing titles:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in clearTitlesFromDatabase:", error);
    return false;
  }
}

// Main serve function
serve(async (req) => {
  // Log the request for debugging
  console.log(`${req.method} request received to titulos function`);
  console.log(`Request URL: ${req.url}`);
  
  try {
    // Log request headers for debugging
    console.log("Request headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));
    
    // For POST requests, log the request body
    if (req.method === 'POST') {
      try {
        const clonedReq = req.clone();
        const bodyText = await clonedReq.text();
        console.log("Request body:", bodyText);
      } catch (err) {
        console.log("Could not log request body:", err);
      }
    }
  } catch (err) {
    console.log("Error logging request details:", err);
  }
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse URL to extract query parameters
    const url = new URL(req.url);
    const requestedArticleId = url.searchParams.get('article_id');
    
    // GET request to retrieve stored titles
    if (req.method === 'GET') {
      console.log(`Processing GET request for titles${requestedArticleId ? ` with article_id: ${requestedArticleId}` : ''}`);
      
      // Add cache-busting querystring parameter to URL
      const cacheBuster = url.searchParams.get('_');
      console.log(`Cache buster: ${cacheBuster || 'not provided'}`);
      
      const { titles, articleId } = await getStoredTitles(requestedArticleId || undefined);
      
      console.log(`Returning ${titles.length} titles${articleId ? ` for article_id: ${articleId}` : ''}`);
      
      return new Response(
        JSON.stringify({ 
          titulos: titles,
          article_id: articleId,
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } 
    // POST request to store new titles
    else if (req.method === 'POST') {
      const requestData = await req.json();
      
      console.log("Received POST request with data:", requestData);
      
      if (!requestData.titulos || !Array.isArray(requestData.titulos)) {
        return new Response(
          JSON.stringify({ error: 'Invalid request format. Expected array of titles.' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }

      // Filter out empty titles and trim whitespace
      const newTitles = requestData.titulos
        .map((title: string) => typeof title === 'string' ? title.trim() : null)
        .filter(Boolean);
        
      if (newTitles.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No valid titles provided.' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }

      // Extract article_id from request if available
      const articleId = requestData.article_id || null;

      // Store titles in the database
      await storeTitles(newTitles, articleId);
      console.log(`Titles updated: ${newTitles}${articleId ? ` for article_id: ${articleId}` : ''}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          count: newTitles.length,
          titles: newTitles,
          article_id: articleId
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } 
    // DELETE to clear titles
    else if (req.method === 'DELETE') {
      const requestedArticleId = url.searchParams.get('article_id');
      
      if (requestedArticleId) {
        await clearTitlesFromDatabase("filtered", requestedArticleId);
        console.log(`Titles cleared from database for article_id: ${requestedArticleId}`);
      } else {
        await clearTitlesFromDatabase("all");
        console.log("All titles cleared from database");
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } 
    // Any other method is not supported
    else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405 
        }
      );
    }
  } catch (error) {
    console.error("Error in titulos function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

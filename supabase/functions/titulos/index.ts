
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

// Initialize Supabase client with environment variables
const supabaseUrl = 'https://vskzyeurkubazrigfnau.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced CORS headers - Essential for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

// Table where we'll store the titles
const TITLES_TABLE = 'suggested_titles';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache expiration

// Default titles in case no titles are available in the database
const DEFAULT_TITLES = [
  'Como melhorar sua produtividade no trabalho',
  'Dicas para uma alimentação saudável',
  'Os benefícios da prática regular de exercícios',
  'Estratégias eficazes de gestão de tempo',
  'Tendências tecnológicas para ficar de olho'
];

// Functions to work with the database
async function getStoredTitles() {
  console.log("Retrieving titles from database table");
  try {
    const { data, error } = await supabase
      .from(TITLES_TABLE)
      .select('titles, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.log("Error retrieving titles:", error);
      
      // Try to fetch any titles, not just the most recent
      const { data: anyData, error: anyError } = await supabase
        .from(TITLES_TABLE)
        .select('titles')
        .limit(1);
        
      if (anyError || !anyData || anyData.length === 0) {
        console.log("No titles found in database, ensuring defaults are stored");
        
        // Store default titles if no titles exist
        await storeTitles(DEFAULT_TITLES);
        return DEFAULT_TITLES;
      }
      
      return anyData[0].titles;
    }
    
    if (!data || !data.titles || data.titles.length === 0) {
      console.log("Empty titles array found in database, ensuring defaults are stored");
      
      // Store default titles if returned titles array is empty
      await storeTitles(DEFAULT_TITLES);
      return DEFAULT_TITLES;
    }
    
    const createdAt = new Date(data.created_at).getTime();
    const now = Date.now();
    const isCacheExpired = now - createdAt > CACHE_TTL;
    
    if (isCacheExpired) {
      console.log("Cache expired, but returning stale titles anyway");
      // We'll return stale titles but not clear them
    }
    
    console.log(`Retrieved ${data.titles.length} titles from database`);
    return data.titles;
  } catch (error) {
    console.error("Error in getStoredTitles:", error);
    
    // Return defaults on any error
    await storeTitles(DEFAULT_TITLES);
    return DEFAULT_TITLES;
  }
}

async function storeTitles(titles) {
  if (!titles || !Array.isArray(titles) || titles.length === 0) {
    console.log("Invalid titles array provided to storeTitles, using defaults");
    titles = DEFAULT_TITLES;
  }
  
  console.log(`Storing ${titles.length} titles in database`);
  try {
    // First check if we already have some stored titles
    const { data: existingData } = await supabase
      .from(TITLES_TABLE)
      .select('id')
      .limit(1);
    
    // If we have existing titles, update them instead of inserting new ones
    if (existingData && existingData.length > 0) {
      const { error } = await supabase
        .from(TITLES_TABLE)
        .update({
          titles: titles,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData[0].id);
      
      if (error) {
        console.log("Error updating titles:", error);
        return false;
      }
      
      console.log("Successfully updated existing titles");
      return true;
    }
    
    // Otherwise insert new titles
    const { error } = await supabase
      .from(TITLES_TABLE)
      .insert({
        titles: titles
      });
    
    if (error) {
      console.log("Error storing titles:", error);
      return false;
    }
    
    console.log("Successfully inserted new titles");
    return true;
  } catch (error) {
    console.error("Error in storeTitles:", error);
    return false;
  }
}

// Improved function to ensure titles exist in the database
async function ensureTitlesExist() {
  try {
    const { data, error } = await supabase
      .from(TITLES_TABLE)
      .select('id, titles')
      .limit(1);
    
    if (error || !data || data.length === 0) {
      console.log("No titles found in database, adding defaults");
      await storeTitles(DEFAULT_TITLES);
      return true;
    }
    
    // Also check if the titles array is empty and fix if necessary
    if (data[0] && (!data[0].titles || data[0].titles.length === 0)) {
      console.log("Empty titles array found, updating with defaults");
      await supabase
        .from(TITLES_TABLE)
        .update({ titles: DEFAULT_TITLES })
        .eq('id', data[0].id);
    } else {
      console.log("Titles already exist in database", data[0].titles);
    }
    
    return true;
  } catch (error) {
    console.error("Error in ensureTitlesExist:", error);
    return false;
  }
}

// Main serve function
serve(async (req) => {
  // Log the request for debugging
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] ${req.method} request received to titulos function from ${req.headers.get('origin') || 'unknown origin'}`);
  
  // Enhanced CORS handling - Handle preflight requests properly
  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] Handling OPTIONS preflight request`);
    return new Response(null, { 
      headers: corsHeaders, 
      status: 204 // No content is standard for OPTIONS
    });
  }

  try {
    // Make sure we have titles in the database
    await ensureTitlesExist();
    
    // GET request to retrieve stored titles
    if (req.method === 'GET') {
      console.log(`[${requestId}] Processing GET request for titles`);
      
      // Add cache-busting querystring parameter to URL
      const url = new URL(req.url);
      const cacheBuster = url.searchParams.get('_');
      console.log(`[${requestId}] Cache buster: ${cacheBuster || 'not provided'}`);
      
      const titles = await getStoredTitles();
      
      console.log(`[${requestId}] Returning ${titles.length} titles`);
      
      const response = {
        titulos: titles,
        timestamp: new Date().toISOString(),
        requestId: requestId
      };
      
      return new Response(
        JSON.stringify(response),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } 
    // POST request to store new titles
    else if (req.method === 'POST') {
      let requestData;
      try {
        requestData = await req.json();
      } catch (parseError) {
        console.log(`[${requestId}] Failed to parse request body:`, parseError);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
      
      console.log(`[${requestId}] Received POST request with data:`, requestData);
      
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
        .map((title) => typeof title === 'string' ? title.trim() : null)
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

      // Store titles in the database
      await storeTitles(newTitles);
      console.log(`[${requestId}] Titles updated:`, newTitles);

      return new Response(
        JSON.stringify({ 
          success: true, 
          count: newTitles.length,
          titles: newTitles,
          requestId: requestId
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } 
    // DELETE to clear titles
    else if (req.method === 'DELETE') {
      await clearTitlesFromDatabase();
      console.log(`[${requestId}] Titles cleared from database`);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          requestId: requestId
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } 
    // Any other method is not supported
    else {
      console.log(`[${requestId}] Unsupported method: ${req.method}`);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405 
        }
      );
    }
  } catch (error) {
    console.error(`[${requestId}] Error in titulos function:`, error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        requestId: requestId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// Function to clear titles from database - kept for completeness
async function clearTitlesFromDatabase(mode = "all") {
  console.log(`Clearing titles from database (mode: ${mode})`);
  try {
    let query = supabase.from(TITLES_TABLE).delete();
    
    if (mode === "expired") {
      // Only delete entries older than CACHE_TTL
      const expiryTime = new Date(Date.now() - CACHE_TTL);
      query = query.lt('created_at', expiryTime.toISOString());
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

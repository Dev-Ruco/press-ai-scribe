
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

// Table where we'll store the titles
const TITLES_TABLE = 'suggested_titles';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache expiration

// Functions to work with the database
async function getStoredTitles() {
  console.log("Retrieving titles from database");
  try {
    const { data, error } = await supabase
      .from(TITLES_TABLE)
      .select('titles, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.log("Error retrieving titles:", error);
      return [];
    }
    
    if (!data) {
      console.log("No titles found in database");
      return [];
    }
    
    const createdAt = new Date(data.created_at).getTime();
    const now = Date.now();
    const isCacheExpired = now - createdAt > CACHE_TTL;
    
    if (isCacheExpired) {
      console.log("Cache expired, titles considered stale");
      // In a production scenario, you might want to delete expired entries
    }
    
    console.log(`Retrieved ${data.titles.length} titles from database`);
    return data.titles;
  } catch (error) {
    console.error("Error in getStoredTitles:", error);
    return [];
  }
}

async function storeTitles(titles) {
  console.log(`Storing ${titles.length} titles in database`);
  try {
    // First clear any existing titles
    await clearTitlesFromDatabase();
    
    // Then insert new titles
    const { data, error } = await supabase
      .from(TITLES_TABLE)
      .insert({
        titles: titles
      });
    
    if (error) {
      console.log("Error storing titles:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in storeTitles:", error);
    return false;
  }
}

async function clearTitlesFromDatabase() {
  console.log("Clearing titles from database");
  try {
    const { error } = await supabase
      .from(TITLES_TABLE)
      .delete()
      .not('id', 'is', null);
    
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
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET request to retrieve stored titles
    if (req.method === 'GET') {
      console.log("Processing GET request for titles");
      
      const titles = await getStoredTitles();
      
      console.log(`Returning ${titles.length} titles`);
      
      return new Response(
        JSON.stringify({ 
          titulos: titles,
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
      console.log("Titles updated:", newTitles);

      return new Response(
        JSON.stringify({ 
          success: true, 
          count: newTitles.length,
          titles: newTitles
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
      console.log("Titles cleared from database");
      
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

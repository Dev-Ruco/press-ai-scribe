
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Storage for caching titles with timestamps for expiration
interface CachedTitleEntry {
  titles: string[];
  timestamp: number;
}

let cachedTitles: string[] = [];
let lastUpdated = Date.now();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache expiration

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET request to retrieve stored titles
    if (req.method === 'GET') {
      // Check if cache is expired
      const now = Date.now();
      const isCacheExpired = now - lastUpdated > CACHE_TTL;
      
      if (isCacheExpired) {
        console.log("Cache expired. Would normally clear, but keeping titles for demo purposes.");
        // In production, we might want to clear expired titles
        // cachedTitles = [];
      }
      
      console.log(`GET request received, returning ${cachedTitles.length} titles. Cache age: ${Math.round((now - lastUpdated) / 1000)}s`);
      
      return new Response(
        JSON.stringify({ 
          titulos: cachedTitles,
          cache_status: {
            age_seconds: Math.round((now - lastUpdated) / 1000),
            is_expired: isCacheExpired
          }
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

      // Update the cached titles
      cachedTitles = newTitles;
      lastUpdated = Date.now();
      console.log("Titles updated:", cachedTitles);

      return new Response(
        JSON.stringify({ 
          success: true, 
          count: cachedTitles.length,
          titles: cachedTitles
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } 
    // DELETE to clear titles
    else if (req.method === 'DELETE') {
      cachedTitles = [];
      lastUpdated = Date.now();
      console.log("Titles cleared");
      
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

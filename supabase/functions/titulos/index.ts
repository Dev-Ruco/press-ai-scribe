
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers to allow requests from any origin
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Define a global cache object to store titles between invocations
// Note: This will be reset when function cold starts
const cache: { titulos: string[] } = { titulos: [] };

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // GET request - return current titles
    if (req.method === "GET") {
      console.log("GET request received, returning titles:", cache.titulos);
      return new Response(
        JSON.stringify({ titulos: cache.titulos }),
        {
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          },
          status: 200,
        }
      );
    }

    // POST request - process and store new titles
    if (req.method === "POST") {
      const content = await req.json();
      console.log("Dados recebidos:", content);
      
      if (content.titulos) {
        let processedTitles: string[] = [];
        
        if (typeof content.titulos === 'string') {
          // Split by newlines and filter
          processedTitles = content.titulos
            .split('\n')
            .map((t: string) => t.trim())
            .filter((t: string) => t && t.length > 3) // Filter empty or very short titles
            .map((t: string) => {
              // Remove numbering if present (like '1.', '2.', etc)
              return t.replace(/^\d+\.\s*/, '').trim();
            })
            .map((t: string) => {
              // Remove quotes if present
              return t.replace(/^["'](.*)["']$/, '$1').trim();
            });
        } else if (Array.isArray(content.titulos)) {
          // If already an array, just filter and clean
          processedTitles = content.titulos
            .filter((t: string) => t && typeof t === 'string' && t.length > 3)
            .map((t: string) => t.trim());
        }
        
        // Update the cache
        cache.titulos = processedTitles;
      }
      
      console.log("Títulos processados e armazenados:", cache.titulos);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          count: cache.titulos.length,
          titulos: cache.titulos 
        }),
        {
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          },
          status: 200,
        }
      );
    }

    // Unsupported method
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 405,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 500,
      }
    );
  }
});

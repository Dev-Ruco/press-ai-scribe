
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers to allow requests from any origin
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// In-memory cache for titles (will be reset when function cold starts)
let titulos: string[] = [];

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
      console.log("GET request received, returning titles:", titulos);
      return new Response(
        JSON.stringify({ titulos }),
        {
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          },
          status: 200,
        }
      );
    }

    // POST request - store new titles
    if (req.method === "POST") {
      const content = await req.json();
      console.log("Dados recebidos:", content);
      
      // Handle different formats of incoming titles
      if (content.titulos) {
        if (typeof content.titulos === 'string') {
          // If it's a string, try to parse it as JSON or split by lines
          try {
            const parsed = JSON.parse(content.titulos);
            titulos = Array.isArray(parsed) ? parsed : [content.titulos];
          } catch (e) {
            // If not valid JSON, split by newlines and filter out empty lines
            titulos = content.titulos.split('\n')
              .map((t: string) => t.trim())
              .filter((t: string) => t && !t.match(/^\d+\./)) // Remove numbering
              .map((t: string) => t.replace(/^["'](.*)["']$/, '$1')); // Remove quotes
          }
        } else if (Array.isArray(content.titulos)) {
          titulos = content.titulos;
        }
      }
      
      // Clean up the titles - remove any empty strings or undefined values
      titulos = titulos.filter(Boolean).map((t: string) => t.trim());
      
      console.log("Títulos processados:", titulos);
      
      return new Response(
        JSON.stringify({ success: true, count: titulos.length }),
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

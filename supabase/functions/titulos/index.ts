
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Cache para armazenar os títulos
let cache: { titulos: string[] } = { titulos: [] };

// Configuração CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Lidar com requisições preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rota para receber títulos (POST)
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      console.log("Dados recebidos:", body);

      // Processar os títulos recebidos
      if (body.titulos) {
        // Se for string, divide; se for array, usa direto
        const lista = Array.isArray(body.titulos) 
          ? body.titulos 
          : body.titulos.split('\n').filter((t: string) => t.trim() !== '');
        
        cache.titulos = lista;
      }

      return new Response(
        JSON.stringify({ success: true, message: "Títulos recebidos com sucesso", count: cache.titulos.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Erro ao processar dados" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
  }

  // Rota para buscar títulos (GET)
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ titulos: cache.titulos }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }

  // Método não suportado
  return new Response(
    JSON.stringify({ error: "Método não permitido" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
  );
});

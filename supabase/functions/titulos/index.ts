
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Armazenamento em memória para os títulos
let suggestedTitles: string[] = [];

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
        if (typeof body.titulos === 'string') {
          try {
            // Tenta fazer parse se for uma string JSON
            const parsedTitles = JSON.parse(body.titulos);
            suggestedTitles = Array.isArray(parsedTitles) ? parsedTitles : [body.titulos];
          } catch (e) {
            // Se não for um JSON válido, considera como um único título
            suggestedTitles = [body.titulos];
          }
        } else if (Array.isArray(body.titulos)) {
          suggestedTitles = body.titulos;
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: "Títulos recebidos com sucesso", count: suggestedTitles.length }),
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
      JSON.stringify({ titles: suggestedTitles }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }

  // Método não suportado
  return new Response(
    JSON.stringify({ error: "Método não suportado" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
  );
});


import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useTitleSuggestions() {
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTitles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Attempt to get titles directly from the Edge Function
      const response = await fetch('https://vskzyeurkubazrigfnau.supabase.co/functions/v1/titulos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add anon key to avoid potential auth issues
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza3p5ZXVya3ViYXpyaWdmbmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzU4NTcsImV4cCI6MjA2MDcxMTg1N30.NTvxBgUFHDz0U3xuxUMFSZMRFKrY9K4gASBPF6N-zMc'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.titulos && Array.isArray(data.titulos)) {
        console.log("Títulos recebidos do endpoint:", data.titulos);
        
        if (data.titulos.length > 0) {
          setSuggestedTitles(data.titulos);
        }
      } else {
        console.log("Nenhum título encontrado na resposta", data);
      }
    } catch (err) {
      console.error("Erro ao buscar títulos sugeridos:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar títulos");
      toast({
        title: "Erro ao buscar títulos",
        description: err instanceof Error ? err.message : "Não foi possível buscar as sugestões de títulos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchTitles();
    
    // Poll for titles every 3 seconds to catch any new ones
    const interval = setInterval(fetchTitles, 3000);
    
    return () => clearInterval(interval);
  }, [fetchTitles]);

  return {
    suggestedTitles,
    isLoading,
    error,
    refetch: fetchTitles
  };
}

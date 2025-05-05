
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useTitleSuggestions() {
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTitles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('titulos', {
        method: 'GET',
      });
      
      if (error) throw new Error(error.message);
      
      if (data && data.titulos) {
        setSuggestedTitles(data.titulos);
      }
    } catch (err) {
      console.error("Erro ao buscar títulos sugeridos:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar títulos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTitles();
    
    // Buscar títulos a cada 5 segundos para atualização automática
    const interval = setInterval(fetchTitles, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    suggestedTitles,
    isLoading,
    error,
    refetch: fetchTitles
  };
}

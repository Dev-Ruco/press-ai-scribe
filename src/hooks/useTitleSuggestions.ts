
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getSuggestedTitles, updateSuggestedTitles } from "@/services/titleSuggestionService";

const FALLBACK_TITLES = [
  'Como melhorar sua produtividade no trabalho',
  'Dicas para uma alimentação saudável',
  'Os benefícios da prática regular de exercícios',
  'Estratégias eficazes de gestão de tempo',
  'Tendências tecnológicas para ficar de olho'
];

export function useTitleSuggestions(onTitlesLoaded?: (titles: string[]) => void) {
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titlesLoaded, setTitlesLoaded] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const { toast } = useToast();

  const fetchTitles = useCallback(async (force = false): Promise<string[]> => {
    // Minimum time between regular refreshes (5 seconds)
    const MIN_REFRESH_INTERVAL = 5000;
    const now = Date.now();
    
    // Skip if we're already loading or if it's been less than MIN_REFRESH_INTERVAL since our last fetch
    // unless force=true
    if (
      isLoading || 
      (!force && lastFetchTime && now - lastFetchTime < MIN_REFRESH_INTERVAL)
    ) {
      console.log("Skipping fetch - already loading or too soon since last fetch");
      return suggestedTitles;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Buscando títulos do endpoint Supabase...");
      // Fetch titles from the Supabase Edge Function with cache busting and timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
      
      // Fetch with timeout
      const response = await fetch(`https://vskzyeurkubazrigfnau.supabase.co/functions/v1/titulos?_=${now}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza3p5ZXVya3ViYXpyaWdmbmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzU4NTcsImV4cCI6MjA2MDcxMTg1N30.NTvxBgUFHDz0U3xuxUMFSZMRFKrY9K4gASBPF6N-zMc',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response from endpoint: ${response.status} ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Resposta completa do endpoint de títulos:", data);
      
      if (data.titulos && Array.isArray(data.titulos)) {
        console.log("Títulos recebidos do endpoint:", data.titulos);
        
        if (data.titulos.length > 0) {
          setSuggestedTitles(data.titulos);
          setTitlesLoaded(true);
          setLastFetchTime(now);
          setFetchAttempts(0); // Reset fetch attempts on success
          
          // Update in-memory service for backup
          updateSuggestedTitles(data.titulos);
          
          // Chamar o callback se fornecido
          if (onTitlesLoaded) {
            console.log("Chamando callback onTitlesLoaded com títulos:", data.titulos);
            onTitlesLoaded(data.titulos);
          }
          
          return data.titulos; // Return the titles for direct use
        } else {
          console.log("Nenhum título retornado pelo endpoint, usando fallback");
          throw new Error("Nenhum título retornado pelo endpoint");
        }
      } else {
        console.log("Formato de resposta inválido:", data);
        throw new Error("Formato de resposta inválido");
      }
    } catch (err) {
      console.error("Erro ao buscar títulos sugeridos:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar títulos");
      setFetchAttempts(prev => prev + 1);
      
      // Try to get titles from in-memory service as fallback
      const memoryTitles = getSuggestedTitles();
      if (memoryTitles && memoryTitles.length > 0) {
        console.log("Usando títulos do serviço em memória como fallback:", memoryTitles);
        setSuggestedTitles(memoryTitles);
        setTitlesLoaded(true);
        
        // Only notify on first fallback or when specifically requested
        if (force || fetchAttempts <= 1) {
          toast({
            title: "Usando títulos armazenados localmente",
            description: "Não foi possível conectar ao servidor. Usando dados em cache."
          });
        }
        
        // Also call the callback with fallback titles
        if (onTitlesLoaded) {
          onTitlesLoaded(memoryTitles);
        }
        
        return memoryTitles;
      }
      
      // If nothing in memory, use hardcoded fallbacks
      console.log("Sem títulos em memória, usando fallback padrão");
      setSuggestedTitles(FALLBACK_TITLES);
      setTitlesLoaded(true);
      updateSuggestedTitles(FALLBACK_TITLES);
      
      // Notify only on first fallback or when specifically requested
      if (force || fetchAttempts <= 1) {
        toast({
          title: "Usando títulos padrão",
          description: "Não foi possível obter sugestões personalizadas. Usando títulos genéricos.",
          variant: "destructive"
        });
      }
      
      // Also call the callback with fallback titles
      if (onTitlesLoaded) {
        onTitlesLoaded(FALLBACK_TITLES);
      }
      
      return FALLBACK_TITLES; // Return fallback titles
    } finally {
      setIsLoading(false);
    }
  }, [suggestedTitles, isLoading, lastFetchTime, toast, onTitlesLoaded, fetchAttempts]);

  // Initial fetch when component mounts
  useEffect(() => {
    console.log("useTitleSuggestions: Fazendo busca inicial de títulos");
    fetchTitles(true); // Force first fetch
  }, [fetchTitles]);

  // Polling mechanism with adaptive intervals based on error state
  useEffect(() => {
    // Poll more frequently if no titles have been loaded yet or there were errors
    // Less frequently if titles are already loaded
    const pollInterval = error ? 10000 : titlesLoaded ? 30000 : 5000;
    
    console.log(`Configurando polling para títulos a cada ${pollInterval/1000} segundos. 
      Estado atual: títulos carregados=${titlesLoaded}, erro=${error !== null}`);
    
    const intervalId = setInterval(() => {
      console.log("Polling for new titles");
      fetchTitles();
    }, pollInterval);
    
    return () => clearInterval(intervalId);
  }, [fetchTitles, titlesLoaded, error]);

  return {
    suggestedTitles,
    isLoading,
    error,
    refetch: () => fetchTitles(true), // Force refresh
    titlesLoaded
  };
}

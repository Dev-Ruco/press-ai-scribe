
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getSuggestedTitles, 
  updateSuggestedTitles, 
  hasTitles,
  shouldFetchTitles,
  markFetchAttempt
} from "@/services/titleSuggestionService";

const FALLBACK_TITLES = [
  'Como melhorar sua produtividade no trabalho',
  'Dicas para uma alimentação saudável',
  'Os benefícios da prática regular de exercícios',
  'Estratégias eficazes de gestão de tempo',
  'Tendências tecnológicas para ficar de olho'
];

// Retry configurations
const MAX_RETRY_COUNT = 3;
const RETRY_BACKOFF = [2000, 5000, 10000]; // Increasing backoff in ms

export function useTitleSuggestions(onTitlesLoaded?: (titles: string[]) => void) {
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titlesLoaded, setTitlesLoaded] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const fetchTitles = useCallback(async (force = false): Promise<string[]> => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Check if we've already reached maximum retry attempts
    if (fetchAttempts >= MAX_RETRY_COUNT && !force) {
      console.log(`Maximum fetch attempts (${MAX_RETRY_COUNT}) reached, using cached data`);
      const cachedTitles = getSuggestedTitles();
      return cachedTitles.length > 0 ? cachedTitles : FALLBACK_TITLES;
    }
    
    // Check if we should fetch based on time since last fetch
    if (!force && !shouldFetchTitles()) {
      console.log("Skipping fetch - too soon since last fetch");
      return suggestedTitles.length > 0 ? suggestedTitles : getSuggestedTitles();
    }
    
    // Skip if we're already loading
    if (isLoading && !force) {
      console.log("Skipping fetch - already loading");
      return suggestedTitles;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Mark that we attempted a fetch (even if it fails)
    markFetchAttempt();
    
    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    try {
      console.log("Buscando títulos do endpoint Supabase...");
      
      // Define timeout
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          console.log("Request timeout - aborting");
          abortControllerRef.current.abort();
        }
      }, 6000); // Reduced timeout to 6 seconds for faster fallback
      
      // Fetch with timestamp for cache busting
      const timestamp = Date.now();
      const response = await fetch(`https://vskzyeurkubazrigfnau.supabase.co/functions/v1/titulos?_=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza3p5ZXVya3ViYXpyaWdmbmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzU4NTcsImV4cCI6MjA2MDcxMTg1N30.NTvxBgUFHDz0U3xuxUMFSZMRFKrY9K4gASBPF6N-zMc',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        signal: abortControllerRef.current.signal
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
          setLastFetchTime(Date.now());
          setFetchAttempts(0); // Reset fetch attempts on success
          
          // Update in-memory service for backup
          updateSuggestedTitles(data.titulos);
          
          // Call callback if provided
          if (onTitlesLoaded) {
            console.log("Chamando callback onTitlesLoaded com títulos:", data.titulos);
            onTitlesLoaded(data.titulos);
          }
          
          return data.titulos; // Return the titles for direct use
        } else {
          console.log("Array de títulos vazio retornado pelo endpoint, usando fallback");
          throw new Error("Array de títulos vazio");
        }
      } else {
        console.log("Formato de resposta inválido:", data);
        throw new Error("Formato de resposta inválido");
      }
    } catch (err: any) {
      // Don't show error when it's just an abort
      if (err.name === 'AbortError') {
        console.log("Request aborted");
        setIsLoading(false);
        return suggestedTitles.length > 0 ? suggestedTitles : getSuggestedTitles();
      }
      
      console.error("Erro ao buscar títulos sugeridos:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar títulos");
      
      // Increment the fetch attempts counter
      const nextAttempt = fetchAttempts + 1;
      setFetchAttempts(nextAttempt);
      
      // Try to get titles from in-memory service as fallback
      const memoryTitles = getSuggestedTitles();
      if (memoryTitles && memoryTitles.length > 0) {
        console.log("Usando títulos do serviço em memória como fallback:", memoryTitles);
        setSuggestedTitles(memoryTitles);
        setTitlesLoaded(true);
        
        // Only notify on first fallback or when specifically requested
        if (force || fetchAttempts === 0) {
          toast({
            title: "Usando títulos armazenados localmente",
            description: "Não foi possível conectar ao servidor. Usando dados em cache.",
            variant: "default" // Less alarming variant
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
      if (force || fetchAttempts === 0) {
        toast({
          title: "Usando títulos padrão",
          description: "Não foi possível obter sugestões personalizadas. Usando títulos genéricos.",
          variant: "default" // Less alarming variant
        });
      }
      
      // Also call the callback with fallback titles
      if (onTitlesLoaded) {
        onTitlesLoaded(FALLBACK_TITLES);
      }
      
      return FALLBACK_TITLES; // Return fallback titles
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [suggestedTitles, isLoading, lastFetchTime, toast, onTitlesLoaded, fetchAttempts]);

  // Initial load - first try to use any cached titles, then fetch fresh ones
  useEffect(() => {
    console.log("useTitleSuggestions: Inicializando componente");
    
    // Check if we have cached titles first and use them immediately
    if (hasTitles()) {
      const cachedTitles = getSuggestedTitles();
      setSuggestedTitles(cachedTitles);
      setTitlesLoaded(true);
      
      // Call the callback with cached titles immediately
      if (onTitlesLoaded) {
        onTitlesLoaded(cachedTitles);
      }
      
      // Allow some time for render, then fetch fresh titles in background
      setTimeout(() => {
        if (shouldFetchTitles()) {
          fetchTitles(true).catch(console.error);
        }
      }, 500);
    } else {
      // No cached titles, do an immediate fetch
      fetchTitles(true).catch(console.error);
    }
    
    return () => {
      // Cancel any pending requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchTitles, onTitlesLoaded]);

  // Intelligent polling with backoff
  useEffect(() => {
    // If we've reached max attempts or have valid titles, poll less frequently
    const getNextPollInterval = () => {
      if (fetchAttempts >= MAX_RETRY_COUNT) {
        return 60000; // Once per minute if we're having persistent errors
      } else if (error) {
        return RETRY_BACKOFF[Math.min(fetchAttempts, RETRY_BACKOFF.length - 1)]; // Use backoff strategy
      } else if (titlesLoaded && suggestedTitles.length > 0) {
        return 30000; // Once per 30s if we have titles
      } else {
        return 5000; // Quick retry if we have nothing
      }
    };
    
    const pollInterval = getNextPollInterval();
    
    console.log(`Configurando polling para títulos a cada ${pollInterval/1000} segundos. 
      Estado atual: títulos carregados=${titlesLoaded}, erro=${error !== null}, tentativas=${fetchAttempts}`);
    
    const intervalId = setInterval(() => {
      console.log("Polling for new titles");
      fetchTitles().catch(console.error);
    }, pollInterval);
    
    return () => clearInterval(intervalId);
  }, [fetchTitles, titlesLoaded, error, fetchAttempts, suggestedTitles.length]);

  return {
    suggestedTitles,
    isLoading,
    error,
    refetch: () => fetchTitles(true), // Force refresh
    titlesLoaded
  };
}

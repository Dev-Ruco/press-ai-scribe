
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { getSuggestedTitles, subscribeTitleUpdates, getLastUpdateTime } from "@/services/titleSuggestionService";

export function useTitleSuggestions(onTitlesLoaded?: (titles: string[]) => void) {
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titlesLoaded, setTitlesLoaded] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<number>(0);
  const { toast } = useToast();
  const onTitlesLoadedRef = useRef(onTitlesLoaded);

  // Atualizar a ref quando o callback mudar
  useEffect(() => {
    onTitlesLoadedRef.current = onTitlesLoaded;
  }, [onTitlesLoaded]);

  // Função para notificar quando títulos são carregados
  const notifyTitlesLoaded = useCallback((titles: string[]) => {
    if (onTitlesLoadedRef.current && titles.length > 0) {
      console.log("Notificando callback com títulos carregados:", titles);
      onTitlesLoadedRef.current(titles);
    }
  }, []);

  // Assinar para atualizações de títulos do serviço
  useEffect(() => {
    console.log("Assinando para atualizações de títulos");
    
    // Primeiro, tentar usar títulos que já estão na memória
    const currentTitles = getSuggestedTitles();
    if (currentTitles.length > 0) {
      console.log("Títulos já existem na memória:", currentTitles);
      setSuggestedTitles(currentTitles);
      setTitlesLoaded(true);
      notifyTitlesLoaded(currentTitles);
    }
    
    // Assinar para atualizações futuras
    const unsubscribe = subscribeTitleUpdates((titles) => {
      console.log("Recebido atualização de títulos via subscription:", titles);
      if (titles && titles.length > 0) {
        // Verificar se os títulos são diferentes dos que já temos
        const isNewTitles = JSON.stringify(titles) !== JSON.stringify(suggestedTitles);
        
        if (isNewTitles) {
          console.log("Novos títulos recebidos, atualizando estado e notificando");
          setSuggestedTitles(titles);
          setTitlesLoaded(true);
          setLastFetchTime(Date.now());
          setLastCheckTime(Date.now());
          notifyTitlesLoaded(titles);
          
          // Mostrar toast apenas se for a primeira carga ou se os títulos mudaram
          if (!titlesLoaded || isNewTitles) {
            toast({
              title: "Títulos disponíveis",
              description: "Sugestões de títulos foram recebidas."
            });
          }
        } else {
          console.log("Ignorando atualização com os mesmos títulos");
        }
      }
    });
    
    return unsubscribe;
  }, [notifyTitlesLoaded, toast, suggestedTitles, titlesLoaded]);

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
    
    // Verificar se houve atualização desde a última checagem
    const serviceLastUpdate = getLastUpdateTime();
    if (serviceLastUpdate <= lastCheckTime && !force) {
      console.log("Sem atualizações desde a última checagem. Último serviço:", 
        new Date(serviceLastUpdate).toISOString(), 
        "Última checagem:", 
        new Date(lastCheckTime).toISOString());
      return suggestedTitles;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Buscando títulos do endpoint Supabase...");
      // Fetch titles from the Supabase Edge Function with cache busting
      const response = await fetch(`https://vskzyeurkubazrigfnau.supabase.co/functions/v1/titulos?_=${now}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add anon key for auth
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza3p5ZXVya3ViYXpyaWdmbmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzU4NTcsImV4cCI6MjA2MDcxMTg1N30.NTvxBgUFHDz0U3xuxUMFSZMRFKrY9K4gASBPF6N-zMc',
          'cache-control': 'no-cache, no-store'
        }
      });
      
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
          // Verificar se os títulos são diferentes dos que já temos
          const isNewTitles = JSON.stringify(data.titulos) !== JSON.stringify(suggestedTitles);
          
          if (isNewTitles) {
            setSuggestedTitles(data.titulos);
            setTitlesLoaded(true);
            setLastFetchTime(now);
            setLastCheckTime(now);
            notifyTitlesLoaded(data.titulos);
            
            // Mostrar toast apenas se for a primeira carga ou se os títulos mudaram
            if (!titlesLoaded || isNewTitles) {
              toast({
                title: "Títulos disponíveis",
                description: "Sugestões de títulos foram recebidas."
              });
            }
          } else {
            console.log("Ignorando atualização com os mesmos títulos");
          }
          
          return data.titulos; // Return the titles for direct use
        } else {
          console.log("Nenhum título retornado pelo endpoint");
          setLastCheckTime(now);
        }
      } else {
        console.log("Formato de resposta inválido:", data);
        setLastCheckTime(now);
      }
      
      return suggestedTitles; // Return existing titles if no new ones found
    } catch (err) {
      console.error("Erro ao buscar títulos sugeridos:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar títulos");
      
      // Notificar o usuário sobre o erro de forma não-intrusiva apenas se for durante força-busca
      if (force) {
        toast({
          title: "Erro ao obter títulos sugeridos",
          description: "Tentando novamente em breve...",
          variant: "destructive"
        });
      }
      
      return suggestedTitles; // Return existing titles on error
    } finally {
      setIsLoading(false);
      setLastCheckTime(now);
    }
  }, [suggestedTitles, isLoading, lastFetchTime, toast, notifyTitlesLoaded, lastCheckTime, titlesLoaded]);

  // Initial fetch when component mounts
  useEffect(() => {
    console.log("useTitleSuggestions: Fazendo busca inicial de títulos");
    fetchTitles(true); // Force first fetch
  }, [fetchTitles]);

  // Polling mechanism to periodically check for new titles with adaptive intervals
  useEffect(() => {
    // Poll more frequently if no titles have been loaded yet, less frequently otherwise
    const pollInterval = titlesLoaded ? 30000 : 5000;
    
    console.log(`Configurando polling para títulos a cada ${pollInterval/1000} segundos.`);
    
    const intervalId = setInterval(() => {
      console.log("Polling for new titles");
      fetchTitles();
    }, pollInterval);
    
    return () => clearInterval(intervalId);
  }, [fetchTitles, titlesLoaded]);

  return {
    suggestedTitles,
    isLoading,
    error,
    refetch: () => fetchTitles(true), // Force refresh
    titlesLoaded
  };
}

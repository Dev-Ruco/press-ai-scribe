
import { useState, useEffect, useCallback, useRef } from "react";
import { fetchTitlesFromApi } from "@/services/titleApiService";
import { 
  getSuggestedTitles, 
  getLastUpdateTime, 
  setCurrentArticleId 
} from "@/services/titleSuggestionService";

interface UseTitlePollingProps {
  articleId?: string;
  shouldPoll: boolean;
  onTitlesFound: (titles: string[], articleId?: string) => void;
  onError?: (error: Error) => void;
  initialRefresh?: boolean;
}

interface TitlePollingResult {
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  refetch: (force?: boolean, specificArticleId?: string) => Promise<string[]>;
}

export function useTitlePolling({
  articleId,
  shouldPoll,
  onTitlesFound,
  onError,
  initialRefresh = false
}: UseTitlePollingProps): TitlePollingResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<number>(0);

  // Store the current titles for comparison
  const currentTitlesRef = useRef<string[]>(getSuggestedTitles());
  
  // Store callback refs to avoid dependency issues
  const onTitlesFoundRef = useRef(onTitlesFound);
  const onErrorRef = useRef(onError);
  const articleIdRef = useRef(articleId);

  // Update refs when props change
  useEffect(() => {
    onTitlesFoundRef.current = onTitlesFound;
    onErrorRef.current = onError;
    articleIdRef.current = articleId;
  }, [onTitlesFound, onError, articleId]);

  // Main function to fetch titles
  const fetchTitles = useCallback(async (
    force = false, 
    specificArticleId?: string
  ): Promise<string[]> => {
    // Minimum time between regular refreshes (5 seconds)
    const MIN_REFRESH_INTERVAL = 5000;
    const now = Date.now();
    
    // Use the article_id provided, or fallback to the state
    const requestArticleId = specificArticleId || articleIdRef.current;
    
    // Don't proceed if we don't have an article_id and not forced
    if (!requestArticleId && !force) {
      console.log("Skipping title fetch - no article_id available");
      return currentTitlesRef.current;
    }
    
    // Skip if already loading or if it's been less than MIN_REFRESH_INTERVAL
    if (
      isLoading || 
      (!force && lastFetchTime && now - lastFetchTime < MIN_REFRESH_INTERVAL)
    ) {
      console.log("Skipping fetch - already loading or too soon since last fetch");
      return currentTitlesRef.current;
    }
    
    // Check if there's been an update since last check
    const serviceLastUpdate = getLastUpdateTime();
    if (serviceLastUpdate <= lastCheckTime && !force) {
      console.log("No updates since last check. Last service update:", 
        new Date(serviceLastUpdate).toISOString(), 
        "Last check:", 
        new Date(lastCheckTime).toISOString());
      return currentTitlesRef.current;
    }
    
    setIsLoading(true);
    // Don't show error if it's the initial fetch without an article_id
    if (requestArticleId || force) {
      setError(null);
    }
    
    try {
      console.log("Fetching titles...", requestArticleId ? `for article_id: ${requestArticleId}` : "");
      
      // If a specific article_id is provided, store it for later use
      if (requestArticleId) {
        setCurrentArticleId(requestArticleId);
      }
      
      // Fetch the titles from the API
      const data = await fetchTitlesFromApi(requestArticleId);
      setLastCheckTime(now);
      
      if (data?.titulos && Array.isArray(data.titulos)) {
        console.log("Titles received from API:", data.titulos, "Article ID:", data.article_id);
        
        if (data.titulos.length > 0) {
          // Check if the titles are different from what we already have
          const isNewTitles = JSON.stringify(data.titulos) !== JSON.stringify(currentTitlesRef.current);
          
          if (isNewTitles) {
            setLastFetchTime(now);
            
            // Update the current titles ref
            currentTitlesRef.current = data.titulos;
            
            // Notify that titles were found
            if (onTitlesFoundRef.current) {
              onTitlesFoundRef.current(data.titulos, data.article_id);
            }
          } else {
            console.log("Ignoring update with the same titles");
          }
          
          return data.titulos; // Return titles for direct use
        } else {
          console.log("No titles returned by the API");
        }
      } else {
        console.log("Invalid response format:", data);
      }
      
      return currentTitlesRef.current; // Return existing titles if no new ones found
    } catch (err) {
      console.error("Error fetching suggested titles:", err);
      
      // Show error only if we have an article_id or it's forced
      if ((requestArticleId || force) && onErrorRef.current && err instanceof Error) {
        onErrorRef.current(err);
      }
      
      if (requestArticleId || force) {
        setError(err instanceof Error ? err.message : "Error fetching titles");
      }
      
      return currentTitlesRef.current; // Return existing titles on error
    } finally {
      setIsLoading(false);
      setLastCheckTime(now);
    }
  }, [isLoading, lastFetchTime, lastCheckTime]);

  // Initial fetch when component mounts - only if initialRefresh is true
  useEffect(() => {
    if (initialRefresh && articleId) {
      console.log("Making initial fetch of titles for article_id:", articleId);
      fetchTitles(true, articleId);
    } else {
      console.log("Waiting for article_id or manual trigger to fetch titles");
    }
  }, [fetchTitles, initialRefresh, articleId]);

  // Polling mechanism
  useEffect(() => {
    if (!shouldPoll || !articleId) {
      console.log("Polling disabled - waiting for article_id or manual enable");
      return;
    }
    
    // Poll frequently if no titles have been loaded yet, less frequently otherwise
    const pollInterval = currentTitlesRef.current.length > 0 ? 30000 : 5000;
    
    console.log(`Setting up polling for titles every ${pollInterval/1000} seconds. Article ID:`, articleId);
    
    const intervalId = setInterval(() => {
      console.log("Polling for new titles", articleId ? `for article_id: ${articleId}` : "");
      fetchTitles(false, articleId);
    }, pollInterval);
    
    return () => clearInterval(intervalId);
  }, [fetchTitles, articleId, shouldPoll]);

  return {
    isLoading,
    error,
    lastFetchTime,
    refetch: (force = true, specificArticleId?: string) => fetchTitles(force, specificArticleId)
  };
}

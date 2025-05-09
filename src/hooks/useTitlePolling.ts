
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
    
    console.log("fetchTitles called with params:", { 
      force, 
      specificArticleId,
      currentArticleId: articleIdRef.current,
      requestArticleId,
      isLoading,
      lastFetchTime,
      timeSinceLastFetch: lastFetchTime ? now - lastFetchTime : null
    });
    
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
        console.log("Setting current article_id in service:", requestArticleId);
      }
      
      // Make the API call directly
      const response = await fetchTitlesFromApi(requestArticleId);
      console.log("API response received:", response);
      
      setLastCheckTime(now);
      
      if (response?.titulos && Array.isArray(response.titulos)) {
        console.log("Titles received from API:", response.titulos.length, "Article ID:", response.article_id);
        
        // Store the received article_id if any
        if (response.article_id) {
          setCurrentArticleId(response.article_id);
        }
        
        if (response.titulos.length > 0) {
          // Check if the titles are different from what we already have
          const isNewTitles = JSON.stringify(response.titulos) !== JSON.stringify(currentTitlesRef.current);
          
          if (isNewTitles || force) {
            setLastFetchTime(now);
            
            // Update the current titles ref
            currentTitlesRef.current = response.titulos;
            
            // Notify that titles were found
            if (onTitlesFoundRef.current) {
              try {
                onTitlesFoundRef.current(response.titulos, response.article_id);
                console.log("Notified onTitlesFound callback with new titles");
              } catch (err) {
                console.error("Error in onTitlesFound callback:", err);
              }
            }
          } else {
            console.log("Received same titles as we already have, not updating");
          }
          
          return response.titulos; // Return titles for direct use
        } else {
          console.log("No titles returned by the API");
        }
      } else {
        console.log("Invalid response format or empty titles array:", response);
      }
      
      return currentTitlesRef.current; // Return existing titles if no new ones found
    } catch (err) {
      console.error("Error fetching suggested titles:", err);
      
      // Show error only if we have an article_id or it's forced
      if ((requestArticleId || force) && onErrorRef.current && err instanceof Error) {
        try {
          onErrorRef.current(err);
        } catch (callbackErr) {
          console.error("Error in onError callback:", callbackErr);
        }
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
      fetchTitles(true, articleId).catch(err => {
        console.error("Error during initial title fetch:", err);
      });
    } else {
      console.log("Waiting for article_id or manual trigger to fetch titles");
    }
  }, [fetchTitles, initialRefresh, articleId]);

  // Polling mechanism
  useEffect(() => {
    if (!shouldPoll) {
      console.log("Polling disabled - waiting for manual enable");
      return;
    }
    
    // Poll frequently if no titles have been loaded yet, less frequently otherwise
    const pollInterval = currentTitlesRef.current.length > 0 ? 30000 : 5000;
    
    console.log(`Setting up polling for titles every ${pollInterval/1000} seconds.`, 
      articleId ? `Article ID: ${articleId}` : "No article ID yet");
    
    const intervalId = setInterval(() => {
      console.log("Polling for new titles", articleId ? `for article_id: ${articleId}` : "");
      
      fetchTitles(false, articleId).catch(err => {
        console.error("Error during polling:", err);
      });
    }, pollInterval);
    
    return () => {
      console.log("Clearing title polling interval");
      clearInterval(intervalId);
    };
  }, [fetchTitles, articleId, shouldPoll]);

  return {
    isLoading,
    error,
    lastFetchTime,
    refetch: (force = true, specificArticleId?: string) => fetchTitles(force, specificArticleId)
  };
}

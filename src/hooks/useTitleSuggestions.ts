
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getSuggestedTitles, 
  subscribeTitleUpdates, 
  getCurrentArticleId,
  setCurrentArticleId 
} from "@/services/titleSuggestionService";
import { useTitlePolling } from "@/hooks/useTitlePolling";

export function useTitleSuggestions(
  onTitlesLoaded?: (titles: string[], article_id?: string) => void,
  initialArticleId?: string
) {
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [articleId, setArticleId] = useState<string | undefined>(initialArticleId);
  const [titlesLoaded, setTitlesLoaded] = useState(false);
  const [shouldPoll, setShouldPoll] = useState(false);
  const { toast } = useToast();
  const onTitlesLoadedRef = useRef(onTitlesLoaded);

  // Update ref when callback changes
  useEffect(() => {
    onTitlesLoadedRef.current = onTitlesLoaded;
  }, [onTitlesLoaded]);

  // If an initial article_id is provided, update it in the service
  // and enable polling
  useEffect(() => {
    if (initialArticleId) {
      console.log("Setting initial article_id:", initialArticleId);
      setCurrentArticleId(initialArticleId);
      setArticleId(initialArticleId);
      setShouldPoll(true);
    }
  }, [initialArticleId]);

  // Function to notify when titles are loaded
  const notifyTitlesLoaded = useCallback((titles: string[], receivedArticleId?: string) => {
    if (onTitlesLoadedRef.current && titles.length > 0) {
      console.log("Notifying callback with loaded titles:", titles, "Article ID:", receivedArticleId);
      onTitlesLoadedRef.current(titles, receivedArticleId);
    }
  }, []);

  // Handle errors from polling
  const handlePollingError = useCallback((error: Error) => {
    // Only show toast for errors when explicitly forced (e.g. user clicked refresh)
    console.error("Error polling for titles:", error.message);
  }, []);

  // Handle titles found from polling
  const handleTitlesFound = useCallback((titles: string[], receivedArticleId?: string) => {
    if (titles.length > 0) {
      // Check if they're different from current titles
      const isNewTitles = JSON.stringify(titles) !== JSON.stringify(suggestedTitles);
      
      if (isNewTitles) {
        console.log("New titles received from polling:", titles);
        setSuggestedTitles(titles);
        setTitlesLoaded(true);
        
        if (receivedArticleId) {
          setArticleId(receivedArticleId);
        }
        
        // Show toast only if it's a new update and we already have titles loaded
        if (titlesLoaded || isNewTitles) {
          toast({
            title: "Títulos disponíveis",
            description: "Sugestões de títulos foram recebidas."
          });
        }
      }
    }
  }, [suggestedTitles, titlesLoaded, toast]);

  // Set up title polling
  const { isLoading, error, refetch } = useTitlePolling({
    articleId,
    shouldPoll,
    onTitlesFound: handleTitlesFound,
    onError: handlePollingError,
    initialRefresh: !!initialArticleId
  });

  // Subscribe to title updates from the service
  useEffect(() => {
    console.log("Subscribing to title updates, article_id:", articleId);
    
    // First, try to use titles that are already in memory
    const currentTitles = getSuggestedTitles();
    const currentStoredArticleId = getCurrentArticleId();
    
    if (currentTitles.length > 0) {
      console.log("Titles already exist in memory:", currentTitles, "Article ID:", currentStoredArticleId);
      setSuggestedTitles(currentTitles);
      setTitlesLoaded(true);
      notifyTitlesLoaded(currentTitles, currentStoredArticleId || undefined);
    }
    
    // Subscribe for future updates
    const unsubscribe = subscribeTitleUpdates((titles, receivedArticleId) => {
      console.log("Received title update via subscription:", titles, "Article ID:", receivedArticleId);
      if (titles && titles.length > 0) {
        // Check if the titles are different from what we already have
        const isNewTitles = JSON.stringify(titles) !== JSON.stringify(suggestedTitles);
        
        // If a specific article_id was provided and it doesn't match what we're looking for, ignore
        if (articleId && receivedArticleId && articleId !== receivedArticleId) {
          console.log("Ignoring update for different article_id. Expected:", articleId, "Received:", receivedArticleId);
          return;
        }
        
        if (isNewTitles) {
          console.log("New titles received, updating state and notifying");
          setSuggestedTitles(titles);
          setTitlesLoaded(true);
          setShouldPoll(true);
          
          if (receivedArticleId) {
            setArticleId(receivedArticleId);
          }
          
          notifyTitlesLoaded(titles, receivedArticleId);
          
          // Show toast only if it's the first load or if titles changed
          if (!titlesLoaded || isNewTitles) {
            toast({
              title: "Títulos disponíveis",
              description: "Sugestões de títulos foram recebidas."
            });
          }
        } else {
          console.log("Ignoring update with the same titles");
        }
      }
    });
    
    return unsubscribe;
  }, [notifyTitlesLoaded, toast, suggestedTitles, titlesLoaded, articleId]);

  return {
    suggestedTitles,
    isLoading,
    error,
    articleId,
    refetch: (specificArticleId?: string) => {
      if (specificArticleId) {
        setShouldPoll(true);
      }
      return refetch(true, specificArticleId);
    },
    titlesLoaded,
    setArticleId: (newArticleId: string) => {
      setArticleId(newArticleId);
      setCurrentArticleId(newArticleId);
      setShouldPoll(true);
    },
    setShouldPoll
  };
}

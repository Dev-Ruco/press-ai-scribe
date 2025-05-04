
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSessionState } from "./useSessionState";
import { useSessionProgress } from "./useSessionProgress";
import { useContentHandlers } from "./useContentHandlers";
import { useProcessQueue } from "./useProcessQueue";
import { useAutosave } from "./useAutosave";
import { ArticleTypeObject } from "@/types/article";

// Define a default article type to use when none is provided
const defaultArticleType: ArticleTypeObject = {
  id: "article",
  label: "Artigo",
  structure: ["Introdução", "Desenvolvimento", "Conclusão"]
};

export function useArticleSession({ onWorkflowUpdate }) {
  const { sessionState, setSessionState } = useSessionState();
  const { toast } = useToast();
  
  // Ensure article type is always defined
  useEffect(() => {
    if (!sessionState.articleType) {
      setSessionState(prev => ({
        ...prev,
        articleType: defaultArticleType
      }));
    }
  }, [sessionState.articleType, setSessionState]);
  
  // Get progress handlers
  const { 
    updateFileStatus, 
    updateLinkStatus, 
    updateSessionProgress 
  } = useSessionProgress(sessionState, setSessionState);
  
  // Get content handlers
  const { 
    setTextContent, 
    setArticleType, 
    addFilesToQueue, 
    removeFileFromQueue, 
    addLink, 
    removeLink 
  } = useContentHandlers(sessionState, setSessionState);
  
  // Get processing handlers
  const { 
    processQueue, 
    isProcessing 
  } = useProcessQueue();
  
  // Setup autosave
  useAutosave(sessionState);

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('articleDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setSessionState(prevState => ({
          ...prevState,
          textContent: draft.textContent || prevState.textContent,
          articleType: draft.articleType || defaultArticleType
        }));
        
        toast({
          title: "Draft loaded",
          description: "Your previous draft has been restored"
        });
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, [toast]);

  // Cancelation handler implementation
  const cancelProcessing = () => {
    setSessionState(prev => ({
      ...prev,
      status: 'cancelled',
      processingProgress: 0,
      processingMessage: 'Processing cancelled'
    }));
  };

  // Validate if the session has valid content
  const hasValidContent = sessionState.textContent.trim().length > 0 || 
                        sessionState.files.length > 0 || 
                        sessionState.links.length > 0;
  
  // Check if uploads are in progress
  const hasUploadsInProgress = sessionState.files.some(item => item.status === 'uploading') || 
                             sessionState.status === 'uploading';

  return {
    // State
    sessionState,
    // File functions
    addFilesToQueue,
    removeFileFromQueue,
    // Link functions
    addLink,
    removeLink,
    // Text functions
    content: sessionState.textContent,
    setContent: setTextContent,
    // Article type
    articleType: sessionState.articleType || defaultArticleType, // Provide default if undefined
    setArticleType,
    // Process
    processQueue,
    cancelProcessing,
    // Status flags
    isProcessing: sessionState.status === 'uploading' || sessionState.status === 'processing',
    hasValidContent,
    hasUploadsInProgress,
    estimatedTimeRemaining: sessionState.estimatedTimeRemaining
  };
}

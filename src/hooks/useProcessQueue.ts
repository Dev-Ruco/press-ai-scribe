import { useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { SessionState, UploadFile, UploadLink } from "./useSessionState";
import { sendArticleToN8N, N8N_WEBHOOK_URL } from "@/utils/webhookUtils";

// Configuration
const MAX_CONCURRENT_UPLOADS = 3;
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second

export function useProcessQueue(
  sessionState: SessionState,
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>,
  updateFileStatus: (fileId: string, updates: Partial<UploadFile>) => void,
  updateLinkStatus: (linkId: string, updates: Partial<UploadLink>) => void,
  updateSessionProgress: () => void,
  onWorkflowUpdate: (data: any) => void
) {
  const { toast } = useToast();
  const activeUploadsRef = useRef<number>(0);
  const cancelledRef = useRef<boolean>(false);

  // Process a single file
  const processFile = useCallback(async (file: UploadFile): Promise<boolean> => {
    try {
      updateFileStatus(file.id, { status: 'uploading', progress: 0 });
      
      // Upload the file with progress tracking
      const onProgress = (progress: number) => {
        if (cancelledRef.current) return;
        updateFileStatus(file.id, { progress });
        updateSessionProgress();
      };
      
      // Add session info to the file upload
      const result = await sendArticleToN8N(
        file.file.name,
        'File Upload',
        [{
          url: file.file.name,
          fileName: file.file.name,
          mimeType: file.file.type || 'application/octet-stream',
          fileType: 'document',
          fileSize: file.file.size
        }],
        [],
        onProgress
      );
      
      if (result?.success) {
        updateFileStatus(file.id, { status: 'completed', progress: 100 });
        return true;
      } else {
        throw new Error(result?.error || `Upload failed to ${N8N_WEBHOOK_URL}`);
      }
    } catch (error) {
      console.error(`Error uploading file ${file.file.name} to ${N8N_WEBHOOK_URL}:`, error);
      
      // Retry logic
      if (file.retries < MAX_RETRIES) {
        const nextRetryDelay = RETRY_DELAY_BASE * Math.pow(2, file.retries);
        console.log(`Will retry file ${file.file.name} in ${nextRetryDelay}ms (attempt ${file.retries + 1}/${MAX_RETRIES})`);
        
        updateFileStatus(file.id, { 
          status: 'queued',
          progress: 0,
          retries: file.retries + 1
        });
        
        await new Promise(resolve => setTimeout(resolve, nextRetryDelay));
        return false; // Will be retried
      }
      
      updateFileStatus(file.id, { 
        status: 'error', 
        error: error.message || `Upload failed to ${N8N_WEBHOOK_URL}`
      });
      
      toast({
        variant: "destructive",
        title: `Error uploading ${file.file.name}`,
        description: `Upload to ${N8N_WEBHOOK_URL} failed: ${error.message || 'Unknown error'}`
      });
      
      return false;
    }
  }, [sessionState.sessionId, toast, updateFileStatus, updateSessionProgress]);

  // Process a single link
  const processLink = useCallback(async (link: UploadLink): Promise<boolean> => {
    try {
      updateLinkStatus(link.id, { status: 'processing' });
      
      const result = await sendArticleToN8N(
        link.url,
        "Link",
        [],
        [link.url]
      );
      
      if (result?.success) {
        updateLinkStatus(link.id, { status: 'completed' });
        return true;
      } else {
        throw new Error(result?.error || `Link processing failed on ${N8N_WEBHOOK_URL}`);
      }
    } catch (error) {
      console.error(`Error processing link ${link.url} on ${N8N_WEBHOOK_URL}:`, error);
      updateLinkStatus(link.id, { 
        status: 'error', 
        error: error.message || `Processing failed on ${N8N_WEBHOOK_URL}`
      });
      
      toast({
        variant: "destructive",
        title: `Error processing link`,
        description: `Link processing on ${N8N_WEBHOOK_URL} failed: ${error.message || 'Unknown error'}`
      });
      
      return false;
    }
  }, [sessionState.sessionId, toast, updateLinkStatus]);

  // Process text content
  const processTextContent = useCallback(async (text: string): Promise<boolean> => {
    if (!text.trim()) return true;
    
    try {
      // Create a simplified payload for sendArticleToN8N
      const result = await sendArticleToN8N(
        text,
        "Text Content",
        [], // No files
        [] // No links
      );
      
      return result?.success || false;
    } catch (error) {
      console.error('Error processing text content:', error);
      
      toast({
        variant: "destructive",
        title: "Error processing text",
        description: error.message || 'Failed to process text content'
      });
      
      return false;
    }
  }, [sessionState.sessionId, toast]);

  // Start session and notify webhook
  const startSession = useCallback(async () => {
    try {
      // Start a new session
      const newSessionId = uuidv4();
      setSessionState(prev => ({
        ...prev,
        sessionId: newSessionId,
        status: 'preparing',
        startTime: Date.now()
      }));
      
      // Notify webhook about session start
      await sendArticleToN8N(
        `Sessão iniciada: ${newSessionId}`,
        "Session Start",
        [],
        []
      );
      
      return true;
    } catch (error) {
      console.error('Error starting session:', error);
      setSessionState(prev => ({
        ...prev, 
        status: 'error',
        error: error.message || 'Failed to start session'
      }));
      return false;
    }
  }, [sessionState.articleType, sessionState.files.length, sessionState.links.length, sessionState.textContent, setSessionState]);

  // End session and notify webhook
  const endSession = useCallback(async (status: 'completed' | 'error' | 'cancelled', error?: string) => {
    try {
      // Notify webhook about session end
      await sendArticleToN8N(
        `Sessão finalizada: ${sessionState.sessionId}, Status: ${status}, Erro: ${error || 'Nenhum'}`,
        "Session End",
        [],
        []
      );
      
      return true;
    } catch (endError) {
      console.error('Error ending session:', endError);
      return false;
    } finally {
      setSessionState(prev => ({ 
        ...prev, 
        status: status as SessionState['status'],
        error: error || prev.error
      }));
    }
  }, [sessionState.sessionId, sessionState.startTime, setSessionState]);

  // Process the queue with concurrency control
  const processQueue = useCallback(async () => {
    if (sessionState.status === 'uploading') {
      return; // Already processing
    }
    
    // Start the session
    cancelledRef.current = false;
    const sessionStarted = await startSession();
    if (!sessionStarted) return;
    
    setSessionState(prev => ({ 
      ...prev, 
      status: 'uploading',
      processingStage: 'uploading',
      processingProgress: 0,
      processingMessage: 'Preparing files for upload...'
    }));
    
    try {
      // Process files in batches with concurrency limit
      const processFiles = async () => {
        const pendingFiles = sessionState.files.filter(f => f.status === 'queued');
        
        for (let i = 0; i < pendingFiles.length; i += MAX_CONCURRENT_UPLOADS) {
          if (cancelledRef.current) break;
          
          const batch = pendingFiles.slice(i, i + MAX_CONCURRENT_UPLOADS);
          activeUploadsRef.current = batch.length;
          
          // Update processing message
          setSessionState(prev => ({
            ...prev,
            processingMessage: `Uploading files ${i + 1}-${Math.min(i + batch.length, pendingFiles.length)} of ${pendingFiles.length}...`
          }));
          
          // Process batch in parallel
          await Promise.all(batch.map(file => processFile(file)));
          activeUploadsRef.current = 0;
          
          // Update overall progress after each batch
          updateSessionProgress();
          
          if (cancelledRef.current) break;
        }
      };
      
      // Process links
      const processLinks = async () => {
        const links = sessionState.links;
        if (links.length === 0) return;
        
        setSessionState(prev => ({
          ...prev,
          processingMessage: `Processing ${links.length} links...`
        }));
        
        for (const link of links) {
          if (cancelledRef.current) break;
          await processLink(link);
          updateSessionProgress();
        }
      };
      
      // Process text content
      const processText = async () => {
        if (!sessionState.textContent.trim()) return true;
        
        setSessionState(prev => ({
          ...prev,
          processingMessage: 'Processing text content...'
        }));
        
        return processTextContent(sessionState.textContent);
      };
      
      // Execute all processes in sequence
      await processFiles();
      if (cancelledRef.current) {
        await endSession('cancelled');
        return;
      }
      
      await processLinks();
      if (cancelledRef.current) {
        await endSession('cancelled');
        return;
      }
      
      const textSuccess = await processText();
      if (!textSuccess || cancelledRef.current) {
        await endSession('error', !textSuccess ? 'Failed to process text content' : undefined);
        return;
      }
      
      // Simulate processing stages - in a real implementation these would be progress updates from the backend
      setSessionState(prev => ({
        ...prev,
        processingStage: 'analyzing',
        processingProgress: 30,
        processingMessage: 'Analyzing content...'
      }));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (cancelledRef.current) {
        await endSession('cancelled');
        return;
      }
      
      setSessionState(prev => ({
        ...prev,
        processingStage: 'extracting',
        processingProgress: 60,
        processingMessage: 'Extracting information...'
      }));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (cancelledRef.current) {
        await endSession('cancelled');
        return;
      }
      
      setSessionState(prev => ({
        ...prev,
        processingStage: 'organizing',
        processingProgress: 85,
        processingMessage: 'Organizing content...'
      }));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Finish session
      await endSession('completed');
      
      setSessionState(prev => ({
        ...prev,
        processingStage: 'completed',
        processingProgress: 100,
        processingMessage: 'Processing complete!'
      }));
      
      // Notify parent component
      onWorkflowUpdate({
        isProcessing: false,
        step: 'title-selection',
        files: sessionState.files.map(f => f.file),
        content: sessionState.textContent,
        links: sessionState.links,
        articleType: sessionState.articleType,
        agentConfirmed: true,
        processingStage: 'completed',
        processingProgress: 100,
        processingMessage: 'Processing completed!'
      });
      
      // Clear draft after successful submission
      localStorage.removeItem('articleDraft');
      
      toast({
        title: "Success",
        description: "All content uploaded successfully. Proceeding to next step."
      });
    } catch (error) {
      console.error('Error processing queue:', error);
      await endSession('error', error.message || 'Unknown error occurred');
      
      setSessionState(prev => ({
        ...prev,
        processingStage: 'error',
        processingMessage: error.message || 'Error processing content'
      }));
      
      onWorkflowUpdate({
        isProcessing: false,
        error: error.message || 'Unknown error',
        processingStage: 'error',
        processingProgress: 0,
        processingMessage: 'Error during processing.'
      });
      
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: error.message || 'Failed to process content'
      });
    }
  }, [
    sessionState, 
    processFile, 
    processLink, 
    processTextContent,
    startSession, 
    endSession, 
    onWorkflowUpdate, 
    updateSessionProgress, 
    toast,
    setSessionState
  ]);

  // Cancel processing
  const cancelProcessing = useCallback(() => {
    cancelledRef.current = true;
    
    toast({
      title: "Processing cancelled",
      description: "Upload process has been cancelled"
    });
    
    // End session with cancelled status
    endSession('cancelled');
  }, [endSession, toast]);

  return {
    processQueue,
    cancelProcessing
  };
}

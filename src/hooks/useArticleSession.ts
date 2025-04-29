
import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { triggerN8NWebhook, ContentPayload } from "@/utils/webhookUtils";

// Session states for better state management
export type SessionStatus = 
  | 'idle'
  | 'preparing'
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'error'
  | 'cancelled';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'queued' | 'uploading' | 'completed' | 'error';
  error?: string;
  retries: number;
}

interface UploadLink {
  url: string;
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  error?: string;
}

interface SessionState {
  sessionId: string;
  status: SessionStatus;
  textContent: string;
  files: UploadFile[];
  links: UploadLink[];
  progress: number;
  error?: string;
  processingStage: 'uploading' | 'analyzing' | 'extracting' | 'organizing' | 'completed' | 'error';
  processingProgress: number;
  processingMessage: string;
  articleType?: {
    id: string;
    label: string;
    structure: string[];
  };
  startTime?: number;
  estimatedTimeRemaining?: number;
}

// Configuration
const MAX_CONCURRENT_UPLOADS = 3;
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export function useArticleSession({ onWorkflowUpdate }) {
  const [sessionState, setSessionState] = useState<SessionState>({
    sessionId: uuidv4(),
    status: 'idle',
    textContent: '',
    files: [],
    links: [],
    progress: 0,
    processingStage: 'uploading',
    processingProgress: 0,
    processingMessage: ''
  });
  
  const { toast } = useToast();
  const activeUploadsRef = useRef<number>(0);
  // Fix: Initialize with false instead of self-referencing
  const cancelledRef = useRef<boolean>(false);
  const autoSaveTimerRef = useRef<number | null>(null);

  // Create a draft recovery system
  useEffect(() => {
    // Load draft on first render
    const savedDraft = localStorage.getItem('articleDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setSessionState(prevState => ({
          ...prevState,
          textContent: draft.textContent || prevState.textContent,
          articleType: draft.articleType || prevState.articleType
        }));
        
        toast({
          title: "Draft loaded",
          description: "Your previous draft has been restored"
        });
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }

    // Setup auto-save
    autoSaveTimerRef.current = window.setInterval(() => {
      if (sessionState.textContent.trim()) {
        localStorage.setItem('articleDraft', JSON.stringify({
          textContent: sessionState.textContent,
          articleType: sessionState.articleType,
          lastSaved: new Date().toISOString()
        }));
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Auto-save when content changes
  useEffect(() => {
    const debounceSave = setTimeout(() => {
      if (sessionState.textContent.trim() || sessionState.articleType) {
        localStorage.setItem('articleDraft', JSON.stringify({
          textContent: sessionState.textContent,
          articleType: sessionState.articleType,
          lastSaved: new Date().toISOString()
        }));
      }
    }, 2000);
    
    return () => clearTimeout(debounceSave);
  }, [sessionState.textContent, sessionState.articleType]);

  // Update content text
  const setTextContent = useCallback((text: string) => {
    setSessionState(prev => ({ ...prev, textContent: text }));
  }, []);

  // Update article type
  const setArticleType = useCallback((type: any) => {
    setSessionState(prev => ({ ...prev, articleType: type }));
  }, []);

  // Add files to queue
  const addFilesToQueue = useCallback((files: File[]) => {
    const newFiles: UploadFile[] = files.map(file => ({
      file,
      id: uuidv4(),
      progress: 0,
      status: 'queued',
      retries: 0
    }));
    
    setSessionState(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
    
    toast({
      title: `${newFiles.length} file(s) added`,
      description: "Files added to upload queue"
    });
  }, [toast]);

  // Remove file from queue
  const removeFileFromQueue = useCallback((fileId: string) => {
    setSessionState(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  }, []);

  // Add link
  const addLink = useCallback((url: string) => {
    const newLink: UploadLink = {
      url,
      id: uuidv4(),
      status: 'queued'
    };
    
    setSessionState(prev => ({
      ...prev,
      links: [...prev.links, newLink]
    }));
    
    toast({
      title: "Link added",
      description: "Link added to processing queue"
    });
    
    return newLink;
  }, [toast]);

  // Remove link
  const removeLink = useCallback((id: string) => {
    setSessionState(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== id)
    }));
  }, []);

  // Update file status in state
  const updateFileStatus = useCallback((fileId: string, updates: Partial<UploadFile>) => {
    setSessionState(prev => ({
      ...prev,
      files: prev.files.map(f => 
        f.id === fileId ? { ...f, ...updates } : f
      )
    }));
  }, []);

  // Update link status in state
  const updateLinkStatus = useCallback((linkId: string, updates: Partial<UploadLink>) => {
    setSessionState(prev => ({
      ...prev,
      links: prev.links.map(l => 
        l.id === linkId ? { ...l, ...updates } : l
      )
    }));
  }, []);

  // Calculate and update overall session progress
  const updateSessionProgress = useCallback(() => {
    setSessionState(prev => {
      const totalItems = prev.files.length + prev.links.length + (prev.textContent ? 1 : 0);
      if (totalItems === 0) return prev;
      
      // Calculate weighted progress
      const filesProgress = prev.files.reduce((sum, file) => sum + file.progress, 0) / Math.max(1, prev.files.length * 100);
      const linksProgress = prev.links.filter(l => l.status === 'completed').length / Math.max(1, prev.links.length);
      const textProgress = prev.textContent ? 0 : 1; // Text will be processed at the end
      
      // Weight different content types
      const fileWeight = prev.files.length > 0 ? 0.6 : 0;
      const linkWeight = prev.links.length > 0 ? 0.3 : 0;
      const textWeight = prev.textContent ? 0.1 : 0;
      const totalWeight = fileWeight + linkWeight + textWeight || 1;
      
      const overallProgress = Math.round(
        ((filesProgress * fileWeight) + 
         (linksProgress * linkWeight) + 
         (textProgress * textWeight)) / totalWeight * 100
      );
      
      // Calculate time estimate for remaining uploads
      let estimatedTimeRemaining = undefined;
      if (prev.startTime && overallProgress > 0 && overallProgress < 100) {
        const elapsedTime = Date.now() - prev.startTime;
        const estimatedTotalTime = (elapsedTime / overallProgress) * 100;
        estimatedTimeRemaining = Math.max(0, estimatedTotalTime - elapsedTime);
      }
      
      return {
        ...prev,
        progress: overallProgress,
        estimatedTimeRemaining
      };
    });
  }, []);

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
      const result = await triggerN8NWebhook({
        id: file.id,
        type: 'file',
        mimeType: file.file.type || 'application/octet-stream',
        data: file.file,
        authMethod: null,
        sessionId: sessionState.sessionId
      }, onProgress);
      
      if (result?.success) {
        updateFileStatus(file.id, { status: 'completed', progress: 100 });
        return true;
      } else {
        throw new Error(result?.message || "Upload failed");
      }
    } catch (error) {
      console.error(`Error uploading file ${file.file.name}:`, error);
      
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
        error: error.message || 'Upload failed'
      });
      
      toast({
        variant: "destructive",
        title: `Error uploading ${file.file.name}`,
        description: error.message || 'Upload failed'
      });
      
      return false;
    }
  }, [sessionState.sessionId, toast, updateFileStatus, updateSessionProgress]);

  // Process a single link
  const processLink = useCallback(async (link: UploadLink): Promise<boolean> => {
    try {
      updateLinkStatus(link.id, { status: 'processing' });
      
      const result = await triggerN8NWebhook({
        id: link.id,
        type: 'link',
        mimeType: 'text/uri-list',
        data: link.url,
        authMethod: null,
        sessionId: sessionState.sessionId
      });
      
      if (result?.success) {
        updateLinkStatus(link.id, { status: 'completed' });
        return true;
      } else {
        throw new Error(result?.message || "Link processing failed");
      }
    } catch (error) {
      console.error(`Error processing link ${link.url}:`, error);
      updateLinkStatus(link.id, { status: 'error', error: error.message || 'Processing failed' });
      
      toast({
        variant: "destructive",
        title: `Error processing link`,
        description: error.message || 'Link processing failed'
      });
      
      return false;
    }
  }, [sessionState.sessionId, toast, updateLinkStatus]);

  // Process text content
  const processTextContent = useCallback(async (text: string): Promise<boolean> => {
    if (!text.trim()) return true;
    
    try {
      const result = await triggerN8NWebhook({
        id: uuidv4(),
        type: 'text',
        mimeType: 'text/plain',
        data: text,
        authMethod: null,
        sessionId: sessionState.sessionId
      });
      
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
      await triggerN8NWebhook({
        id: newSessionId,
        type: 'session-start',
        mimeType: 'application/json',
        data: JSON.stringify({
          articleType: sessionState.articleType,
          filesCount: sessionState.files.length,
          linksCount: sessionState.links.length,
          hasTextContent: !!sessionState.textContent.trim()
        }),
        authMethod: null,
        sessionId: newSessionId
      });
      
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
  }, [sessionState.articleType, sessionState.files.length, sessionState.links.length, sessionState.textContent]);

  // End session and notify webhook
  const endSession = useCallback(async (status: 'completed' | 'error' | 'cancelled', error?: string) => {
    try {
      // Notify webhook about session end
      await triggerN8NWebhook({
        id: uuidv4(),
        type: 'session-end',
        mimeType: 'application/json',
        data: JSON.stringify({
          status,
          error,
          sessionDuration: Date.now() - (sessionState.startTime || Date.now())
        }),
        authMethod: null,
        sessionId: sessionState.sessionId
      });
      
      return true;
    } catch (endError) {
      console.error('Error ending session:', endError);
      return false;
    } finally {
      setSessionState(prev => ({ 
        ...prev, 
        status: status as SessionStatus,
        error: error || prev.error
      }));
    }
  }, [sessionState.sessionId, sessionState.startTime]);

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
    sessionState.status, sessionState.files, sessionState.links, sessionState.textContent,
    sessionState.articleType, processFile, processLink, processTextContent,
    startSession, endSession, onWorkflowUpdate, updateSessionProgress, toast
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
    articleType: sessionState.articleType,
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

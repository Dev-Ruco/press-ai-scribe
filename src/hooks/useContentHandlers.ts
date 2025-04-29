
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { SessionState, UploadFile, UploadLink } from "./useSessionState";

export function useContentHandlers(
  sessionState: SessionState,
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>
) {
  const { toast } = useToast();

  // Update content text
  const setTextContent = useCallback((text: string) => {
    setSessionState(prev => ({ ...prev, textContent: text }));
  }, [setSessionState]);

  // Update article type
  const setArticleType = useCallback((type: any) => {
    setSessionState(prev => ({ ...prev, articleType: type }));
  }, [setSessionState]);

  // Add files to queue
  const addFilesToQueue = useCallback((files: File[]) => {
    const newFiles: UploadFile[] = files.map(file => ({
      file,
      id: uuidv4(),
      progress: 0,
      status: 'queued' as const,
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
  }, [toast, setSessionState]);

  // Remove file from queue
  const removeFileFromQueue = useCallback((fileId: string) => {
    setSessionState(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  }, [setSessionState]);

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
  }, [toast, setSessionState]);

  // Remove link
  const removeLink = useCallback((id: string) => {
    setSessionState(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== id)
    }));
  }, [setSessionState]);

  return {
    setTextContent,
    setArticleType,
    addFilesToQueue,
    removeFileFromQueue,
    addLink,
    removeLink
  };
}

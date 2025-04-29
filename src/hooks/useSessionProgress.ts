
import { useCallback } from "react";
import { SessionState, UploadFile, UploadLink } from "./useSessionState";

export function useSessionProgress(
  sessionState: SessionState,
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>
) {
  // Update file status in state
  const updateFileStatus = useCallback((fileId: string, updates: Partial<UploadFile>) => {
    setSessionState(prev => ({
      ...prev,
      files: prev.files.map(f => 
        f.id === fileId ? { ...f, ...updates } : f
      )
    }));
  }, [setSessionState]);

  // Update link status in state
  const updateLinkStatus = useCallback((linkId: string, updates: Partial<UploadLink>) => {
    setSessionState(prev => ({
      ...prev,
      links: prev.links.map(l => 
        l.id === linkId ? { ...l, ...updates } : l
      )
    }));
  }, [setSessionState]);

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
  }, [setSessionState]);

  return {
    updateFileStatus,
    updateLinkStatus,
    updateSessionProgress
  };
}

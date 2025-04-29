
import { useEffect, useRef } from "react";
import { SessionState } from "./useSessionState";

// Configuration
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export function useAutosave(
  sessionState: SessionState,
) {
  const autoSaveTimerRef = useRef<number | null>(null);

  // Create a draft recovery system
  useEffect(() => {
    // Load draft on first render
    const savedDraft = localStorage.getItem('articleDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        return { 
          textContent: draft.textContent || "",
          articleType: draft.articleType || null
        };
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }

    return null;
  }, []);

  // Setup auto-save
  useEffect(() => {
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
  }, [sessionState.textContent, sessionState.articleType]);

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

  return {};
}

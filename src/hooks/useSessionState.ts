
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Session states for better state management
export type SessionStatus = 
  | 'idle'
  | 'preparing'
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'error'
  | 'cancelled';

export interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'queued' | 'uploading' | 'completed' | 'error';
  error?: string;
  retries: number;
}

export interface UploadLink {
  url: string;
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface SessionState {
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

const initialState: SessionState = {
  sessionId: uuidv4(),
  status: 'idle',
  textContent: '',
  files: [],
  links: [],
  progress: 0,
  processingStage: 'uploading',
  processingProgress: 0,
  processingMessage: ''
};

export function useSessionState() {
  const [sessionState, setSessionState] = useState<SessionState>(initialState);

  const resetSession = () => {
    setSessionState({
      ...initialState,
      sessionId: uuidv4()
    });
  };

  return {
    sessionState,
    setSessionState,
    resetSession
  };
}

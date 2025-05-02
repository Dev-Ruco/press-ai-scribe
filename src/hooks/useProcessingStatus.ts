
import { useState } from 'react';
import { ProcessingStatus } from '@/types/processing';

export function useProcessingStatus() {
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    stage: "idle",
    progress: 0,
    message: ""
  });

  const updateProgress = (
    stage: ProcessingStatus['stage'], 
    progress: number, 
    message: string, 
    error?: string
  ) => {
    console.log('Updating progress:', { stage, progress, message, error });
    setProcessingStatus({ stage, progress, message, error });
  };

  return {
    processingStatus,
    updateProgress,
  };
}

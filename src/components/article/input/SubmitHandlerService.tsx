
import { useState, useCallback } from 'react';

interface SubmitHandlerProps {
  isProcessing: boolean;
  onSubmit: () => void;
  onNextStep?: () => Promise<string | undefined> | void;
}

export function useSubmitHandler({ isProcessing, onSubmit, onNextStep }: SubmitHandlerProps) {
  const [isAdvancing, setIsAdvancing] = useState(false);
  
  const handleSubmitAndAdvance = useCallback(() => {
    onSubmit();
    
    // Only attempt to advance if we have a next step function and aren't processing
    if (!isProcessing && onNextStep && !isAdvancing) {
      setIsAdvancing(true);
      
      // Add a small delay to ensure processing has completed
      setTimeout(async () => {
        if (!isProcessing && onNextStep) {
          try {
            await onNextStep();
          } catch (error) {
            console.error('Error advancing to next step:', error);
          } finally {
            setIsAdvancing(false);
          }
        } else {
          setIsAdvancing(false);
        }
      }, 1500);
    }
  }, [isProcessing, onSubmit, onNextStep, isAdvancing]);

  return { handleSubmitAndAdvance, isAdvancing };
}

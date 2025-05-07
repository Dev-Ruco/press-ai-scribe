
import { useEffect, useRef } from "react";
import { WorkflowState } from "@/types/workflow";

export function useWorkflowAutoTransition(
  workflowState: WorkflowState,
  moveToNextStepIfValid: () => Promise<string | undefined>
) {
  // Use a ref to track previous state for comparison
  const prevStateRef = useRef<{
    agentConfirmed?: boolean;
    suggestedTitles?: string[];
    step?: string;
    isProcessing?: boolean;
  }>({});
  
  // Track auto advance attempts and success status
  const autoAdvanceAttemptsRef = useRef(0);
  const autoAdvanceSuccessRef = useRef(false);
  const maxAutoAdvanceAttempts = 3;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor changes to critical states to auto-advance workflow
  useEffect(() => {
    console.log("useWorkflowAutoTransition - Monitorando mudanças de estado:", { 
      agentConfirmed: workflowState.agentConfirmed,
      suggestedTitlesLength: workflowState.suggestedTitles?.length || 0,
      currentStep: workflowState.step,
      isProcessing: workflowState.isProcessing,
      autoAdvanceAttempts: autoAdvanceAttemptsRef.current,
      autoAdvanceSuccess: autoAdvanceSuccessRef.current
    });
    
    const prevState = prevStateRef.current;
    
    // Clear any pending timeout on new state change
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Update reference for next comparison
    prevStateRef.current = {
      agentConfirmed: workflowState.agentConfirmed,
      suggestedTitles: workflowState.suggestedTitles,
      step: workflowState.step,
      isProcessing: workflowState.isProcessing
    };
    
    // Reset attempts if we've changed steps
    if (prevState.step && workflowState.step !== prevState.step) {
      console.log("Reset auto-advance attempts due to step change");
      autoAdvanceAttemptsRef.current = 0;
      autoAdvanceSuccessRef.current = false;
    }
    
    // Don't try to auto-advance if we've reached the maximum number of attempts
    // or we've already successfully auto-advanced
    if (autoAdvanceAttemptsRef.current >= maxAutoAdvanceAttempts || autoAdvanceSuccessRef.current) {
      if (autoAdvanceAttemptsRef.current >= maxAutoAdvanceAttempts) {
        console.log("Máximo de tentativas de avanço automático atingido:", autoAdvanceAttemptsRef.current);
      }
      if (autoAdvanceSuccessRef.current) {
        console.log("Avanço automático já realizado com sucesso");
      }
      return;
    }
    
    // Auto-advance when agent confirms processing or titles are available, but only when not processing
    // And only when we're in the upload step
    const canAutoAdvance = 
      workflowState.step === "upload" && 
      !workflowState.isProcessing && 
      (
        // Either agent confirmation changed to true
        (workflowState.agentConfirmed && !prevState.agentConfirmed) || 
        // Or we received valid titles and didn't have any before
        (workflowState.suggestedTitles?.length > 0 && 
          (!prevState.suggestedTitles || prevState.suggestedTitles.length === 0))
      );
      
    if (canAutoAdvance) {
      // Additional check to ensure we have valid titles
      const hasTitles = Array.isArray(workflowState.suggestedTitles) && 
                       workflowState.suggestedTitles.length > 0;
                       
      console.log("Detectada condição para avanço automático:", {
        agentConfirmou: workflowState.agentConfirmed,
        temTitulos: hasTitles,
        titulosDisponiveis: workflowState.suggestedTitles
      });
      
      // Increment attempts counter
      autoAdvanceAttemptsRef.current++;
      
      console.log(`Tentativa ${autoAdvanceAttemptsRef.current} de ${maxAutoAdvanceAttempts} para avançar automaticamente`);
      
      // Small delay to ensure that the state was fully updated
      // Use progressive delay for retries
      const delay = Math.min(1000 * autoAdvanceAttemptsRef.current, 3000);
      console.log(`Agendando avanço automático em ${delay}ms`);
      
      timeoutRef.current = setTimeout(() => {
        console.log("Executando avanço automático agendado");
        moveToNextStepIfValid()
          .then(nextStep => {
            console.log("Resultado da tentativa de avanço automático:", nextStep);
            if (nextStep) {
              // Mark as successful if we got a valid next step
              autoAdvanceSuccessRef.current = true;
              console.log("Avanço automático bem-sucedido para:", nextStep);
            }
          })
          .catch(err => {
            console.error("Erro ao tentar avançar automaticamente:", err);
          });
      }, delay);
      
      // Return cleanup that cancels the timer if component unmounts or state changes again
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }
    
    // No cleanup needed if we didn't set a timer
    return undefined;
  }, [
    workflowState.agentConfirmed, 
    workflowState.suggestedTitles, 
    workflowState.step, 
    workflowState.isProcessing, 
    moveToNextStepIfValid
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
}

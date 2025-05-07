
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
  
  // Track auto advance attempts
  const autoAdvanceAttemptsRef = useRef(0);
  const maxAutoAdvanceAttempts = 3;

  // Monitor changes to critical states to auto-advance workflow
  useEffect(() => {
    console.log("useWorkflowAutoTransition - Monitorando mudanças de estado:", { 
      agentConfirmed: workflowState.agentConfirmed,
      suggestedTitlesLength: workflowState.suggestedTitles?.length || 0,
      currentStep: workflowState.step,
      isProcessing: workflowState.isProcessing,
      autoAdvanceAttempts: autoAdvanceAttemptsRef.current
    });
    
    const prevState = prevStateRef.current;
    
    // Update reference for next comparison
    prevStateRef.current = {
      agentConfirmed: workflowState.agentConfirmed,
      suggestedTitles: workflowState.suggestedTitles,
      step: workflowState.step,
      isProcessing: workflowState.isProcessing
    };
    
    // Don't try to auto-advance if we've reached the maximum number of attempts
    if (autoAdvanceAttemptsRef.current >= maxAutoAdvanceAttempts) {
      console.log("Máximo de tentativas de avanço automático atingido:", autoAdvanceAttemptsRef.current);
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
      // Verificação adicional para garantir que temos títulos válidos
      const hasTitles = Array.isArray(workflowState.suggestedTitles) && 
                       workflowState.suggestedTitles.length > 0;
                       
      console.log("Detectada condição para avanço automático:", {
        agentConfirmou: workflowState.agentConfirmed,
        temTitulos: hasTitles,
        titulosDisponiveis: workflowState.suggestedTitles
      });
      
      // Still auto advance even without titles, it will just go to the title selection screen
      // where the user can select from defaults or create their own
      
      console.log("Avançando automaticamente para o próximo passo...");
      
      // Increment attempts counter
      autoAdvanceAttemptsRef.current++;
      
      // Pequeno atraso para garantir que o estado foi totalmente atualizado
      const timer = setTimeout(() => {
        moveToNextStepIfValid().then(nextStep => {
          console.log("Resultado da tentativa de avanço automático:", nextStep);
          if (nextStep) {
            // Reset attempts if successful
            autoAdvanceAttemptsRef.current = 0;
          }
        }).catch(err => {
          console.error("Erro ao tentar avançar automaticamente:", err);
        });
      }, 1000); // Slightly longer delay to ensure state is fully processed
      
      return () => clearTimeout(timer);
    }
  }, [
    workflowState.agentConfirmed, 
    workflowState.suggestedTitles, 
    workflowState.step, 
    workflowState.isProcessing, 
    moveToNextStepIfValid
  ]);
}

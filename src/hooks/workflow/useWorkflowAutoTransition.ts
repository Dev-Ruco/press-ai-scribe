
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

  // Monitor changes to critical states to auto-advance workflow
  useEffect(() => {
    console.log("useWorkflowAutoTransition - Monitorando mudanças de estado:", { 
      agentConfirmed: workflowState.agentConfirmed,
      suggestedTitlesLength: workflowState.suggestedTitles?.length || 0,
      currentStep: workflowState.step,
      isProcessing: workflowState.isProcessing
    });
    
    const prevState = prevStateRef.current;
    
    // Update reference for next comparison
    prevStateRef.current = {
      agentConfirmed: workflowState.agentConfirmed,
      suggestedTitles: workflowState.suggestedTitles,
      step: workflowState.step,
      isProcessing: workflowState.isProcessing
    };
    
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
      
      if (!hasTitles) {
        console.log("Não avançando automaticamente porque não há títulos válidos");
        return;
      }
      
      console.log("Avançando automaticamente para o próximo passo...");
      
      // Pequeno atraso para garantir que o estado foi totalmente atualizado
      const timer = setTimeout(() => {
        moveToNextStepIfValid().then(nextStep => {
          console.log("Resultado da tentativa de avanço automático:", nextStep);
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

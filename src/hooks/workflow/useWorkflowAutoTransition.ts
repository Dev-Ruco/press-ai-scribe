
import { useEffect } from "react";
import { WorkflowState } from "@/types/workflow";

export function useWorkflowAutoTransition(
  workflowState: WorkflowState,
  moveToNextStepIfValid: () => Promise<string | undefined>
) {
  // Monitor changes to critical states to auto-advance workflow
  useEffect(() => {
    console.log("useWorkflowAutoTransition - Monitorando mudanças de estado:", { 
      agentConfirmed: workflowState.agentConfirmed,
      suggestedTitles: workflowState.suggestedTitles,
      currentStep: workflowState.step,
      isProcessing: workflowState.isProcessing
    });
    
    // Auto-advance when agent confirms processing or titles are available, but only when not processing
    if (
      workflowState.step === "upload" && 
      !workflowState.isProcessing && 
      (workflowState.agentConfirmed || (workflowState.suggestedTitles?.length > 0))
    ) {
      console.log("Detectada confirmação ou títulos, tentando avançar automaticamente...");
      // Pequeno atraso para garantir que o estado foi totalmente atualizado
      const timer = setTimeout(() => {
        moveToNextStepIfValid().then(nextStep => {
          console.log("Resultado da tentativa de avanço automático:", nextStep);
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [workflowState.agentConfirmed, workflowState.suggestedTitles, workflowState.step, workflowState.isProcessing, moveToNextStepIfValid]);
}

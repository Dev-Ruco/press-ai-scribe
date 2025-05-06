
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
      currentStep: workflowState.step
    });
    
    // Auto-advance when agent confirms processing
    if (workflowState.agentConfirmed && workflowState.step === "upload") {
      console.log("Detectada confirmação do agente, tentando avançar automaticamente...");
      moveToNextStepIfValid().then(nextStep => {
        console.log("Resultado da tentativa de avanço automático:", nextStep);
      });
    }
    
    // Auto-advance when titles are suggested but we're still in the first step
    if (workflowState.suggestedTitles?.length > 0 && workflowState.step === "upload" && !workflowState.isProcessing) {
      console.log("Detectados títulos sugeridos, tentando avançar automaticamente...");
      moveToNextStepIfValid().then(nextStep => {
        console.log("Resultado da tentativa de avanço automático:", nextStep);
      });
    }
    
  }, [workflowState.agentConfirmed, workflowState.suggestedTitles, workflowState.step, workflowState.isProcessing, moveToNextStepIfValid]);
}

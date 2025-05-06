
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
    
    // Auto-advance when agent confirms processing or titles are available
    if (workflowState.step === "upload" && !workflowState.isProcessing) {
      if (workflowState.agentConfirmed || (workflowState.suggestedTitles?.length > 0)) {
        console.log("Detectada confirmação ou títulos, tentando avançar automaticamente...");
        moveToNextStepIfValid().then(nextStep => {
          console.log("Resultado da tentativa de avanço automático:", nextStep);
        });
      }
    }
  }, [workflowState.agentConfirmed, workflowState.suggestedTitles, workflowState.step, workflowState.isProcessing, moveToNextStepIfValid]);
}

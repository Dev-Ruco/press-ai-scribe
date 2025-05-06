
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validateWorkflowTransition } from "@/utils/workflowValidation";
import { WorkflowState, WorkflowStep } from "@/types/workflow";

export function useWorkflowNavigation(
  workflowState: WorkflowState,
  updateWorkflowState: (updates: Partial<WorkflowState>) => Promise<void>
) {
  const { toast } = useToast();

  const moveToNextStep = (currentStep: string): WorkflowStep => {
    const steps: WorkflowStep[] = [
      "upload",
      "type-selection",
      "title-selection",
      "content-editing",
      "image-selection",
      "finalization"
    ];
    const currentIndex = steps.indexOf(currentStep as WorkflowStep);
    if (currentIndex < steps.length - 1) {
      return steps[currentIndex + 1];
    }
    return currentStep as WorkflowStep;
  };

  const moveToNextStepIfValid = async () => {
    console.log("moveToNextStepIfValid chamada com estado atual:", workflowState);
    
    // Fetch next step
    const nextStep = moveToNextStep(workflowState.step);
    
    // If we're already at the last step, do nothing
    if (nextStep === workflowState.step) {
      toast({
        title: "Última etapa",
        description: "Você já está na última etapa do fluxo.",
      });
      return;
    }
    
    // Validate the transition to the next step
    const validation = validateWorkflowTransition(
      workflowState.step,
      nextStep,
      {
        files: workflowState.files,
        content: workflowState.content,
        agentConfirmed: workflowState.agentConfirmed,
        isProcessing: workflowState.isProcessing,
        suggestedTitles: workflowState.suggestedTitles,
        articleType: workflowState.articleType
      }
    );

    // If validation fails, show error message
    if (!validation.isValid) {
      console.log("Validação falhou:", validation.message);
      toast({
        title: "Não é possível prosseguir",
        description: validation.message,
        variant: "destructive"
      });
      return;
    }
    
    console.log("Validação passou, avançando para:", nextStep);
    
    // If validation passes, update the state to the next step
    await updateWorkflowState({ step: nextStep });
    
    toast({
      title: "Avançando",
      description: `Avançando para a etapa: ${nextStep}`,
    });
    
    return nextStep;
  };

  return {
    moveToNextStep,
    moveToNextStepIfValid
  };
}

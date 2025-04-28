
import { toast } from "@/hooks/use-toast";

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateWorkflowTransition = (
  currentStep: string,
  nextStep: string,
  state: {
    files?: any[];
    content?: string;
    agentConfirmed?: boolean;
    isProcessing?: boolean;
  }
): ValidationResult => {
  // Validation for moving from upload to type selection
  if (currentStep === "upload" && nextStep === "type-selection") {
    if (!state.files?.length && !state.content?.trim()) {
      return {
        isValid: false,
        message: "Adicione algum conteúdo ou arquivo antes de continuar."
      };
    }
    
    if (!state.agentConfirmed) {
      return {
        isValid: false,
        message: "Aguarde o processamento do conteúdo ser concluído."
      };
    }
  }

  return { isValid: true };
};

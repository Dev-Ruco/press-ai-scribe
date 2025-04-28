
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
    articleType?: { id: string; label: string; structure: string[] };
  }
): ValidationResult => {
  // Validation for moving from upload to title selection
  if (currentStep === "upload" && nextStep === "title-selection") {
    if (!state.files?.length && !state.content?.trim()) {
      return {
        isValid: false,
        message: "Adicione algum conteúdo ou arquivo antes de continuar."
      };
    }
    
    if (!state.articleType) {
      return {
        isValid: false,
        message: "Selecione um tipo de artigo antes de continuar."
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

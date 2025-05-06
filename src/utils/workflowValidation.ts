
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
    suggestedTitles?: string[];
  }
): ValidationResult => {
  console.log(`Validando transição de ${currentStep} para ${nextStep}`, state);
  
  // Validation for moving from upload to title selection
  if (currentStep === "upload" && nextStep === "title-selection") {
    const hasContent = state.content?.trim() && state.content?.trim().length > 0;
    const hasFiles = state.files && state.files.length > 0;
    
    if (!hasContent && !hasFiles) {
      return {
        isValid: false,
        message: "Adicione algum conteúdo ou arquivo antes de continuar."
      };
    }
    
    // Allow transition if we have agent confirmed or suggested titles
    if (state.agentConfirmed || (state.suggestedTitles && state.suggestedTitles.length > 0)) {
      console.log("Transição permitida: agentConfirmed ou títulos disponíveis");
      return { isValid: true };
    }
    
    return {
      isValid: false,
      message: "Aguarde o processamento do conteúdo ser concluído."
    };
  }

  // Allow all other transitions by default
  console.log("Outra transição permitida por padrão");
  return { isValid: true };
};

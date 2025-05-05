
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseSubmitHandlerProps {
  isProcessing: boolean;
  onSubmit: () => void;
  onNextStep?: () => Promise<string | undefined> | void;
}

export function useSubmitHandler({ 
  isProcessing, 
  onSubmit, 
  onNextStep 
}: UseSubmitHandlerProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAndAdvance = async () => {
    if (isProcessing || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Chamar o envio do formulário
      onSubmit();
      
      // Avançar imediatamente para a próxima etapa se existir
      if (onNextStep) {
        const nextStep = await onNextStep();
        if (nextStep) {
          console.log(`Avançado para a etapa: ${nextStep}`);
        }
      }
    } catch (error) {
      console.error("Erro ao processar envio:", error);
      toast({
        title: "Erro ao processar",
        description: "Não foi possível processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmitAndAdvance,
    isSubmitting
  };
}

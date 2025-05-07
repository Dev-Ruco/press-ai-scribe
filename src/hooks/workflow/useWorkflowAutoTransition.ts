
import { useEffect, useRef } from "react";
import { WorkflowState } from "@/types/workflow";
import { subscribeTitleUpdates } from "@/services/titleSuggestionService";

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
      }, 800); // Reduced delay for quicker response
      
      return () => clearTimeout(timer);
    }
  }, [
    workflowState.agentConfirmed, 
    workflowState.suggestedTitles, 
    workflowState.step, 
    workflowState.isProcessing, 
    moveToNextStepIfValid
  ]);
  
  // Adicionar um listener direto para atualizações de títulos
  useEffect(() => {
    // Só monitorar quando estivermos na etapa de upload
    if (workflowState.step !== "upload" || workflowState.isProcessing) {
      return;
    }
    
    console.log("Configurando listener direto para atualizações de títulos");
    
    // Subscrever para atualizações de títulos
    const unsubscribe = subscribeTitleUpdates((titles) => {
      console.log("Títulos atualizados recebidos diretamente do serviço:", titles);
      
      // Verificar se já temos esses títulos no estado
      const existingTitles = workflowState.suggestedTitles || [];
      const hasNewTitles = titles.length > 0 && 
                           (existingTitles.length === 0 || 
                            JSON.stringify(titles) !== JSON.stringify(existingTitles));
      
      if (hasNewTitles && !workflowState.isProcessing) {
        console.log("Títulos novos detectados, tentando avançar automaticamente...");
        
        // Pequeno atraso antes de tentar avançar
        setTimeout(() => {
          moveToNextStepIfValid().then(nextStep => {
            console.log("Resultado da tentativa de avanço direto:", nextStep);
          });
        }, 800);
      }
    });
    
    return unsubscribe;
  }, [workflowState.step, workflowState.isProcessing, workflowState.suggestedTitles, moveToNextStepIfValid]);
}

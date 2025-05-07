
import { useEffect, useRef, useState } from "react";
import { WorkflowState } from "@/types/workflow";
import { subscribeTitleUpdates, getSuggestedTitles } from "@/services/titleSuggestionService";
import { useToast } from "@/hooks/use-toast";

export function useWorkflowAutoTransition(
  workflowState: WorkflowState,
  moveToNextStepIfValid: () => Promise<string | undefined>
) {
  const { toast } = useToast();
  const [isMonitoring, setIsMonitoring] = useState(false);
  
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
        // Iniciar monitoramento
        setIsMonitoring(true);
        return;
      }
      
      console.log("Avançando automaticamente para o próximo passo...");
      
      // Notificar usuário sobre os títulos disponíveis
      toast({
        title: "Títulos disponíveis",
        description: "Sugestões de títulos foram geradas para seu artigo.",
      });
      
      // Pequeno atraso para garantir que o estado foi totalmente atualizado
      const timer = setTimeout(() => {
        moveToNextStepIfValid().then(nextStep => {
          console.log("Resultado da tentativa de avanço automático:", nextStep);
        });
      }, 800); // Reduced delay for quicker response
      
      return () => clearTimeout(timer);
    }
    
    // Se entramos na etapa de upload e não estamos processando, começar o monitoramento
    if (workflowState.step === "upload" && !workflowState.isProcessing && !isMonitoring) {
      setIsMonitoring(true);
    }
    
    // Se mudamos de etapa, parar o monitoramento
    if (workflowState.step !== "upload" && isMonitoring) {
      setIsMonitoring(false);
    }
  }, [
    workflowState.agentConfirmed, 
    workflowState.suggestedTitles, 
    workflowState.step, 
    workflowState.isProcessing, 
    moveToNextStepIfValid,
    toast,
    isMonitoring
  ]);
  
  // Monitoramento intensivo para atualizações de títulos quando estamos na etapa upload
  useEffect(() => {
    // Só monitorar quando estivermos na etapa de upload
    if (!isMonitoring || workflowState.step !== "upload" || workflowState.isProcessing) {
      return;
    }
    
    console.log("Configurando monitoramento intensivo de títulos");
    
    // Verificar se já temos títulos em cache
    const cachedTitles = getSuggestedTitles();
    if (cachedTitles.length > 0) {
      console.log("Títulos encontrados em cache:", cachedTitles);
      
      // Verificar se o workflow já tem esses títulos
      const workflowHasTitles = workflowState.suggestedTitles && 
                               workflowState.suggestedTitles.length > 0;
                               
      if (!workflowHasTitles) {
        console.log("Workflow não tem títulos, mas encontramos em cache. Atualizando...");
        
        // Pequeno delay antes de atualizar para evitar loops
        setTimeout(() => {
          const updatedTitles = getSuggestedTitles(); // Double-check again
          if (updatedTitles.length > 0) {
            // Notificar usuário sobre os títulos disponíveis
            toast({
              title: "Títulos disponíveis",
              description: "Sugestões de títulos foram encontradas para seu artigo.",
            });
            
            // Avançar para próximo passo
            moveToNextStepIfValid().then(nextStep => {
              console.log("Avançado para:", nextStep);
            });
          }
        }, 500);
      }
    }
    
    // Subscrever para atualizações de títulos
    console.log("Configurando subscriber para monitoramento de títulos");
    const unsubscribe = subscribeTitleUpdates((titles) => {
      console.log("Títulos atualizados recebidos durante monitoramento:", titles);
      
      // Verificar se já temos esses títulos no estado
      const existingTitles = workflowState.suggestedTitles || [];
      const hasNewTitles = titles.length > 0 && 
                         (existingTitles.length === 0 || 
                          JSON.stringify(titles) !== JSON.stringify(existingTitles));
      
      if (hasNewTitles && !workflowState.isProcessing) {
        console.log("Títulos novos detectados durante monitoramento, tentando avançar automaticamente...");
        
        // Notificar usuário sobre os títulos disponíveis
        toast({
          title: "Títulos disponíveis",
          description: "Sugestões de títulos foram geradas para seu artigo.",
        });
        
        // Pequeno atraso antes de tentar avançar
        setTimeout(() => {
          moveToNextStepIfValid().then(nextStep => {
            console.log("Resultado da tentativa de avanço via subscriber:", nextStep);
          });
        }, 800);
      }
    });
    
    return unsubscribe;
  }, [isMonitoring, workflowState.step, workflowState.isProcessing, workflowState.suggestedTitles, moveToNextStepIfValid, toast]);
  
  // Polling periódico para verificar por novos títulos (fallback)
  useEffect(() => {
    if (!isMonitoring || workflowState.step !== "upload" || workflowState.isProcessing) {
      return;
    }
    
    const checkInterval = setInterval(() => {
      const cachedTitles = getSuggestedTitles();
      if (cachedTitles.length > 0) {
        const existingTitles = workflowState.suggestedTitles || [];
        const hasNewTitles = existingTitles.length === 0 || 
                           JSON.stringify(cachedTitles) !== JSON.stringify(existingTitles);
                           
        if (hasNewTitles) {
          console.log("Títulos encontrados durante polling:", cachedTitles);
          
          clearInterval(checkInterval);
          
          // Notificar usuário sobre os títulos disponíveis
          toast({
            title: "Títulos disponíveis",
            description: "Sugestões de títulos foram encontradas para seu artigo.",
          });
          
          // Avançar para próximo passo
          moveToNextStepIfValid();
        }
      }
    }, 3000); // Verificar a cada 3 segundos
    
    return () => clearInterval(checkInterval);
  }, [isMonitoring, workflowState.step, workflowState.isProcessing, workflowState.suggestedTitles, moveToNextStepIfValid, toast]);
}

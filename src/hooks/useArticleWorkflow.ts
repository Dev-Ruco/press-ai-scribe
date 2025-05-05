import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateWorkflowTransition } from "@/utils/workflowValidation";
import { ArticleTypeObject } from "@/types/article";

export function useArticleWorkflow(userId: string | undefined) {
  const { toast } = useToast();
  const [workflowState, setWorkflowState] = useState({
    step: "upload",
    files: [],
    content: "",
    articleType: {
      id: "article",
      label: "Artigo",
      structure: ["Introdução", "Desenvolvimento", "Conclusão"]
    } as ArticleTypeObject,
    title: "",
    isProcessing: false,
    processingStatus: "idle", // idle, started, processing_with_agent, agent_processed, agent_error, updating_database, creating_article, completed, error
    processingStage: "uploading", // uploading, analyzing, extracting, organizing, completed, error
    processingProgress: 0,
    processingMessage: "",
    selectedImage: null as any,
    articleId: null as string | null,
    agentConfirmed: false, // track whether the agent has confirmed processing
    suggestedTitles: [] as string[] // Array para armazenar sugestões de títulos
  });

  const moveToNextStep = (currentStep: string) => {
    const steps = [
      "upload",
      "type-selection",
      "title-selection",
      "content-editing",
      "image-selection",
      "finalization"
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      return steps[currentIndex + 1];
    }
    return currentStep;
  };

  // Modificada a função para tentar avançar para a próxima etapa se for válido
  const moveToNextStepIfValid = async () => {
    // Buscar a próxima etapa
    const nextStep = moveToNextStep(workflowState.step);
    
    // Se já estamos na última etapa, não fazemos nada
    if (nextStep === workflowState.step) {
      toast({
        title: "Última etapa",
        description: "Você já está na última etapa do fluxo.",
      });
      return;
    }
    
    // Validar a transição para a próxima etapa
    const validation = validateWorkflowTransition(
      workflowState.step,
      nextStep,
      {
        files: workflowState.files,
        content: workflowState.content,
        agentConfirmed: workflowState.agentConfirmed,
        isProcessing: workflowState.isProcessing
      }
    );

    // Se a validação falhar, mostrar mensagem de erro
    if (!validation.isValid) {
      toast({
        title: "Não é possível prosseguir",
        description: validation.message,
        variant: "destructive"
      });
      return;
    }
    
    // Se a validação passar, atualizar o estado para a próxima etapa
    await handleWorkflowUpdate({ step: nextStep });
    
    toast({
      title: "Avançando",
      description: `Avançando para a etapa: ${nextStep}`,
    });
    
    return nextStep;
  };

  const handleWorkflowUpdate = async (updates: Partial<typeof workflowState>) => {
    console.log("handleWorkflowUpdate called with:", updates);
    
    // If step transition is requested, validate it
    if (updates.step && updates.step !== workflowState.step) {
      const validation = validateWorkflowTransition(
        workflowState.step,
        updates.step,
        {
          files: updates.files || workflowState.files,
          content: updates.content || workflowState.content,
          agentConfirmed: updates.agentConfirmed || workflowState.agentConfirmed,
          isProcessing: updates.isProcessing || workflowState.isProcessing
        }
      );

      if (!validation.isValid) {
        toast({
          title: "Não é possível prosseguir",
          description: validation.message,
          variant: "destructive"
        });
        return;
      }
    }
    
    // Create new state with updates
    const newState = { 
      ...workflowState, 
      ...updates,
      processingStage: updates.processingStage || workflowState.processingStage,
      processingProgress: updates.processingProgress || workflowState.processingProgress,
      processingMessage: updates.processingMessage || workflowState.processingMessage,
      suggestedTitles: updates.suggestedTitles || workflowState.suggestedTitles // Garantir que as sugestões são atualizadas
    };

    try {
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }

      // If we have an article ID, update it
      if (workflowState.articleId) {
        console.log("Updating existing article:", workflowState.articleId);
        const { error } = await supabase
          .from('articles')
          .update({
            title: newState.title || workflowState.title,
            content: newState.content || workflowState.content,
            workflow_step: newState.step || workflowState.step,
            workflow_data: {
              files: newState.files || workflowState.files,
              selectedImage: newState.selectedImage || workflowState.selectedImage,
              agentConfirmed: newState.agentConfirmed,
              processingStage: newState.processingStage,
              suggestedTitles: newState.suggestedTitles // Salvar as sugestões de título
            }
          })
          .eq('id', workflowState.articleId);

        if (error) throw error;
        console.log("Article updated successfully");
      } 
      // Create new article if needed
      else if ((newState.files && newState.files.length > 0) || 
               newState.content || 
               newState.step !== 'upload') {
        // Create new article
        console.log("Creating new article");
        setWorkflowState(prev => ({ 
          ...prev, 
          processingStatus: "creating_article",
          processingProgress: 95,
          processingMessage: "Criando novo artigo..."
        }));
        
        const { data, error } = await supabase
          .from('articles')
          .insert({
            title: newState.title || 'Novo artigo',
            content: newState.content || '',
            article_type_id: newState.articleType?.id || workflowState.articleType.id,
            workflow_step: newState.step || workflowState.step,
            workflow_data: {
              files: newState.files || workflowState.files,
              selectedImage: newState.selectedImage || workflowState.selectedImage,
              agentConfirmed: newState.agentConfirmed || workflowState.agentConfirmed,
              processingStage: newState.processingStage || workflowState.processingStage,
              suggestedTitles: newState.suggestedTitles || [] // Salvar as sugestões de título
            },
            user_id: userId
          })
          .select()
          .single();

        if (error) {
          console.error("Database insert error:", error);
          throw error;
        }

        console.log("Article created with ID:", data.id);
        newState.articleId = data.id;
      }

      // If processing is complete and we're in upload step, move to next step
      if (updates.agentConfirmed && workflowState.step === "upload") {
        toast({
          title: "Processamento concluído",
          description: "Agora você pode selecionar o tipo do artigo.",
        });
        
        // Avançar automaticamente para a próxima etapa após processamento completo
        if (workflowState.step === "upload") {
          moveToNextStepIfValid();
        }
      }

      // Se estamos na etapa de seleção de tipo e o tipo foi alterado, avançar automaticamente
      if (updates.articleType && workflowState.step === "type-selection" && !isProcessing) {
        setTimeout(() => {
          moveToNextStepIfValid();
        }, 500);
      }

      // Update local state
      setWorkflowState(newState);

    } catch (error) {
      console.error('Error updating workflow:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive"
      });
      
      setWorkflowState(prev => ({
        ...prev,
        isProcessing: false,
        processingStatus: "error",
        processingStage: "error",
        processingProgress: 0,
        processingMessage: "Ocorreu um erro durante o processamento."
      }));
    }
  };

  return {
    workflowState,
    handleWorkflowUpdate,
    moveToNextStepIfValid
  };
}

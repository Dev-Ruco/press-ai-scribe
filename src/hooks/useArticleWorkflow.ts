import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { triggerN8NWebhook, ContentPayload } from "@/utils/webhookUtils";
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
    agentConfirmed: false // track whether the agent has confirmed processing
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

  const handleWorkflowUpdate = async (updates: Partial<typeof workflowState>) => {
    console.log("handleWorkflowUpdate called with:", updates);
    
    // Create new state with updates
    const newState = { 
      ...workflowState, 
      ...updates,
      // Ensure processing status is properly set
      processingStage: updates.processingStage || workflowState.processingStage,
      processingProgress: updates.processingProgress || workflowState.processingProgress,
      processingMessage: updates.processingMessage || workflowState.processingMessage
    };

    // Special handling for completion and transitions
    if (updates.agentConfirmed && updates.step === "type-selection") {
      console.log("Agent confirmed processing, transitioning to type selection");
      newState.isProcessing = false;
      newState.processingStatus = "completed";
    }

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
              processingStage: newState.processingStage
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
              processingStage: newState.processingStage || workflowState.processingStage
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
        setWorkflowState(prev => ({
          ...prev,
          articleId: data.id
        }));
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
    handleWorkflowUpdate
  };
}

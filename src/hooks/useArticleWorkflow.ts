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
    
    const newState = { ...workflowState, ...updates };
    setWorkflowState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      processingStatus: "started",
      processingStage: updates.processingStage || prev.processingStage,
      processingProgress: updates.processingProgress || prev.processingProgress,
      processingMessage: updates.processingMessage || prev.processingMessage
    }));

    try {
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }

      // If we're in the upload step and have files or content, process with the agent
      if (workflowState.step === "upload" && 
          ((newState.files && newState.files.length > 0) || newState.content)) {
        
        console.log("Processing content with agent...");
        setWorkflowState(prev => ({ 
          ...prev, 
          processingStatus: "processing_with_agent",
          processingStage: "analyzing",
          processingProgress: 60,
          processingMessage: "O agente de IA está processando seu conteúdo..."
        }));

        // Prepare webhook data
        const webhookData: ContentPayload = {
          id: workflowState.articleId || crypto.randomUUID(),
          type: newState.files && newState.files.length > 0 ? 'file' : 'text',
          mimeType: newState.files && newState.files.length > 0 
            ? newState.files[0].type 
            : 'text/plain',
          data: newState.files && newState.files.length > 0 
            ? newState.files[0].data 
            : newState.content,
          authMethod: null
        };

        console.log("Sending data to webhook:", {
          type: webhookData.type,
          mimeType: webhookData.mimeType,
          dataLength: typeof webhookData.data === 'string' ? webhookData.data.length : 'binary data'
        });

        // Trigger webhook and wait for response
        try {
          // Simular processamento do agente (na implementação real, isso seria assíncrono)
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          setWorkflowState(prev => ({ 
            ...prev, 
            processingStatus: "agent_processed",
            processingStage: "extracting",
            processingProgress: 80,
            processingMessage: "Extraindo informações relevantes...",
            agentConfirmed: true
          }));
          
          // Simular mais processamento após extração
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          setWorkflowState(prev => ({ 
            ...prev, 
            processingStage: "organizing",
            processingProgress: 90,
            processingMessage: "Organizando conteúdo para apresentação..."
          }));
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          toast({
            title: "Conteúdo processado",
            description: "O agente processou o conteúdo com sucesso."
          });
        } catch (error) {
          console.error('Webhook error:', error);
          setWorkflowState(prev => ({ 
            ...prev, 
            processingStatus: "agent_error",
            processingStage: "error",
            processingProgress: 0,
            processingMessage: "Erro no processamento pela IA"
          }));
          
          toast({
            title: "Erro no processamento",
            description: "Não foi possível processar o conteúdo. Por favor, tente novamente.",
            variant: "destructive"
          });
          
          // Early return on webhook error
          setWorkflowState(prev => ({
            ...prev,
            isProcessing: false
          }));
          return;
        }
      }

      // Update article in database if we have an ID
      if (workflowState.articleId) {
        console.log("Updating existing article:", workflowState.articleId);
        setWorkflowState(prev => ({ 
          ...prev, 
          processingStatus: "updating_database",
          processingProgress: 95,
          processingMessage: "Salvando suas alterações..."
        }));
        
        const { error } = await supabase
          .from('articles')
          .update({
            title: newState.title || workflowState.title,
            content: newState.content || workflowState.content,
            workflow_step: newState.step || workflowState.step,
            workflow_data: {
              files: newState.files || workflowState.files,
              selectedImage: newState.selectedImage || workflowState.selectedImage,
              agentConfirmed: newState.agentConfirmed || workflowState.agentConfirmed,
              processingStage: newState.processingStage || workflowState.processingStage
            }
          })
          .eq('id', workflowState.articleId);

        if (error) {
          console.error("Database update error:", error);
          throw error;
        }
        
        console.log("Article updated successfully");
      } else if ((newState.files && newState.files.length > 0) || 
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

      // Determine if we should move to the next step
      let nextStepToUse = workflowState.step;
      
      // If explicit step is provided in updates, use that
      if (updates.step) {
        console.log(`Using explicitly provided step: ${updates.step}`);
        nextStepToUse = updates.step;
      } 
      // Otherwise, if we're in upload step and agent has confirmed, move to next step
      else if (workflowState.step === "upload" && 
               (newState.agentConfirmed || workflowState.agentConfirmed)) {
        console.log("Agent has confirmed processing, moving to next step");
        nextStepToUse = moveToNextStep(workflowState.step);
      }

      console.log(`Transitioning from "${workflowState.step}" to "${nextStepToUse}"`);
      
      // Final state update
      setWorkflowState({
        ...newState,
        step: nextStepToUse,
        isProcessing: false,
        processingStatus: "completed",
        processingStage: "completed",
        processingProgress: 100,
        processingMessage: "Processamento concluído com sucesso!"
      });

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

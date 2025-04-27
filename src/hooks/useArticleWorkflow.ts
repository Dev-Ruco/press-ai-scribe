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
    processingStatus: "idle", // new status to track processing stages
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
    setWorkflowState(prev => ({ ...prev, isProcessing: true, processingStatus: "started" }));

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
          processingStatus: "processing_with_agent" 
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
          const webhookResponse = await triggerN8NWebhook(webhookData);
          console.log("Webhook response received:", webhookResponse);
          
          setWorkflowState(prev => ({ 
            ...prev, 
            processingStatus: "agent_processed",
            agentConfirmed: true
          }));
          
          toast({
            title: "Conteúdo processado",
            description: "O agente processou o conteúdo com sucesso."
          });
        } catch (error) {
          console.error('Webhook error:', error);
          setWorkflowState(prev => ({ 
            ...prev, 
            processingStatus: "agent_error"
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
          processingStatus: "updating_database" 
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
              agentConfirmed: newState.agentConfirmed || workflowState.agentConfirmed
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
          processingStatus: "creating_article" 
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
              agentConfirmed: newState.agentConfirmed || workflowState.agentConfirmed
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
        processingStatus: "completed"
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
        processingStatus: "error"
      }));
    }
  };

  return {
    workflowState,
    handleWorkflowUpdate
  };
}

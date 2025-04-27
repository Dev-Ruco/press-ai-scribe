
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { triggerN8NWebhook } from "@/utils/webhookUtils";
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
    selectedImage: null as any,
    articleId: null as string | null
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
    const newState = { ...workflowState, ...updates };
    setWorkflowState(prev => ({ ...prev, isProcessing: true }));

    try {
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }

      // Prepare webhook data
      const webhookData = {
        step: newState.step,
        articleId: workflowState.articleId,
        title: newState.title,
        content: newState.content,
        articleType: newState.articleType.id,
        files: newState.files,
        selectedImage: newState.selectedImage
      };

      // Trigger webhook but don't wait for response
      triggerN8NWebhook(userId, {
        action: 'process_content',
        ...webhookData
      }).catch(error => {
        console.error('Webhook error:', error);
        // Even if webhook fails, we continue with the workflow
      });

      // Update article in database if we have an ID
      if (workflowState.articleId) {
        const { error } = await supabase
          .from('articles')
          .update({
            title: newState.title,
            content: newState.content,
            workflow_step: newState.step,
            workflow_data: {
              files: newState.files,
              selectedImage: newState.selectedImage
            }
          })
          .eq('id', workflowState.articleId);

        if (error) throw error;
      } else if (newState.title && newState.step !== 'upload') {
        // Create new article if we don't have an ID
        const { data, error } = await supabase
          .from('articles')
          .insert({
            title: newState.title,
            content: newState.content || '',
            article_type_id: newState.articleType.id,
            workflow_step: newState.step,
            workflow_data: {
              files: newState.files,
              selectedImage: newState.selectedImage
            },
            user_id: userId
          })
          .select()
          .single();

        if (error) throw error;

        setWorkflowState(prev => ({
          ...prev,
          articleId: data.id
        }));
      }

      // Move to next step automatically
      const nextStep = moveToNextStep(newState.step);
      setWorkflowState({
        ...newState,
        step: nextStep,
        isProcessing: false
      });

    } catch (error) {
      console.error('Error updating workflow:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua solicitação. Tentando continuar...",
        variant: "destructive"
      });
      
      // Even if there's an error, we try to continue to the next step
      const nextStep = moveToNextStep(newState.step);
      setWorkflowState({
        ...newState,
        step: nextStep,
        isProcessing: false
      });
    }
  };

  return {
    workflowState,
    handleWorkflowUpdate
  };
}

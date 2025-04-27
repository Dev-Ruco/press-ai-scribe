
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

  const handleWorkflowUpdate = async (updates: Partial<typeof workflowState>) => {
    const newState = { ...workflowState, ...updates };
    setWorkflowState(newState);

    if (!userId) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    // If we have an articleId, update the article in the database
    if (workflowState.articleId) {
      try {
        // First, let's trigger the N8N webhook if we're updating content
        if (updates.content) {
          setWorkflowState(prev => ({ ...prev, isProcessing: true }));
          try {
            await triggerN8NWebhook(userId, {
              action: "process_content",
              content: updates.content,
              articleId: workflowState.articleId,
              title: workflowState.title,
              articleType: workflowState.articleType.id
            });
          } catch (error) {
            console.error('Error triggering webhook:', error);
            toast({
              title: "Aviso",
              description: "O agente IA está sendo notificado em segundo plano",
              variant: "default"
            });
          }
          setWorkflowState(prev => ({ ...prev, isProcessing: false }));
        }

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
      } catch (error) {
        console.error('Error updating article:', error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar as alterações do artigo",
          variant: "destructive"
        });
      }
    } else if (newState.title && newState.step !== 'upload') {
      try {
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

        // After creating the article, trigger the webhook
        try {
          await triggerN8NWebhook(userId, {
            action: "new_article",
            articleId: data.id,
            title: newState.title,
            articleType: newState.articleType.id,
            files: newState.files
          });
        } catch (error) {
          console.error('Error triggering webhook:', error);
          toast({
            title: "Aviso",
            description: "O agente IA está sendo notificado em segundo plano",
            variant: "default"
          });
        }

        setWorkflowState(prev => ({
          ...prev,
          articleId: data.id
        }));
      } catch (error) {
        console.error('Error creating article:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o artigo",
          variant: "destructive"
        });
      }
    }
  };

  return {
    workflowState,
    handleWorkflowUpdate
  };
}

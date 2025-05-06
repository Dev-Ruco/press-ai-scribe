
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkflowState } from "@/types/workflow";

export function useWorkflowDatabase(userId: string | undefined) {
  const { toast } = useToast();

  const updateArticleInDatabase = async (
    workflowState: WorkflowState,
    newState: Partial<WorkflowState>
  ): Promise<string | null> => {
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    try {
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
              agentConfirmed: newState.agentConfirmed !== undefined ? newState.agentConfirmed : workflowState.agentConfirmed,
              processingStage: newState.processingStage || workflowState.processingStage,
              suggestedTitles: newState.suggestedTitles || workflowState.suggestedTitles
            }
          })
          .eq('id', workflowState.articleId);

        if (error) throw error;
        console.log("Article updated successfully");
        return workflowState.articleId;
      } 
      // Create new article if needed
      else if ((newState.files && newState.files.length > 0) || 
               newState.content || 
               (newState.step && newState.step !== 'upload')) {
        
        // Create new article
        console.log("Creating new article");
        
        const { data, error } = await supabase
          .from('articles')
          .insert({
            title: newState.title || 'Novo artigo',
            content: newState.content || '',
            article_type_id: (newState.articleType?.id || workflowState.articleType?.id),
            workflow_step: newState.step || workflowState.step,
            workflow_data: {
              files: newState.files || workflowState.files,
              selectedImage: newState.selectedImage || workflowState.selectedImage,
              agentConfirmed: newState.agentConfirmed || workflowState.agentConfirmed,
              processingStage: newState.processingStage || workflowState.processingStage,
              suggestedTitles: newState.suggestedTitles || []
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
        return data.id;
      }
      
      return workflowState.articleId;
    } catch (error) {
      console.error('Error updating database:', error);
      toast({
        title: "Erro no banco de dados",
        description: "Não foi possível atualizar os dados do artigo.",
        variant: "destructive"
      });
      return workflowState.articleId;
    }
  };

  return {
    updateArticleInDatabase
  };
}

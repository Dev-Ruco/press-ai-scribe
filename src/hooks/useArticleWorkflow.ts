
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WorkflowState, WorkflowStateUpdate } from "@/types/workflow";
import { ArticleTypeObject } from "@/types/article";
import { useWorkflowNavigation } from "./workflow/useWorkflowNavigation";
import { useWorkflowDatabase } from "./workflow/useWorkflowDatabase";
import { useWorkflowAutoTransition } from "./workflow/useWorkflowAutoTransition";

export function useArticleWorkflow(userId: string | undefined) {
  const { toast } = useToast();
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
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
    processingStatus: "idle",
    processingStage: "uploading",
    processingProgress: 0,
    processingMessage: "",
    selectedImage: null,
    articleId: null,
    agentConfirmed: false,
    suggestedTitles: []
  });

  const { updateArticleInDatabase } = useWorkflowDatabase(userId);

  const handleWorkflowUpdate = async (updates: WorkflowStateUpdate) => {
    console.log("handleWorkflowUpdate chamada com:", updates);
    
    // Create new state with updates
    const newState = { 
      ...workflowState, 
      ...updates,
      processingStage: updates.processingStage || workflowState.processingStage,
      processingProgress: updates.processingProgress !== undefined ? updates.processingProgress : workflowState.processingProgress,
      processingMessage: updates.processingMessage || workflowState.processingMessage,
      suggestedTitles: updates.suggestedTitles || workflowState.suggestedTitles
    };

    try {
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }

      // Update/create article in database
      if (updates.articleId !== undefined) {
        newState.articleId = updates.articleId;
      } else {
        const articleId = await updateArticleInDatabase(workflowState, updates);
        if (articleId) {
          newState.articleId = articleId;
        }
      }

      // If processing is complete and we're in upload step, notify
      if (updates.agentConfirmed && workflowState.step === "upload") {
        console.log("Processamento concluído e estamos na etapa upload, preparando para avançar...");
        toast({
          title: "Processamento concluído",
          description: "Agora você pode selecionar o título para seu artigo.",
        });
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

  // Initialize navigation helpers with the current workflow state and update function
  const { moveToNextStep, moveToNextStepIfValid } = useWorkflowNavigation(
    workflowState, 
    handleWorkflowUpdate
  );

  // Set up automatic transitions based on state changes
  useWorkflowAutoTransition(workflowState, moveToNextStepIfValid);

  return {
    workflowState,
    handleWorkflowUpdate,
    moveToNextStepIfValid
  };
}

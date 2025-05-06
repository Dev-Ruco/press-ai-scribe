
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CreateArticleInput } from "@/components/article/CreateArticleInput";
import { ArticleImageSection } from "@/components/article/image/ArticleImageSection";
import { ArticleAssistant } from "@/components/article/assistant/ArticleAssistant";
import { WorkflowProgress } from "@/components/article/workflow/WorkflowProgress";
import { ArticleEditorSection } from "@/components/article/editor/ArticleEditorSection";
import { TitleSelectionStep } from "@/components/article/workflow/TitleSelectionStep";
import { FinalizationStep } from "@/components/article/workflow/FinalizationStep";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useArticleWorkflow } from "@/hooks/useArticleWorkflow";
import { Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Títulos mockados para fallback caso não haja sugestões do n8n
const mockTitles = [
  "Como as energias renováveis estão transformando o setor elétrico",
  "O futuro da energia sustentável: desafios e oportunidades",
  "Inovação e sustentabilidade no setor energético",
  "Energia limpa: um caminho para o desenvolvimento sustentável",
  "Revolução energética: o papel das fontes renováveis"
];

// Helper para mostrar a mensagem de processamento com base no status
const getProcessingMessage = (status: string) => {
  switch(status) {
    case "started": return "Iniciando processamento...";
    case "processing_with_agent": return "Processando conteúdo com o agente...";
    case "agent_processed": return "Conteúdo processado pelo agente.";
    case "updating_database": return "Atualizando dados...";
    case "creating_article": return "Criando artigo...";
    case "completed": return "Processamento completo!";
    case "agent_error": return "Erro no processamento com o agente.";
    case "error": return "Ocorreu um erro no processamento.";
    default: return "Processando...";
  }
};

// Helper para obter a porcentagem de progresso
const getProgressPercentage = (status: string) => {
  switch(status) {
    case "started": return 10;
    case "processing_with_agent": return 30;
    case "agent_processed": return 60;
    case "updating_database": return 80;
    case "creating_article": return 90;
    case "completed": return 100;
    case "agent_error":
    case "error": 
      return 100;
    default: return 0;
  }
};

export default function CreateArticlePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workflowState, handleWorkflowUpdate, moveToNextStepIfValid } = useArticleWorkflow(user?.id);

  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { returnTo: '/new-article' } });
      return;
    }
  }, [user, navigate]);

  // Debug logging para ajudar a diagnosticar problemas
  useEffect(() => {
    console.log("Workflow state updated:", workflowState);
    if (workflowState.articleId) {
      console.log("Article created with ID:", workflowState.articleId);
    }
    if (workflowState.suggestedTitles && workflowState.suggestedTitles.length > 0) {
      console.log("Title suggestions available:", workflowState.suggestedTitles);
    }
  }, [workflowState]);

  const handleImageSelect = async (imageUrl: string) => {
    handleWorkflowUpdate({
      selectedImage: {
        url: imageUrl,
        caption: "",
        source: "AI Generated"
      }
    });
  };

  const renderWorkflowStep = () => {
    try {
      switch (workflowState.step) {
        case "upload":
          return (
            <CreateArticleInput 
              onWorkflowUpdate={handleWorkflowUpdate}
              onNextStep={moveToNextStepIfValid}
            />
          );
        
        case "title-selection":
          return (
            <TitleSelectionStep
              suggestedTitles={workflowState.suggestedTitles.length > 0 
                ? workflowState.suggestedTitles 
                : mockTitles}
              onTitleSelect={(title) => handleWorkflowUpdate({ title })}
              isProcessing={workflowState.isProcessing}
              onNextStep={moveToNextStepIfValid}
            />
          );
        
        case "content-editing":
          return (
            <ArticleEditorSection
              workflowState={workflowState}
              onWorkflowUpdate={handleWorkflowUpdate}
              onNextStep={moveToNextStepIfValid}
            />
          );
        
        case "image-selection":
          return (
            <ArticleImageSection 
              onImageSelect={handleImageSelect}
              articleContent={workflowState.content}
              articleTitle={workflowState.title}
              onNextStep={moveToNextStepIfValid}
            />
          );
        
        case "finalization":
          return (
            <FinalizationStep
              title={workflowState.title}
              content={workflowState.content}
              selectedImage={workflowState.selectedImage}
              onFinalize={() => handleWorkflowUpdate({ step: "finalization" })}
              isProcessing={workflowState.isProcessing}
              onNextStep={moveToNextStepIfValid}
            />
          );
        
        default:
          console.error("Unknown workflow step:", workflowState.step);
          return (
            <div className="p-6 text-center">
              <p>Erro ao carregar o editor. Passo desconhecido: {workflowState.step}</p>
              <button 
                onClick={() => handleWorkflowUpdate({ step: "upload" })}
                className="mt-4 px-4 py-2 bg-primary text-white rounded"
              >
                Voltar para o início
              </button>
            </div>
          );
      }
    } catch (error) {
      console.error("Error rendering workflow step:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao renderizar o editor de artigos.",
        variant: "destructive"
      });
      return (
        <div className="p-6 text-center">
          <p>Erro ao carregar o editor de artigos</p>
          <button 
            onClick={() => handleWorkflowUpdate({ step: "upload" })}
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
          >
            Tentar novamente
          </button>
        </div>
      );
    }
  };

  return (
    <MainLayout>
      <div className="flex h-full">
        {/* Main content area */}
        <div className="flex-1 overflow-auto pb-8">
          <div className="container mx-auto p-4">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Pencil className="h-5 w-5 text-primary/70" />
                <h1 className="text-2xl font-medium tracking-tight">Editor de Artigos</h1>
              </div>
              
              <WorkflowProgress currentStep={workflowState.step} />
            </div>
            
            {workflowState.isProcessing && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>
                    {getProcessingMessage(workflowState.processingStatus)}
                  </span>
                  <span>
                    {getProgressPercentage(workflowState.processingStatus)}%
                  </span>
                </div>
                <Progress 
                  value={getProgressPercentage(workflowState.processingStatus)} 
                  className="h-2"
                />
              </div>
            )}
            
            <div className="min-h-[calc(100vh-16rem)]">
              {renderWorkflowStep()}
            </div>
          </div>
        </div>
        
        {/* Assistant sidebar - positioned to the right and extending from below header */}
        <div className="w-[280px] border-l border-border/20 h-full bg-background/95">
          <div className="h-full">
            <ArticleAssistant 
              workflowState={workflowState}
              onWorkflowUpdate={handleWorkflowUpdate}
              onNextStep={moveToNextStepIfValid}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

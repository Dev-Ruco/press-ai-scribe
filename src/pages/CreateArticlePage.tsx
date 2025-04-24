
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CreateArticleInput } from "@/components/article/CreateArticleInput";
import { ArticleAssistant } from "@/components/article/ArticleAssistant";
import { Card, CardContent } from "@/components/ui/card";
import { ArticleWorkspace } from "@/components/article/ArticleWorkspace";
import { FileText } from "lucide-react";

export default function CreateArticlePage() {
  const [workflowState, setWorkflowState] = useState({
    step: "upload", // upload, type-selection, title-selection, content-editing, finalization
    files: [],
    content: "",
    articleType: "",
    title: "",
    isProcessing: false
  });
  
  const handleWorkflowUpdate = (updates) => {
    setWorkflowState(prev => ({ ...prev, ...updates }));
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-text-primary">
              Como posso ajudar hoje?
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Crie seu artigo com ajuda da IA
            </p>
          </div>
          
          {workflowState.step === "upload" && (
            <CreateArticleInput 
              onWorkflowUpdate={handleWorkflowUpdate} 
            />
          )}
          
          {workflowState.step !== "upload" && (
            <ArticleWorkspace
              workflowState={workflowState}
              onWorkflowUpdate={handleWorkflowUpdate}
            />
          )}
        </div>
        
        <div className="w-full md:w-[320px]">
          <Card className="sticky top-4 h-[calc(100vh-2rem)] border-border/30 shadow-sm bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <CardContent className="p-3 h-full">
              <ArticleAssistant 
                workflowState={workflowState}
                onWorkflowUpdate={handleWorkflowUpdate}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

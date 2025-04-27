
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CreateArticleInput } from "@/components/article/CreateArticleInput";
import { Card, CardContent } from "@/components/ui/card";
import { ArticleImageSection } from "@/components/article/image/ArticleImageSection";
import { ArticleAssistant } from "@/components/article/ArticleAssistant";
import { WorkflowProgress } from "@/components/article/workflow/WorkflowProgress";
import { ArticleEditorSection } from "@/components/article/editor/ArticleEditorSection";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useArticleWorkflow } from "@/hooks/useArticleWorkflow";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateArticlePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { workflowState, handleWorkflowUpdate } = useArticleWorkflow(user?.id);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const handleImageSelect = async (imageUrl: string) => {
    handleWorkflowUpdate({
      selectedImage: {
        url: imageUrl,
        caption: "",
        source: "AI Generated"
      }
    });
  };

  const moveToFinalization = () => {
    handleWorkflowUpdate({ step: "finalization" });
  };

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Pencil className="h-5 w-5 text-primary/70" />
            <h1 className="text-2xl font-medium tracking-tight">Editor de Artigos</h1>
          </div>
          
          <WorkflowProgress currentStep={workflowState.step} />
        </div>
        
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            {workflowState.step === "upload" && (
              <CreateArticleInput 
                onWorkflowUpdate={handleWorkflowUpdate} 
              />
            )}
            
            {workflowState.step === "content-editing" && (
              <ArticleEditorSection
                workflowState={workflowState}
                onWorkflowUpdate={handleWorkflowUpdate}
              />
            )}

            {workflowState.step === "image-selection" && (
              <Card className="border bg-card">
                <CardContent className="p-6">
                  <ArticleImageSection 
                    onImageSelect={handleImageSelect}
                    articleContent={workflowState.content}
                    articleTitle={workflowState.title}
                  />
                  
                  {workflowState.selectedImage && (
                    <div className="mt-6 border rounded-md p-4">
                      <h4 className="font-medium mb-2">Imagem Selecionada</h4>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <img 
                          src={workflowState.selectedImage.url} 
                          alt="Preview da imagem selecionada" 
                          className="w-full sm:w-1/3 h-auto rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm mb-2 text-muted-foreground">
                            Adicione uma legenda à sua imagem:
                          </p>
                          <textarea 
                            className="w-full p-2 h-32 border rounded-md"
                            placeholder="Escreva uma legenda para esta imagem..."
                            value={workflowState.selectedImage.caption}
                            onChange={(e) => handleWorkflowUpdate({
                              selectedImage: {
                                ...workflowState.selectedImage,
                                caption: e.target.value
                              }
                            })}
                          ></textarea>
                          <div className="mt-2 flex justify-end">
                            <Button variant="outline" size="sm" className="mr-2">
                              Escolher outra
                            </Button>
                            <Button 
                              size="sm"
                              onClick={moveToFinalization}
                            >
                              Confirmar imagem
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="w-full md:w-[320px]">
            <Card className="sticky top-4 h-[calc(100vh-2rem)] flex flex-col overflow-hidden border-border/30 shadow-sm bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/50">
              <CardContent className="p-0 flex-1">
                <ArticleAssistant 
                  workflowState={workflowState}
                  onWorkflowUpdate={handleWorkflowUpdate}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

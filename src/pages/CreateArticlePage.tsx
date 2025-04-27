
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CreateArticleInput } from "@/components/article/CreateArticleInput";
import { Card, CardContent } from "@/components/ui/card";
import { ArticleWorkspace } from "@/components/article/ArticleWorkspace";
import { ArticleImageSection } from "@/components/article/image/ArticleImageSection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, Pencil, ArrowRight } from "lucide-react";
import { ArticlePreview } from "@/components/article/editor/ArticlePreview";
import { ArticleTypeObject } from "@/types/article";
import { ArticleAssistant } from "@/components/article/ArticleAssistant";
import { WorkflowProgress } from "@/components/article/workflow/WorkflowProgress";

export default function CreateArticlePage() {
  const [workflowState, setWorkflowState] = useState({
    step: "upload", // upload, type-selection, title-selection, content-editing, image-selection, finalization
    files: [],
    content: "",
    articleType: {
      id: "article",
      label: "Artigo",
      structure: ["Introdução", "Desenvolvimento", "Conclusão"]
    } as ArticleTypeObject,
    title: "",
    isProcessing: false,
    selectedImage: null
  });
  
  const handleWorkflowUpdate = (updates) => {
    setWorkflowState(prev => ({ ...prev, ...updates }));
  };

  const handleImageSelect = (imageUrl) => {
    setWorkflowState(prev => ({
      ...prev,
      selectedImage: {
        url: imageUrl,
        caption: "",
        source: "AI Generated"
      }
    }));
  };

  const moveToFinalization = () => {
    handleWorkflowUpdate({ step: "finalization" });
  };
  
  // For compatibility with ArticleWorkspace, which might expect articleType as string
  const getCompatibleWorkflowState = () => {
    const { articleType, ...rest } = workflowState;
    return {
      ...rest,
      articleType: typeof articleType === 'object' ? articleType.id : articleType
    };
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
              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="editor" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor">
                  <ArticleWorkspace
                    workflowState={getCompatibleWorkflowState()}
                    onWorkflowUpdate={handleWorkflowUpdate}
                  />
                </TabsContent>
                
                <TabsContent value="preview">
                  <Card className="border bg-card">
                    <CardContent className="p-6">
                      <ArticlePreview 
                        content={workflowState.content}
                        articleType={workflowState.articleType}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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
                              onClick={() => handleWorkflowUpdate({ step: "finalization" })}
                            >
                              Confirmar imagem
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      onClick={moveToFinalization}
                      className="gap-2"
                    >
                      Avançar para Finalização
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {workflowState.step !== "upload" && 
             workflowState.step !== "content-editing" && 
             workflowState.step !== "image-selection" && (
              <ArticleWorkspace
                workflowState={getCompatibleWorkflowState()}
                onWorkflowUpdate={handleWorkflowUpdate}
              />
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


import { MainLayout } from "@/components/layout/MainLayout";
import { CreateArticleForm } from "@/components/article/CreateArticleForm";
import { ArticleToolsMenu } from "@/components/article/ArticleToolsMenu";
import { FilePlus } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export default function CreateArticlePage() {
  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <FilePlus size={24} className="text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Criar Novo Artigo
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Crie seu artigo com assistência de IA
        </p>
      </div>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={75} minSize={50}>
          <div className="h-full pr-4">
            <CreateArticleForm />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="h-full pl-4">
            <ArticleToolsMenu />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </MainLayout>
  );
}


import { MainLayout } from "@/components/layout/MainLayout";
import { CreateArticleForm } from "@/components/article/CreateArticleForm";
import { SidePanel } from "@/components/article/SidePanel";
import { FilePlus } from "lucide-react";

export default function CreateArticlePage() {
  return (
    <MainLayout>
      <div className="h-[calc(100vh-4rem)]">
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
        <SidePanel />
      </div>
    </MainLayout>
  );
}

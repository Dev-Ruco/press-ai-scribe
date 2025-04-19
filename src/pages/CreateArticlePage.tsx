
import { MainLayout } from "@/components/layout/MainLayout";
import { CreateArticleForm } from "@/components/article/CreateArticleForm";
import { ArticleAssistant } from "@/components/article/ArticleAssistant";
import { FilePlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateArticlePage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
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
          <CreateArticleForm />
        </div>
        <div className="w-full md:w-[320px] lg:w-[380px]">
          <Card className="sticky top-4 h-[calc(100vh-2rem)] border-border/40 shadow-sm bg-card/95 backdrop-blur-sm">
            <CardContent className="p-4 h-full">
              <ArticleAssistant />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

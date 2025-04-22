
import { MainLayout } from "@/components/layout/MainLayout";
import { CreateArticleInput } from "@/components/article/CreateArticleInput";
import { ArticleAssistant } from "@/components/article/ArticleAssistant";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateArticlePage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-text-primary">
              Como posso ajudar hoje?
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Crie seu artigo com ajuda da IA
            </p>
          </div>
          
          <CreateArticleInput />
          
          <div className="mt-6 text-center space-y-4">
            <div className="inline-flex flex-wrap justify-center gap-2">
              <button className="px-4 py-2 text-sm rounded-full border border-border/40 hover:bg-accent/50 transition-colors">
                🖼 Criar imagem
              </button>
              <button className="px-4 py-2 text-sm rounded-full border border-border/40 hover:bg-accent/50 transition-colors">
                📚 Resumir texto
              </button>
              <button className="px-4 py-2 text-sm rounded-full border border-border/40 hover:bg-accent/50 transition-colors">
                💡 Brainstorm
              </button>
              <button className="px-4 py-2 text-sm rounded-full border border-border/40 hover:bg-accent/50 transition-colors">
                📊 Analisar dados
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-[280px]">
          <Card className="sticky top-4 h-[calc(100vh-2rem)] border-border/30 shadow-sm bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <CardContent className="p-3 h-full">
              <ArticleAssistant />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

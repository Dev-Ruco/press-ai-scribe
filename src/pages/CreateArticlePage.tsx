
import { MainLayout } from "@/components/layout/MainLayout";
import { CreateArticleForm } from "@/components/article/CreateArticleForm";
import { ArticleAssistant } from "@/components/article/ArticleAssistant";

export default function CreateArticlePage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-text-primary">Criar Novo Artigo</h1>
            <p className="text-text-secondary">Crie seu artigo com assistência de IA</p>
          </div>
          <CreateArticleForm />
        </div>
        <div className="w-full md:w-80 lg:w-96">
          <ArticleAssistant />
        </div>
      </div>
    </MainLayout>
  );
}


import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ReformulateEditor } from "@/components/reformulate/ReformulateEditor";
import { ReformulateAssistant } from "@/components/reformulate/ReformulateAssistant";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function ReformulatePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Function to save an article
  const handleSaveArticle = async (data: {
    title: string;
    content: string;
    status: 'Rascunho' | 'Pendente' | 'Publicado';
    type?: string;
    platform?: string;
  }) => {
    if (!user) {
      toast({
        title: "Não autenticado",
        description: "Faça login para salvar artigos",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data: article, error } = await supabase
        .from('articles')
        .insert([
          {
            user_id: user.id,
            title: data.title,
            content: data.content,
            status: data.status,
            type: data.type || 'Artigo',
            platform: data.platform || 'Web',
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Artigo salvo",
        description: data.status === 'Publicado' 
          ? "Artigo publicado com sucesso" 
          : "Artigo salvo como " + data.status
      });

      return article;
    } catch (error: any) {
      console.error("Error saving article:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o artigo",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Function to generate a test article
  const handleGenerateTestArticle = async () => {
    if (!user) {
      toast({
        title: "Não autenticado",
        description: "Faça login para gerar artigos de teste",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      // Sample titles and content for testing
      const sampleTitles = [
        "Os impactos da energia renovável na economia local",
        "Desafios da urbanização sustentável nas grandes cidades",
        "Avanços tecnológicos na medicina preventiva",
        "O futuro do trabalho remoto pós-pandemia",
        "Estratégias educacionais para a era digital"
      ];
      
      const sampleContents = [
        "A expansão das energias renováveis tem demonstrado crescente impacto nas economias locais...",
        "As grandes metrópoles enfrentam desafios significativos para implementar modelos sustentáveis...",
        "Recentes descobertas no campo da medicina preventiva estão revolucionando...",
        "O paradigma do trabalho remoto estabelecido durante a pandemia continua a evoluir...",
        "Novas abordagens educacionais são necessárias para preparar estudantes para o futuro digital..."
      ];
      
      // Randomly select title and content
      const randomIndex = Math.floor(Math.random() * sampleTitles.length);
      const title = sampleTitles[randomIndex];
      const content = sampleContents[randomIndex];
      
      const { data: article, error } = await supabase
        .from('articles')
        .insert([
          {
            user_id: user.id,
            title: title,
            content: content,
            status: 'Rascunho',
            type: 'Artigo',
            platform: 'Web',
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Artigo de teste gerado",
        description: "Artigo de teste gerado e salvo como rascunho"
      });

      return article;
    } catch (error: any) {
      console.error("Error generating test article:", error);
      toast({
        title: "Erro ao gerar artigo",
        description: error.message || "Não foi possível gerar o artigo de teste",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthGuard>
      <MainLayout>
        <div className="flex h-[calc(100vh-4rem)] gap-4 overflow-hidden p-4">
          <div className="flex-1 overflow-auto">
            <ReformulateEditor 
              onSave={handleSaveArticle}
              onGenerateTest={handleGenerateTestArticle}
              isSaving={isSaving}
            />
          </div>
          <div className="w-[400px] flex flex-col gap-4 overflow-hidden">
            <ReformulateAssistant />
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

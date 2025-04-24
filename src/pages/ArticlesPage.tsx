
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from "@/components/layout/MainLayout";
import { ArticleTable } from "@/components/articles/ArticleTable";
import { ArticleFilters } from "@/components/articles/ArticleFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ArticleWithActions } from '@/types/article';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function ArticlesPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleWithActions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    month: '',
    year: new Date().getFullYear().toString(),
    platform: '',
    type: '',
    tags: '',
    status: '',
    onlyMine: true
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchArticles();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Função para buscar os artigos do usuário no Supabase
  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        console.log("Usuário não autenticado");
        return;
      }

      console.log("Buscando artigos para o usuário:", user.id);
      
      let query = supabase
        .from("articles")
        .select("*")
        .eq("user_id", user.id);

      const { data, error } = await query;
      
      if (error) {
        console.error("Erro ao buscar artigos:", error);
        throw error;
      }

      console.log("Artigos encontrados:", data?.length);
      
      // Formatar os dados dos artigos
      const formattedArticles = data?.map(article => ({
        id: article.id,
        title: article.title || "Artigo sem título",
        author: user.email?.split('@')[0] || 'Você',
        type: article.type || 'Notícia',
        platform: article.platform || 'Web',
        status: article.status || 'Rascunho',
        publishDate: article.publish_date || new Date().toISOString(),
        tags: Array.isArray(article.tags) ? article.tags : [],
      })) as ArticleWithActions[];

      setArticles(formattedArticles);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus artigos.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulação para criar um artigo de demonstração rapidamente
  const handleCreateDemoArticle = async () => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para criar artigos.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Títulos e conteúdos para simulação
      const titles = [
        "O impacto das energias renováveis em Portugal",
        "Tendências em cibersegurança para 2025",
        "Como a IA está transformando o jornalismo moderno",
        "A revolução da mobilidade urbana nas grandes metrópoles",
        "Desafios da educação digital no século XXI",
      ];
      
      const tags = [
        ["Tecnologia", "Inovação"],
        ["IA", "Digital", "Futuro"],
        ["Cidade", "Urbanismo", "Mobilidade"],
        ["Educação", "Digital"],
        ["Energia", "Sustentabilidade"]
      ];
      
      // Escolha aleatória de título e tags
      const randomIndex = Math.floor(Math.random() * titles.length);
      
      const { data, error } = await supabase
        .from("articles")
        .insert({
          title: titles[randomIndex],
          content: "Este é um artigo de demonstração gerado automaticamente para testar a aplicação Press AI.",
          user_id: user.id,
          status: "Rascunho",
          type: "Notícia",
          platform: "Web",
          publish_date: new Date().toISOString(),
          tags: tags[randomIndex]
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Artigo criado",
        description: "Um artigo de demonstração foi criado com sucesso."
      });
      
      // Atualiza a lista de artigos
      fetchArticles();
      
    } catch (error) {
      console.error("Erro ao criar artigo de demonstração:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o artigo de demonstração.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Artigos filtrados com base nos filtros atuais
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Filtro de busca (título ou autor)
      if (filters.search && 
          !article.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !article.author.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Filtro de mês
      if (filters.month && new Date(article.publishDate).getMonth() + 1 !== parseInt(filters.month)) {
        return false;
      }
      
      // Filtro de ano
      if (filters.year && new Date(article.publishDate).getFullYear() !== parseInt(filters.year)) {
        return false;
      }
      
      // Filtro de plataforma
      if (filters.platform && article.platform !== filters.platform) {
        return false;
      }
      
      // Filtro de tipo
      if (filters.type && article.type !== filters.type) {
        return false;
      }
      
      // Filtro de status
      if (filters.status && article.status !== filters.status) {
        return false;
      }
      
      // Filtro de tags
      if (filters.tags) {
        const filterTags = filters.tags.toLowerCase().split(',').map(tag => tag.trim());
        const articleTags = article.tags.map(tag => tag.toLowerCase());
        if (!filterTags.some(tag => articleTags.includes(tag))) {
          return false;
        }
      }
      
      return true;
    });
  }, [articles, filters]);

  // Função para excluir um artigo
  const handleDelete = async (id: string) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleToDelete);
      
      if (error) throw error;
      
      // Atualiza a lista de artigos
      setArticles(articles.filter(article => article.id !== articleToDelete));
      
      toast({
        title: "Artigo excluído",
        description: "O artigo foi removido com sucesso"
      });

    } catch (error) {
      console.error("Erro ao excluir artigo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o artigo.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  // Funções para visualizar e editar artigos
  const handleView = (id: string) => {
    toast({
      title: "Visualizando artigo",
      description: `Visualizando artigo ID: ${id}`
    });
    // Aqui adicionaria navegação para a página de visualização
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Editando artigo",
      description: `Editando artigo ID: ${id}`
    });
    // Aqui adicionaria navegação para a página de edição
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Seus Artigos</h1>
          <p className="text-muted-foreground mt-1">Gerencie e visualize seus artigos pessoais</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCreateDemoArticle}
            disabled={isLoading || !user}
          >
            Criar Artigo Demo
          </Button>
          <Button asChild className="bg-primary hover:bg-primary-dark text-white gap-2">
            <Link to="/new-article">
              <FilePlus size={18} />
              <span>Criar Artigo</span>
            </Link>
          </Button>
        </div>
      </div>
      
      <Card className="shadow-md">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-semibold">
            {isLoading ? "Carregando..." : `Artigos (${filteredArticles.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ArticleFilters filters={filters} setFilters={setFilters} />
          <Separator className="my-4" />
          
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Carregando seus artigos...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            <ArticleTable 
              articles={filteredArticles} 
              onDelete={handleDelete}
              onView={handleView}
              onEdit={handleEdit}
            />
          ) : user ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum artigo encontrado. {filters.search || filters.platform || filters.status ? 'Tente mudar os filtros ou ' : ''} crie seu primeiro artigo!</p>
              <div className="flex justify-center gap-4 mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCreateDemoArticle}
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  Criar Demo
                </Button>
                <Button 
                  onClick={() => navigate('/new-article')}
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  Criar Artigo
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Faça login para ver seus artigos.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/auth')}
              >
                Entrar
              </Button>
            </div>
          )}

          {filteredArticles.length > 10 && (
            <div className="mt-4 flex justify-end text-sm text-muted-foreground">
              <p>Mostrando {filteredArticles.length} artigos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de confirmação para exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

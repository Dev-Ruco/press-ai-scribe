
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

export default function ArticlesPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleWithActions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Buscar artigos do usuário atual
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        
        // Obter dados do usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          return;
        }
        
        // Buscar artigos do usuário
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          throw error;
        }
        
        // Formatar os dados para o componente
        const formattedArticles = data?.map(article => ({
          ...article,
          id: article.id,
          title: article.title,
          author: user.email?.split('@')[0] || 'Você',
          type: article.type || 'Notícia', // Ensure it's a valid ArticleType
          platform: article.platform || 'WordPress', // Ensure it's a valid ArticlePlatform
          status: article.status || 'Rascunho', // Ensure it's a valid ArticleStatus
          publishDate: article.publish_date || new Date().toISOString(),
          tags: article.tags || [],
        })) as ArticleWithActions[]; // Type assertion to ensure proper type
        
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
    
    fetchArticles();
  }, [toast]);

  // Filtered articles based on current filter settings
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Search filter (title or author)
      if (filters.search && 
          !article.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !article.author.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Month filter
      if (filters.month && new Date(article.publishDate).getMonth() + 1 !== parseInt(filters.month)) {
        return false;
      }
      
      // Year filter
      if (filters.year && new Date(article.publishDate).getFullYear() !== parseInt(filters.year)) {
        return false;
      }
      
      // Platform filter
      if (filters.platform && article.platform !== filters.platform) {
        return false;
      }
      
      // Type filter
      if (filters.type && article.type !== filters.type) {
        return false;
      }
      
      // Status filter
      if (filters.status && article.status !== filters.status) {
        return false;
      }
      
      // Tags filter
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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Atualize a lista de artigos
      setArticles(articles.filter(article => article.id !== id));
      
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
    }
  };

  const handleView = (id: string) => {
    toast({
      title: "Visualizando artigo",
      description: `Visualizando artigo ID: ${id}`
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Editando artigo",
      description: `Editando artigo ID: ${id}`
    });
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Seus Artigos</h1>
          <p className="text-muted-foreground mt-1">Gerencie e visualize seus artigos pessoais</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-dark text-white gap-2">
          <Link to="/new-article">
            <FilePlus size={18} />
            <span>Criar Artigo</span>
          </Link>
        </Button>
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
              Carregando seus artigos...
            </div>
          ) : filteredArticles.length > 0 ? (
            <ArticleTable 
              articles={filteredArticles} 
              onDelete={handleDelete}
              onView={handleView}
              onEdit={handleEdit}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum artigo encontrado. {filters.search || filters.platform || filters.status ? 'Tente mudar os filtros ou ' : ''} crie seu primeiro artigo!</p>
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={() => navigate('/new-article')}
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Criar Artigo
              </Button>
            </div>
          )}

          {/* Placeholder for future pagination */}
          {filteredArticles.length > 10 && (
            <div className="mt-4 flex justify-end text-sm text-muted-foreground">
              <p>Paginação a ser implementada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}

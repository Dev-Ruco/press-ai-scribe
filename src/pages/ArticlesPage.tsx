
import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { ArticleTable } from "@/components/articles/ArticleTable";
import { ArticleFilters } from "@/components/articles/ArticleFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ArticleWithActions } from '@/types/article';
import { mockArticles } from '@/data/mockArticles';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ArticlesPage() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<ArticleWithActions[]>(mockArticles);
  const [filters, setFilters] = useState({
    search: '',
    month: '',
    year: new Date().getFullYear().toString(),
    platform: '',
    type: '',
    tags: '',
    status: '',
    onlyMine: false
  });

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
      
      // Only my articles filter
      if (filters.onlyMine && article.author !== 'Rafael') {
        return false;
      }
      
      return true;
    });
  }, [articles, filters]);

  const handleDelete = (id: string) => {
    setArticles(articles.filter(article => article.id !== id));
    toast({
      title: "Artigo excluído",
      description: "O artigo foi removido com sucesso"
    });
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
          <h1 className="text-2xl font-bold text-foreground">Gestão de Artigos</h1>
          <p className="text-muted-foreground mt-1">Gerencie e visualize artigos gerados com IA</p>
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
          <CardTitle className="text-xl font-semibold">Artigos ({filteredArticles.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ArticleFilters filters={filters} setFilters={setFilters} />
          <Separator className="my-4" />
          <ArticleTable 
            articles={filteredArticles} 
            onDelete={handleDelete}
            onView={handleView}
            onEdit={handleEdit}
          />

          {/* Placeholder for future pagination */}
          <div className="mt-4 flex justify-end text-sm text-muted-foreground">
            <p>Paginação a ser implementada</p>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

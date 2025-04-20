
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArticleType, ArticleStatus } from "@/types/article";

interface Article {
  id: string;
  title: string;
  status: ArticleStatus;
  publish_date: string;
  type: ArticleType;
  author?: string;
}

interface DashboardArticleTableProps {
  limit?: number;
}

export function DashboardArticleTable({ limit = 5 }: DashboardArticleTableProps) {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
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
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit || 5);
        
        if (error) {
          throw error;
        }
        
        const formattedArticles = data?.map(article => ({
          id: article.id,
          title: article.title,
          status: (article.status || 'Rascunho') as ArticleStatus,
          publish_date: article.publish_date || new Date().toISOString(),
          type: (article.type || 'Notícia') as ArticleType,
          author: user.email?.split('@')[0] || 'Você'
        })) || [];
        
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
  }, [limit, toast]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Publicado":
        return "bg-primary text-primary-foreground";
      case "Rascunho":
        return "bg-muted text-muted-foreground";
      case "Pendente":
        return "bg-accent text-accent-foreground";
      case "Rejeitado":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando artigos...</div>;
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Você ainda não possui artigos.</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => navigate('/new-article')}
        >
          Criar seu primeiro artigo
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Data</TableHead>
            <TableHead className="hidden md:table-cell">Tipo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id} className="hover:bg-primary/5">
              <TableCell className="font-medium">
                <button 
                  className="text-left hover:text-primary transition-colors hover:underline" 
                  onClick={() => navigate(`/articles/${article.id}`)}
                >
                  {article.title}
                </button>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge className={`${getStatusColor(article.status)}`}>
                  {article.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(article.publish_date)}</TableCell>
              <TableCell className="hidden md:table-cell">{article.type}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                    onClick={() => navigate(`/articles/${article.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                    onClick={() => navigate(`/articles/${article.id}/edit`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

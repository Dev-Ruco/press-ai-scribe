
import { useState } from 'react';
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
import { useToast } from "@/hooks/use-toast";
import { ArticleType, ArticleStatus } from "@/types/article";
import { useAuth } from "@/contexts/AuthContext";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // For now, we're using an empty array for articles since the articles table no longer exists
  // When we re-add the tables in the future, we can replace this with actual data fetching

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

  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Faça login para ver seus artigos.</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => navigate('/auth')}
        >
          Entrar na sua conta
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-4">Carregando artigos...</div>;
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
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
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
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => (
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

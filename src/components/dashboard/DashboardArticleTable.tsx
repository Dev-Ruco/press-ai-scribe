import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockArticles } from '@/data/mockArticles';
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

interface DashboardArticleTableProps {
  limit?: number;
}

export function DashboardArticleTable({ limit = 5 }: DashboardArticleTableProps) {
  const navigate = useNavigate();
  const articles = mockArticles.slice(0, limit);
  
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

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Autor</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="hidden md:table-cell">Data</TableHead>
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
              <TableCell className="hidden md:table-cell">{article.author}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(article.status)}`}>
                  {article.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(article.publishDate)}</TableCell>
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

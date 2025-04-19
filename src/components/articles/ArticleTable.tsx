import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArticleWithActions } from "@/types/article";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ArticleTableProps {
  articles: ArticleWithActions[];
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

export function ArticleTable({ articles, onDelete, onView, onEdit }: ArticleTableProps) {
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
      return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="hidden md:table-cell">Plataforma</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="hidden lg:table-cell">Data</TableHead>
            <TableHead className="hidden md:table-cell">Etiquetas</TableHead>
            <TableHead className="text-right">Acções</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                Nenhum artigo encontrado com os filtros selecionados
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => (
              <TableRow key={article.id} className="hover:bg-primary/5">
                <TableCell className="font-medium">
                  <button 
                    className="text-left hover:text-primary transition-colors hover:underline" 
                    onClick={() => onView(article.id)}
                  >
                    {article.title}
                  </button>
                </TableCell>
                <TableCell>{article.author}</TableCell>
                <TableCell>{article.type}</TableCell>
                <TableCell className="hidden md:table-cell">{article.platform}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(article.status)}`}>
                    {article.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{formatDate(article.publishDate)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-background/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onView(article.id)} 
                          className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ver</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onEdit(article.id)} 
                          className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onDelete(article.id)} 
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Eliminar</p>
                      </TooltipContent>
                    </Tooltip>
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

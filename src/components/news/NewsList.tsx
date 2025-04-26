
import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AuthDialog } from "@/components/auth/AuthDialog";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface NewsItem {
  id: string;
  title: string;
  content?: string;
  category?: string;
  published_at: string;
  source_id?: string;
  source_name?: string;
}

export const NewsList = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNewsItems = async () => {
    setIsLoading(true);
    // Since the raw_news table no longer exists, we'll just show an empty state
    setNewsItems([]);
    setIsLoading(false);
  };

  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const handleAddSource = () => {
    if (user) {
      navigate("/news?tab=sources");
    } else {
      setAuthDialogOpen(true);
    }
  };

  const handleRefresh = () => {
    fetchNewsItems();
    toast({
      title: "Atualizando",
      description: "Buscando notícias mais recentes...",
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimas Notícias</CardTitle>
          <div className="flex gap-2">
            {user && (
              <Button onClick={handleRefresh} size="sm" variant="outline">
                <RefreshCw size={16} className="mr-1" />
                Atualizar
              </Button>
            )}
            {newsItems.length === 0 && !isLoading && (
              <Button onClick={handleAddSource} size="sm">
                Adicionar Fontes
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar notícias</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Carregando notícias...
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-8">
              {user 
                ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Nenhuma notícia encontrada.</p>
                    <Alert>
                      <AlertTitle>Informação</AlertTitle>
                      <AlertDescription>
                        Adicione fontes de notícias na aba "Fontes de Notícias" para começar a monitorar conteúdo.
                        As notícias serão coletadas automaticamente conforme a frequência definida.
                      </AlertDescription>
                    </Alert>
                    <Button onClick={handleAddSource} variant="outline" size="sm">
                      Ir para Fontes de Notícias
                    </Button>
                  </div>
                ) 
                : "Faça login para visualizar suas notícias."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="hidden md:table-cell">Fonte</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.category || 'Sem categoria'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.source_id}
                    </TableCell>
                    <TableCell>
                      {formatDate(item.published_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)}
        onSuccess={() => navigate("/news?tab=sources")}
      />
    </>
  );
};

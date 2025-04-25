
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';
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
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNewsItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        setNewsItems([]);
        setIsLoading(false);
        return;
      }

      console.log('Buscando notícias para usuário:', user.id);

      // Primeiro busca as fontes para ter informação do nome da fonte
      const { data: sourcesData, error: sourcesError } = await supabase
        .from('news_sources')
        .select('id, name')
        .eq('user_id', user.id);

      if (sourcesError) {
        console.error('Erro ao buscar fontes:', sourcesError);
        // Continuamos tentando buscar notícias mesmo sem fontes
      } else {
        console.log('Fontes encontradas:', sourcesData);
        setSources(sourcesData || []);
      }

      // Busca as notícias da tabela raw_news
      const { data: newsData, error: newsError } = await supabase
        .from('raw_news')
        .select(`
          id, 
          title, 
          content,
          published_at,
          source_id
        `)
        .eq('user_id', user.id)
        .order('published_at', { ascending: false });

      if (newsError) {
        console.error('Erro ao buscar notícias:', newsError);
        setError(`Erro ao carregar notícias: ${newsError.message}`);
        throw newsError;
      }

      console.log('Notícias encontradas:', newsData);
      
      // Combina as notícias com os nomes das fontes
      const enhancedNews = (newsData || []).map(item => {
        const source = sourcesData?.find(s => s.id === item.source_id);
        return {
          ...item,
          source_name: source?.name || 'Fonte desconhecida'
        };
      });
      
      setNewsItems(enhancedNews);
    } catch (error: any) {
      console.error('Erro ao buscar notícias:', error);
      setError(`Não foi possível carregar as notícias: ${error.message}`);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as notícias.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchNewsItems();
  }, [fetchNewsItems]);

  // Adiciona listener para atualizar a lista quando novas notícias forem simuladas
  useEffect(() => {
    const handleRefresh = () => {
      console.log('Atualizando lista de notícias...');
      fetchNewsItems();
    };

    window.addEventListener('refreshNews', handleRefresh);
    return () => window.removeEventListener('refreshNews', handleRefresh);
  }, [fetchNewsItems]);

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
                      {item.source_name || item.source_id || 'Fonte desconhecida'}
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

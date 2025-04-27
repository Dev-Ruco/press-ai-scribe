
import { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { triggerN8NWebhook } from '@/utils/webhookUtils';
import { SourceAuthConfig } from '@/types/news';

type NewsItem = {
  id: string;
  title: string;
  content?: string;
  category?: string;
  published_at: string;
  source_id?: string;
  source_name?: string;
};

export const NewsList = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchNewsItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('raw_news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;

      setNewsItems(data || []);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as notícias."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLatestNews = async () => {
    if (!user) return;
    
    try {
      setIsFetching(true);

      // Get all active sources for the current user
      const { data: sources, error: sourcesError } = await supabase
        .from('news_sources')
        .select('*')
        .eq('status', 'active')
        .eq('user_id', user.id);

      if (sourcesError) throw sourcesError;

      if (!sources || sources.length === 0) {
        toast({
          title: "Aviso",
          description: "Você não tem fontes de notícias ativas.",
        });
        return;
      }

      // Process each source through the n8n webhook
      for (const source of sources) {
        try {
          // Convert auth_config from Json to SourceAuthConfig
          const authConfig = source.auth_config as unknown as SourceAuthConfig;
          
          // Create a valid payload for the webhook
          const webhookPayload = {
            id: source.id,
            type: 'link' as const,
            mimeType: 'text/plain',
            data: source.url,
            authMethod: authConfig?.method || null,
            credentials: authConfig?.method === 'basic' ? {
              username: authConfig.username || '',
              password: authConfig.password || ''
            } : undefined
          };
          
          const articles = await triggerN8NWebhook(webhookPayload);

          // Let the user know the fetch was successful
          toast({
            title: "Sucesso",
            description: `Notícias atualizadas da fonte: ${source.name}`,
          });

        } catch (sourceError: any) {
          console.error(`Error fetching news from source ${source.name}:`, sourceError);
          toast({
            variant: "destructive",
            title: "Erro",
            description: `Não foi possível atualizar notícias da fonte: ${source.name}`
          });
        }
      }

      // Refresh the news list after fetching
      await fetchNewsItems();

    } catch (err: any) {
      console.error('Error fetching latest news:', err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar as notícias."
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchNewsItems();
  }, []);

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
    fetchLatestNews();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimas Notícias</CardTitle>
          <div className="flex gap-2">
            {user && (
              <Button 
                onClick={handleRefresh} 
                size="sm" 
                variant="outline"
                disabled={isFetching}
              >
                <RefreshCw size={16} className={`mr-1 ${isFetching ? 'animate-spin' : ''}`} />
                {isFetching ? 'Atualizando...' : 'Atualizar'}
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
                      {item.source_name}
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.published_at), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
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

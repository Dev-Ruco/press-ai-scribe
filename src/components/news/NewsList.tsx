
import { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewsItems();
  }, [user]);

  const fetchNewsItems = async () => {
    try {
      setIsLoading(true);

      if (!user) {
        setNewsItems([]);
        setIsLoading(false);
        return;
      }

      console.log('Fetching news items for user:', user.id);

      // Fetch news items with their source information
      const { data: newsData, error: newsError } = await supabase
        .from('news_items')
        .select(`
          id, 
          title, 
          content, 
          category, 
          published_at,
          source_id
        `)
        .eq('user_id', user.id)
        .order('published_at', { ascending: false });

      if (newsError) {
        console.error('Error fetching news items:', newsError);
        throw newsError;
      }

      console.log('Fetched news items:', newsData);
      
      // If we have news items, fetch their source names
      if (newsData && newsData.length > 0) {
        // Get unique source IDs
        const sourceIds = [...new Set(newsData.filter(item => item.source_id).map(item => item.source_id))];
        
        // If there are sources, fetch their names
        if (sourceIds.length > 0) {
          const { data: sourcesData, error: sourcesError } = await supabase
            .from('news_sources')
            .select('id, name')
            .in('id', sourceIds);
            
          if (sourcesError) {
            console.error('Error fetching source names:', sourcesError);
          } else {
            // Create a map of source id -> name
            const sourceMap = new Map(sourcesData?.map(source => [source.id, source.name]));
            
            // Add source names to news items
            const transformedData = newsData.map(item => ({
              ...item,
              source_name: item.source_id ? sourceMap.get(item.source_id) || 'Fonte Desconhecida' : 'Fonte Desconhecida'
            }));
            
            setNewsItems(transformedData);
          }
        } else {
          // No sources to fetch, just use the news data
          setNewsItems(newsData.map(item => ({
            ...item,
            source_name: 'Fonte Desconhecida'
          })));
        }
      } else {
        // No news items
        setNewsItems([]);
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as notícias.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimas Notícias</CardTitle>
          {newsItems.length === 0 && !isLoading && (
            <Button onClick={handleAddSource} size="sm">
              Adicionar Fontes
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Carregando notícias...
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {user 
                ? "Nenhuma notícia encontrada. Adicione fontes e simule notícias!"
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

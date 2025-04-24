
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NewsItem {
  id: string;
  title: string;
  content?: string;
  category?: string;
  published_at: string;
  source_name?: string;
}

export const NewsList = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchNewsItems = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch news items with their source information
        const { data, error } = await supabase
          .from('news_items')
          .select(`
            id, 
            title, 
            content, 
            category, 
            published_at,
            source_id (name)
          `)
          .eq('user_id', user.id)
          .order('published_at', { ascending: false });

        if (error) throw error;

        // Transform the data to include source name
        const transformedData = data.map(item => ({
          ...item,
          source_name: item.source_id?.name || 'Fonte Desconhecida'
        }));

        setNewsItems(transformedData);
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

    fetchNewsItems();
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Notícias</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            Carregando notícias...
          </div>
        ) : newsItems.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhuma notícia encontrada. Adicione fontes e simule notícias!
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
  );
};

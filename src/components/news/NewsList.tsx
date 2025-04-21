
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewsCard } from './NewsCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function NewsList() {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    source: 'all',
  });
  const [sources, setSources] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch sources and news items on component mount
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    Promise.all([
      fetchSources(),
      fetchNewsItems()
    ]).finally(() => {
      setIsLoading(false);
    });
  }, [user]);

  const fetchSources = async () => {
    try {
      const { data, error } = await supabase
        .from('news_sources')
        .select('id, name')
        .eq('user_id', user?.id)
        .eq('status', 'active');
      
      if (error) throw error;
      setSources(data || []);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const fetchNewsItems = async () => {
    try {
      const { data, error } = await supabase
        .from('news_items')
        .select('*, news_sources(name)')
        .eq('user_id', user?.id)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      setNewsItems(data || []);
    } catch (error) {
      console.error('Error fetching news items:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as notícias.',
        variant: 'destructive',
      });
    }
  };

  // Filter news items based on current filters
  const filteredNews = newsItems.filter(item => {
    // Search filter
    if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    
    // Source filter
    if (filters.source !== 'all' && item.source_id !== filters.source) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Input
                placeholder="Pesquisar notícias..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            <div>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({...filters, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  <SelectItem value="Geral">Geral</SelectItem>
                  <SelectItem value="Política">Política</SelectItem>
                  <SelectItem value="Economia">Economia</SelectItem>
                  <SelectItem value="Esportes">Esportes</SelectItem>
                  <SelectItem value="Cultura">Cultura</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={filters.source}
                onValueChange={(value) => setFilters({...filters, source: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas fontes</SelectItem>
                  {sources.map(source => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News items */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Carregando notícias...
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <NewsCard 
              key={item.id}
              news={{
                id: item.id,
                title: item.title,
                category: item.category || 'Sem categoria',
                source: item.source_id,
                time: new Date(item.published_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                date: new Date(item.published_at).toLocaleDateString('pt-BR')
              }}
              sourceName={item.news_sources?.name || 'Fonte desconhecida'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhuma notícia encontrada.</p>
          <p className="mt-2">
            {newsItems.length === 0 
              ? "Adicione fontes de notícias para começar a monitorar conteúdo."
              : "Tente mudar os filtros para ver mais resultados."}
          </p>
        </div>
      )}
    </div>
  );
}

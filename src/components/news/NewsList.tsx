
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NewsCard } from './NewsCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const NewsList = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [sources, setSources] = useState<{name: string, id: string}[]>([]);
  
  // Fetch news items from database
  useEffect(() => {
    const fetchNewsItems = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch news items for the current user
        const { data, error } = await supabase
          .from('news_items')
          .select('*, news_sources(name)')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching news items:', error);
          return;
        }
        
        setNewsItems(data || []);
        
        // Extract unique categories and sources for filters
        if (data && data.length > 0) {
          const uniqueCategories = [...new Set(data.map(item => item.category))].filter(Boolean);
          setCategories(uniqueCategories);
          
          // Fetch sources for the current user
          const { data: sourcesData, error: sourcesError } = await supabase
            .from('news_sources')
            .select('id, name')
            .eq('user_id', user.id);
            
          if (!sourcesError && sourcesData) {
            setSources(sourcesData);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsItems();
  }, [user]);
  
  // Filter logic for news items
  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || news.category === categoryFilter;
    const matchesSource = sourceFilter === 'all' || news.source_id === sourceFilter;
    return matchesSearch && matchesCategory && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl border border-border shadow-sm">
        <div className="w-full md:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="min-w-[180px] hover:border-primary/70 transition-all duration-200">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-auto">
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="min-w-[180px] hover:border-primary/70 transition-all duration-200">
              <SelectValue placeholder="Todas as fontes" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="all">Todas as fontes</SelectItem>
              {sources.map(source => (
                <SelectItem key={source.id} value={source.id}>{source.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-grow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              className="pl-10 hover:border-primary/70 transition-all duration-200"
              placeholder="Buscar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* News Cards */}
      <Card className="shadow-sm border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-text-secondary">
              <p>Carregando notícias...</p>
            </div>
          ) : filteredNews.length > 0 ? (
            filteredNews.map(news => (
              <NewsCard key={news.id} news={{
                id: news.id,
                title: news.title,
                category: news.category,
                source: news.news_sources?.name || 'Desconhecido',
                time: new Date(news.published_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                date: new Date(news.published_at).toLocaleDateString('pt-BR')
              }} />
            ))
          ) : (
            <div className="py-12 text-center text-text-secondary">
              <p>Nenhuma notícia encontrada. Adicione novas fontes de notícias para começar.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Pagination - only show if there are news items */}
      {filteredNews.length > 10 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" className="hover:bg-primary/10 transition-all duration-200" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="hover:bg-primary/20 transition-all duration-200">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="hover:bg-primary/10 transition-all duration-200" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

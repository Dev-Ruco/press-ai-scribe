
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  time: string;
}

export function RecentNewsList() {
  const { user } = useAuth();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentNews();
  }, [user]);

  const fetchRecentNews = async () => {
    if (!user) {
      setNewsItems([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('news_items')
        .select('*, news_sources(name)')
        .eq('user_id', user.id)
        .order('published_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      if (data) {
        const formattedNews = data.map(item => ({
          id: item.id,
          title: item.title,
          excerpt: item.content ? item.content.substring(0, 100) + '...' : 'Sem conteúdo disponível',
          source: item.news_sources?.name || 'Desconhecido',
          time: formatTimeAgo(new Date(item.published_at))
        }));
        
        setNewsItems(formattedNews);
      }
    } catch (error) {
      console.error('Error fetching recent news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}min atrás`;
    } else if (diffHrs < 24) {
      return `${diffHrs}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const handleNewsClick = (newsContent: string) => {
    // Future implementation: insert content into editor
    console.log("Notícia selecionada:", newsContent);
  };

  if (loading) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 text-center">
          <p>Carregando notícias recentes...</p>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {newsItems.length > 0 ? (
          newsItems.map((news) => (
            <div
              key={news.id}
              className="p-4 border rounded-lg hover:bg-accent/5 cursor-pointer transition-colors"
              onClick={() => handleNewsClick(news.excerpt)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium mb-1">{news.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{news.source}</span>
                    <span>•</span>
                    <span>{news.time}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Info className="h-12 w-12 text-muted-foreground mb-2 opacity-50" />
            <p className="text-muted-foreground mb-2">Nenhuma notícia encontrada.</p>
            <Link to="/news">
              <Button variant="outline" size="sm">
                Adicionar fontes de notícias
              </Button>
            </Link>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

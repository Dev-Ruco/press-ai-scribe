
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, FileText, Mic, ExternalLink, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export function RecentActivitySection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [news, setNews] = useState([]);
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState({
    articles: false,
    news: false,
    transcriptions: false
  });
  
  useEffect(() => {
    if (user) {
      fetchRecentData();
    }
  }, [user]);
  
  const fetchRecentData = async () => {
    if (!user) return;
    
    // Fetch recent articles
    setLoading(prev => ({ ...prev, articles: true }));
    try {
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('id, title, created_at, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (!articlesError) {
        setArticles(articlesData || []);
      } else {
        console.error("Error fetching articles:", articlesError);
      }
    } catch (err) {
      console.error("Error in articles fetch:", err);
    } finally {
      setLoading(prev => ({ ...prev, articles: false }));
    }
    
    // Fetch recent news
    setLoading(prev => ({ ...prev, news: true }));
    try {
      const { data: newsData, error: newsError } = await supabase
        .from('raw_news')
        .select('id, title, source_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (!newsError) {
        setNews(newsData || []);
      } else {
        console.error("Error fetching news:", newsError);
      }
    } catch (err) {
      console.error("Error in news fetch:", err);
    } finally {
      setLoading(prev => ({ ...prev, news: false }));
    }
    
    // Fetch recent transcriptions
    setLoading(prev => ({ ...prev, transcriptions: true }));
    try {
      const { data: transData, error: transError } = await supabase
        .from('transcriptions')
        .select('id, name, created_at, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (!transError) {
        setTranscriptions(transData || []);
      } else {
        console.error("Error fetching transcriptions:", transError);
      }
    } catch (err) {
      console.error("Error in transcriptions fetch:", err);
    } finally {
      setLoading(prev => ({ ...prev, transcriptions: false }));
    }
  };
  
  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-PT', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent News */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-gray-700" />
              <span>Últimas Notícias</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/news')}
              className="text-sm"
            >
              Ver Mais
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {loading.news ? (
              <div className="py-8 text-center text-gray-500">Carregando...</div>
            ) : news.length > 0 ? (
              <ul className="divide-y">
                {news.map((item) => (
                  <li key={item.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {item.source_name} • {formatDate(item.created_at)}
                        </p>
                      </div>
                      <Link to={`/news/${item.id}`} className="shrink-0">
                        <ExternalLink className="h-4 w-4 text-gray-400 hover:text-gray-700" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center flex flex-col items-center">
                <p className="text-gray-500 mb-3">Ainda não há notícias importadas.</p>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/news/add')}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" /> Adicionar Fonte
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Articles */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-700" />
              <span>Artigos Recentes</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/articles')}
              className="text-sm"
            >
              Ver Mais
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {loading.articles ? (
              <div className="py-8 text-center text-gray-500">Carregando...</div>
            ) : articles.length > 0 ? (
              <ul className="divide-y">
                {articles.map((item) => (
                  <li key={item.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium line-clamp-1">{item.title}</p>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block h-2 w-2 rounded-full ${
                            item.status === 'Publicado' ? 'bg-green-500' : 
                            item.status === 'Rascunho' ? 'bg-amber-500' : 'bg-gray-400'
                          }`}></span>
                          <p className="text-xs text-gray-500">
                            {item.status} • {formatDate(item.created_at)}
                          </p>
                        </div>
                      </div>
                      <Link to={`/articles/${item.id}`} className="shrink-0">
                        <ExternalLink className="h-4 w-4 text-gray-400 hover:text-gray-700" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center flex flex-col items-center">
                <p className="text-gray-500 mb-3">Ainda não criou nenhum artigo.</p>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/new-article')}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" /> Criar Artigo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Transcriptions */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mic className="h-5 w-5 text-gray-700" />
              <span>Transcrições</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/transcribe')}
              className="text-sm"
            >
              Ver Mais
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {loading.transcriptions ? (
              <div className="py-8 text-center text-gray-500">Carregando...</div>
            ) : transcriptions.length > 0 ? (
              <ul className="divide-y">
                {transcriptions.map((item) => (
                  <li key={item.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block h-2 w-2 rounded-full ${
                            item.status === 'completed' ? 'bg-green-500' : 
                            item.status === 'pending' ? 'bg-blue-500' : 
                            item.status === 'processing' ? 'bg-amber-500' : 'bg-gray-400'
                          }`}></span>
                          <p className="text-xs text-gray-500">
                            {item.status === 'completed' ? 'Concluído' : 
                            item.status === 'pending' ? 'Pendente' : 
                            item.status === 'processing' ? 'Processando' : item.status} 
                            • {formatDate(item.created_at)}
                          </p>
                        </div>
                      </div>
                      <Link to={`/transcribe/${item.id}`} className="shrink-0">
                        <ExternalLink className="h-4 w-4 text-gray-400 hover:text-gray-700" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center flex flex-col items-center">
                <p className="text-gray-500 mb-3">Ainda não há transcrições.</p>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/transcribe/new')}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" /> Nova Transcrição
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

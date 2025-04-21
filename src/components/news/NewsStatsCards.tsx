
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const NewsStatsCards = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeSources: 0,
    todayNews: 0,
    pendingUpdates: 0,
    lastCheck: '-'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get active sources count
      const { data: sourcesData, error: sourcesError } = await supabase
        .from('news_sources')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      if (sourcesError) throw sourcesError;
      
      // Get today's news count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: newsData, error: newsError } = await supabase
        .from('news_items')
        .select('id')
        .eq('user_id', user.id)
        .gte('published_at', today.toISOString());
        
      if (newsError) throw newsError;
      
      // Last check time - we'll use the current time for now
      // In a real app, you might want to store this in a separate table
      const lastCheck = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      setStats({
        activeSources: sourcesData?.length || 0,
        todayNews: newsData?.length || 0,
        pendingUpdates: 0, // This would require additional logic in a real app
        lastCheck: lastCheck
      });
    } catch (error) {
      console.error('Error fetching news stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStats();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">Carregando...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-gray rounded-lg p-4">
              <div className="text-sm text-text-secondary mb-1">Fontes Ativas</div>
              <div className="text-2xl font-semibold">{stats.activeSources}</div>
            </div>
            
            <div className="bg-bg-gray rounded-lg p-4">
              <div className="text-sm text-text-secondary mb-1">Notícias Hoje</div>
              <div className="text-2xl font-semibold">{stats.todayNews}</div>
            </div>
            
            <div className="bg-bg-gray rounded-lg p-4">
              <div className="text-sm text-text-secondary mb-1">Atualizações Pendentes</div>
              <div className="text-2xl font-semibold">{stats.pendingUpdates}</div>
            </div>
            
            <div className="bg-bg-gray rounded-lg p-4">
              <div className="text-sm text-text-secondary mb-1">Última Verificação</div>
              <div className="text-base font-medium">{stats.lastCheck}</div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-4" onClick={handleRefresh}>
            <RefreshCw size={16} className="mr-2" />
            Verificar Todas Agora
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

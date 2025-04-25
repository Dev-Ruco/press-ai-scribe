
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AuthDialog } from "@/components/auth/AuthDialog";
import { NewsSource, SourceAuthConfig } from '@/types/news';
import { Json } from '@/integrations/supabase/types';

export const NewsSourcesList = () => {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  
  // Função para lidar com ações que requerem autenticação
  const handleRequireAuth = (callback: () => void) => {
    setAuthDialogOpen(true);
    // Armazena o callback para ser chamado após autenticação
    window.sessionStorage.setItem('pendingAuthCallback', JSON.stringify({
      type: 'simulateNews',
      timestamp: new Date().getTime()
    }));
  };

  // Função para simular notícias
  const simulateNewsForSource = async (sourceId: string) => {
    if (!user) {
      handleRequireAuth(() => simulateNewsForSource(sourceId));
      return;
    }

    try {
      console.log('Simulando notícias para fonte:', sourceId);
      
      // Encontra a fonte na lista de fontes disponíveis
      const source = sources.find(s => s.id === sourceId);
      if (!source) {
        console.error('Fonte não encontrada na lista.');
        throw new Error('Fonte não encontrada');
      }
      
      const currentTime = new Date();
      const formattedTime = currentTime.toLocaleTimeString();
      
      // Simula uma notícia diretamente no banco
      const { data, error } = await supabase
        .from('raw_news')
        .insert([
          { 
            user_id: user.id,
            source_id: sourceId,
            title: `Notícia simulada de ${source.name} - ${formattedTime}`,
            content: `Esta é uma notícia simulada da fonte ${source.name} criada em ${currentTime.toLocaleString()}`,
            published_at: currentTime.toISOString()
          }
        ])
        .select();
      
      if (error) {
        console.error('Erro ao criar notícia simulada:', error);
        throw error;
      }
      
      console.log('Notícia simulada criada com sucesso:', data);
      toast({
        title: 'Simulação Concluída',
        description: 'Uma notícia simulada foi gerada com sucesso.',
      });

      // Atualiza a lista de notícias automaticamente
      const event = new CustomEvent('refreshNews');
      window.dispatchEvent(event);
    } catch (error: any) {
      console.error('Erro ao simular notícias:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível simular notícias para esta fonte.',
        variant: 'destructive',
      });
    }
  };

  const fetchSources = useCallback(async () => {
    if (!user) {
      setSources([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('Buscando fontes de notícias para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('news_sources')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Erro ao buscar fontes de notícias:', error);
        setError('Não foi possível carregar as fontes de notícias.');
        throw error;
      }
      
      console.log('Fontes de notícias encontradas:', data);
      
      // Type-casting the data to ensure auth_config is properly converted
      const typedData: NewsSource[] = data?.map(item => ({
        id: item.id,
        name: item.name,
        url: item.url,
        category: item.category,
        frequency: item.frequency,
        status: item.status || 'active',
        auth_config: item.auth_config as unknown as SourceAuthConfig,
        last_checked_at: item.last_checked_at
      })) || [];
      
      setSources(typedData);
    } catch (error: any) {
      console.error('Erro ao buscar fontes:', error);
      setError(`Erro ao carregar fontes: ${error.message}`);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar suas fontes de notícias.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  // Renderização condicional baseada no estado
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fontes de Notícias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Carregando fontes de notícias...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fontes de Notícias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="font-medium">Erro</p>
            <p>{error}</p>
            <Button 
              onClick={fetchSources} 
              variant="outline" 
              size="sm"
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fontes de Notícias</CardTitle>
      </CardHeader>
      <CardContent>
        {sources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {user ? 'Você ainda não adicionou nenhuma fonte de notícias.' : 'Faça login para gerenciar suas fontes de notícias.'}
          </div>
        ) : (
          <div className="space-y-4">
            {sources.map((source) => (
              <div key={source.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{source.name}</h3>
                  <p className="text-sm text-muted-foreground">{source.url}</p>
                  <p className="text-xs mt-1">
                    <span className="font-medium">Categoria:</span> {source.category} | 
                    <span className="font-medium"> Frequência:</span> {source.frequency}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => source.id && simulateNewsForSource(source.id)}
                >
                  Simular notícias
                </Button>
              </div>
            ))}
          </div>
        )}
        <AuthDialog 
          isOpen={authDialogOpen} 
          onClose={() => setAuthDialogOpen(false)}
          onSuccess={() => {
            setAuthDialogOpen(false);
            // Implementar lógica para executar callback pendente se necessário
          }}
        />
      </CardContent>
    </Card>
  );
};

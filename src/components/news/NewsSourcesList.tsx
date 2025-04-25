
import { useState, useEffect } from 'react';
import { Plus, Edit, Pause, Play, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NewsSourceForm } from './NewsSourceForm';
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const NewsSourcesList = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingSource, setSavingSource] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchSources();
  }, [user]);

  // Effect to run pending action when user becomes authenticated
  useEffect(() => {
    if (user && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [user, pendingAction]);

  const fetchSources = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        setSources([]);
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching news sources for user:', user.id);
      
      const { data, error } = await supabase
        .from('news_sources')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching news sources:', error);
        setError(`Erro ao carregar fontes: ${error.message}`);
        throw error;
      }
      
      console.log('Fetched sources:', data);
      setSources(data || []);
    } catch (error: any) {
      console.error('Error fetching news sources:', error);
      setError(`Não foi possível carregar suas fontes de notícias: ${error.message}`);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar suas fontes de notícias.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSource = async (source: any) => {
    if (!user) {
      handleRequireAuth(() => handleSaveSource(source));
      return;
    }

    try {
      setSavingSource(true);
      setError(null);
      let result;
      
      console.log('Iniciando salvamento da fonte:', source);
      
      if (source.id) {
        console.log('Atualizando fonte existente:', source.id);
        const { data, error } = await supabase
          .from('news_sources')
          .update({
            name: source.name,
            url: source.url,
            category: source.category,
            frequency: source.frequency,
            status: source.status
          })
          .eq('id', source.id)
          .eq('user_id', user.id)
          .select();
        
        if (error) {
          console.error('Erro ao atualizar fonte:', error);
          setError(`Erro ao atualizar fonte: ${error.message}`);
          throw error;
        }
        
        console.log('Fonte atualizada:', data);
        result = data ? data[0] : null;
      } else {
        console.log('Adicionando nova fonte:', { ...source, user_id: user.id });
        const { data, error } = await supabase
          .from('news_sources')
          .insert({
            name: source.name,
            url: source.url,
            category: source.category,
            frequency: source.frequency || 'daily',
            status: 'active',
            user_id: user.id
          })
          .select();
        
        if (error) {
          console.error('Erro ao inserir fonte:', error);
          setError(`Erro ao inserir fonte: ${error.message}`);
          throw error;
        }
        
        console.log('Nova fonte inserida:', data);
        result = data ? data[0] : null;
      }
      
      if (result) {
        await fetchSources(); // Atualiza a lista
        setShowForm(false);
        toast({
          title: source.id ? 'Fonte Atualizada' : 'Fonte Adicionada',
          description: source.id 
            ? 'A fonte de notícias foi atualizada com sucesso.' 
            : 'A nova fonte de notícias foi adicionada com sucesso.',
        });

        // Simula notícias imediatamente após adicionar a fonte
        try {
          await simulateNewsForSource(result.id);
        } catch (simError) {
          console.error('Erro ao simular notícias:', simError);
          // Não mostra erro de simulação ao usuário pois a fonte já foi salva com sucesso
        }
      } else {
        setError('A fonte foi salva, mas não foi possível obter os detalhes. Por favor, atualize a lista.');
      }
    } catch (error: any) {
      console.error('Erro ao salvar fonte de notícias:', error);
      setError(`Não foi possível salvar a fonte de notícias: ${error.message}`);
      toast({
        title: 'Erro',
        description: `Não foi possível salvar a fonte de notícias. ${error.message || ''}`,
        variant: 'destructive',
      });
    } finally {
      setSavingSource(false);
    }
  };

  const simulateNewsForSource = async (sourceId: string) => {
    if (!user) {
      handleRequireAuth(() => simulateNewsForSource(sourceId));
      return;
    }

    try {
      console.log('Simulando notícias para fonte:', sourceId);
      
      // Simula uma notícia diretamente no banco
      const { data, error } = await supabase
        .from('raw_news')
        .insert([
          { 
            user_id: user.id,
            source_id: sourceId,
            title: 'Notícia simulada ' + new Date().toLocaleTimeString(),
            content: 'Esta é uma notícia simulada criada em ' + new Date().toLocaleString(),
            published_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) {
        console.error('Erro ao criar notícia simulada:', error);
        throw error;
      }
      
      console.log('Notícia simulada criada:', data);
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

  const handleRequireAuth = (callback: () => void) => {
    if (user) {
      callback();
    } else {
      setPendingAction(() => callback);
      setAuthDialogOpen(true);
    }
  };

  const handleAddSource = () => {
    handleRequireAuth(() => {
      setEditingSource(null);
      setShowForm(true);
    });
  };

  const handleEditSource = (source: any) => {
    handleRequireAuth(() => {
      setEditingSource(source);
      setShowForm(true);
    });
  };

  const handleToggleStatus = async (source: any) => {
    handleRequireAuth(async () => {
      try {
        const newStatus = source.status === 'active' ? 'inactive' : 'active';
        
        console.log('Toggling source status:', { id: source.id, newStatus });
        
        const { error } = await supabase
          .from('news_sources')
          .update({ status: newStatus })
          .eq('id', source.id)
          .eq('user_id', user?.id);
        
        if (error) {
          console.error('Error toggling status:', error);
          throw error;
        }
        
        await fetchSources(); // Refresh the list
        
        toast({
          title: newStatus === 'active' ? 'Fonte Ativada' : 'Fonte Desativada',
          description: `A fonte "${source.name}" foi ${newStatus === 'active' ? 'ativada' : 'desativada'}.`,
        });
      } catch (error: any) {
        console.error('Error toggling source status:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível alterar o status da fonte.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleDeleteSource = async (source: any) => {
    handleRequireAuth(async () => {
      try {
        console.log('Deleting source:', source.id);
        
        const { error } = await supabase
          .from('news_sources')
          .delete()
          .eq('id', source.id)
          .eq('user_id', user?.id);
        
        if (error) {
          console.error('Error deleting source:', error);
          throw error;
        }
        
        await fetchSources(); // Refresh the list
        
        toast({
          title: 'Fonte Excluída',
          description: `A fonte "${source.name}" foi excluída com sucesso.`,
        });
      } catch (error: any) {
        console.error('Error deleting news source:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir a fonte de notícias.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false);
    // The pending action will be executed by the useEffect when user becomes available
  };

  const handleRefresh = () => {
    fetchSources();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Fontes de Notícias</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} size="sm" variant="outline">
              <Play size={16} className="mr-1" />
              Atualizar
            </Button>
            <Button onClick={handleAddSource} size="sm">
              <Plus size={16} className="mr-1" />
              Adicionar Fonte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {showForm ? (
            <NewsSourceForm 
              source={editingSource} 
              onCancel={() => setShowForm(false)} 
              onSave={handleSaveSource}
            />
          ) : isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Carregando fontes...
            </div>
          ) : sources.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {user 
                ? "Nenhuma fonte cadastrada. Adicione sua primeira fonte!" 
                : "Faça login para visualizar e gerenciar suas fontes de notícias."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell>{source.name}</TableCell>
                    <TableCell className="hidden md:table-cell truncate max-w-[200px]">
                      {source.url}
                    </TableCell>
                    <TableCell>
                      {source.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-green-500">
                          <Check size={16} />
                          <span className="hidden md:inline">Ativo</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <X size={16} />
                          <span className="hidden md:inline">Inativo</span>
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => simulateNewsForSource(source.id)}
                          title="Simular Notícias"
                        >
                          <Play size={16} />
                          <span className="sr-only">Simular</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditSource(source)}
                        >
                          <Edit size={16} />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleStatus(source)}
                        >
                          {source.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                          <span className="sr-only">
                            {source.status === 'active' ? 'Pausar' : 'Ativar'}
                          </span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive/80" 
                          onClick={() => handleDeleteSource(source)}
                        >
                          <Trash2 size={16} />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
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
        onSuccess={handleAuthSuccess}
        actionAfterAuth={pendingAction || undefined}
      />
    </div>
  );
};

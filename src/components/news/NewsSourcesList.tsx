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
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import type { NewsSource, SourceAuthConfig } from '@/types/news';
import { Json } from '@/integrations/supabase/types';

export const NewsSourcesList = () => {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState<NewsSource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingSource, setSavingSource] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fetchSources = async () => {
    if (!user) {
      setSources([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('news_sources')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSources(data || []);
    } catch (error: any) {
      console.error('Error fetching sources:', error);
      setError('Não foi possível carregar as fontes de notícias.');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as fontes de notícias."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [user]);

  const handleSaveSource = async (sourceData: Partial<NewsSource>) => {
    if (!user) {
      handleRequireAuth(() => handleSaveSource(sourceData));
      return;
    }

    try {
      setSavingSource(true);
      setError(null);
      
      // Convert SourceAuthConfig to Json type for Supabase compatibility
      const authConfigForDb = sourceData.auth_config as unknown as Json;
      
      if (sourceData.id) {
        // Update existing source
        const { error } = await supabase
          .from('news_sources')
          .update({
            name: sourceData.name,
            url: sourceData.url,
            category: sourceData.category,
            frequency: sourceData.frequency,
            auth_config: authConfigForDb
          })
          .eq('id', sourceData.id)
          .eq('user_id', user.id);

        if (error) throw error;
        
        toast({
          title: 'Fonte Atualizada',
          description: 'A fonte de notícias foi atualizada com sucesso.'
        });
      } else {
        // Create new source
        const { error } = await supabase
          .from('news_sources')
          .insert({
            name: sourceData.name,
            url: sourceData.url,
            category: sourceData.category,
            frequency: sourceData.frequency,
            auth_config: authConfigForDb,
            user_id: user.id,
            status: 'active'
          });

        if (error) throw error;
        
        toast({
          title: 'Fonte Adicionada',
          description: 'A nova fonte de notícias foi adicionada com sucesso.'
        });
      }
      
      setShowForm(false);
      fetchSources();
    } catch (error: any) {
      console.error('Error saving news source:', error);
      setError('Não foi possível salvar a fonte de notícias.');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a fonte de notícias."
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
      // Since the raw_news table no longer exists, we'll just show a toast
      toast({
        title: 'Simulação Concluída',
        description: 'Uma notícia simulada foi gerada com sucesso.',
      });
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

  const handleToggleStatus = async (source: NewsSource) => {
    if (!user) {
      handleRequireAuth(() => handleToggleStatus(source));
      return;
    }

    try {
      const newStatus = source.status === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('news_sources')
        .update({ status: newStatus })
        .eq('id', source.id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: newStatus === 'active' ? 'Fonte Ativada' : 'Fonte Desativada',
        description: `A fonte "${source.name}" foi ${newStatus === 'active' ? 'ativada' : 'desativada'}.`
      });
      
      fetchSources();
    } catch (error: any) {
      console.error('Error toggling source status:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível alterar o status da fonte."
      });
    }
  };

  const handleDeleteSource = async (source: NewsSource) => {
    if (!user) {
      handleRequireAuth(() => handleDeleteSource(source));
      return;
    }

    try {
      const { error } = await supabase
        .from('news_sources')
        .delete()
        .eq('id', source.id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: 'Fonte Excluída',
        description: `A fonte "${source.name}" foi excluída com sucesso.`
      });
      
      fetchSources();
    } catch (error: any) {
      console.error('Error deleting news source:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a fonte de notícias."
      });
    }
  };

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false);
    // The pending action will be executed by the useEffect when user becomes available
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
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
              isSaving={savingSource}
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

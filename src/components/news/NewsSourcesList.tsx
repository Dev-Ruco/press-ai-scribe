
import { useState, useEffect } from 'react';
import { Plus, Edit, Pause, Play, Trash2, Check, X } from 'lucide-react';
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
import { AuthPrompt } from "@/components/auth/AuthPrompt";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const NewsSourcesList = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [promptOpen, setPromptOpen] = useState(false);
  const { toast } = useToast();

  // Fetch news sources on component mount
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    fetchSources();
  }, [user]);

  const fetchSources = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('news_sources')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setSources(data || []);
    } catch (error) {
      console.error('Error fetching news sources:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar suas fontes de notícias.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSource = () => {
    if (!user) {
      setPromptOpen(true);
      return;
    }
    setEditingSource(null);
    setShowForm(true);
  };

  const handleEditSource = (source: any) => {
    if (!user) {
      setPromptOpen(true);
      return;
    }
    setEditingSource(source);
    setShowForm(true);
  };

  const handleSaveSource = async (source: any) => {
    if (!user) {
      setPromptOpen(true);
      return;
    }

    try {
      let newSources;
      
      // Handle whether we're adding or updating a source
      if (source.id && typeof source.id === 'string') {
        // Update existing source
        const { error } = await supabase
          .from('news_sources')
          .update({
            name: source.name,
            url: source.url,
            category: source.category,
            frequency: source.frequency,
            status: source.status
          })
          .eq('id', source.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Update local state
        newSources = sources.map(s => 
          s.id === source.id ? { ...s, ...source } : s
        );
        
        toast({
          title: 'Fonte atualizada',
          description: 'A fonte de notícias foi atualizada com sucesso.',
        });
      } else {
        // Add new source
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
        
        if (error) throw error;
        
        // Update local state
        newSources = [data[0], ...sources];
        
        toast({
          title: 'Fonte adicionada',
          description: 'A nova fonte de notícias foi adicionada com sucesso.',
        });
      }
      
      setSources(newSources);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving news source:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a fonte de notícias.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (source: any) => {
    if (!user) {
      setPromptOpen(true);
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
      
      // Update local state
      const newSources = sources.map(s => 
        s.id === source.id ? { ...s, status: newStatus } : s
      );
      
      setSources(newSources);
      
      toast({
        title: newStatus === 'active' ? 'Fonte ativada' : 'Fonte desativada',
        description: `A fonte "${source.name}" foi ${newStatus === 'active' ? 'ativada' : 'desativada'}.`,
      });
    } catch (error) {
      console.error('Error toggling source status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status da fonte.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSource = async (source: any) => {
    if (!user) {
      setPromptOpen(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('news_sources')
        .delete()
        .eq('id', source.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      const newSources = sources.filter(s => s.id !== source.id);
      setSources(newSources);
      
      toast({
        title: 'Fonte excluída',
        description: `A fonte "${source.name}" foi excluída com sucesso.`,
      });
    } catch (error) {
      console.error('Error deleting news source:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a fonte de notícias.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Fontes de Notícias</CardTitle>
          <Button onClick={handleAddSource} size="sm">
            <Plus size={16} className="mr-1" />
            Adicionar Fonte
          </Button>
        </CardHeader>
        <CardContent>
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
              Nenhuma fonte cadastrada. Adicione sua primeira fonte!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">URL</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">{source.name}</TableCell>
                    <TableCell className="hidden md:table-cell truncate max-w-[200px]">
                      {source.url}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{source.category}</TableCell>
                    <TableCell>
                      {source.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-success">
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
                        <Button variant="ghost" size="sm" onClick={() => handleEditSource(source)}>
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
                          className="text-error hover:text-error/80" 
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
      <AuthPrompt isOpen={promptOpen} onClose={() => setPromptOpen(false)} />
    </div>
  );
};

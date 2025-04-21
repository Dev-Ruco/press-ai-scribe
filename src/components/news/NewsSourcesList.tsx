
import { useState, useEffect } from 'react';
import { Plus, Edit, Pause, Trash2, Check, X, Info } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface NewsSource {
  id: string;
  name: string;
  url: string;
  category: string;
  status: string;
}

export const NewsSourcesList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState<NewsSource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSources();
  }, [user]);

  const fetchSources = async () => {
    if (!user) {
      setSources([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('news_sources')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setSources(data || []);
    } catch (error) {
      console.error('Error fetching news sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSource = () => {
    setEditingSource(null);
    setShowForm(true);
  };

  const handleEditSource = (source: NewsSource) => {
    setEditingSource(source);
    setShowForm(true);
  };

  const handleSaveSource = async (source: any) => {
    try {
      if (editingSource) {
        // Update existing source
        const { data, error } = await supabase
          .from('news_sources')
          .update({
            name: source.name,
            url: source.url,
            category: source.category,
            frequency: source.frequency,
            status: source.status
          })
          .eq('id', editingSource.id)
          .select();
          
        if (error) throw error;
        
        toast({
          title: "Fonte atualizada",
          description: "A fonte de notícias foi atualizada com sucesso"
        });
        
        // Update the local state
        setSources(prev => prev.map(s => s.id === editingSource.id ? data[0] : s));
      } else {
        // Insert new source
        const { data, error } = await supabase
          .from('news_sources')
          .insert({
            name: source.name,
            url: source.url,
            category: source.category,
            frequency: source.frequency,
            user_id: user!.id
          })
          .select();
          
        if (error) throw error;
        
        toast({
          title: "Fonte adicionada",
          description: "A fonte de notícias foi adicionada com sucesso"
        });
        
        // Update the local state
        setSources(prev => [...prev, data[0]]);
      }
      
      setShowForm(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar a fonte de notícias",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (source: NewsSource) => {
    try {
      const newStatus = source.status === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('news_sources')
        .update({ status: newStatus })
        .eq('id', source.id);
        
      if (error) throw error;
      
      // Update the local state
      setSources(prev => prev.map(s => 
        s.id === source.id ? {...s, status: newStatus} : s
      ));
      
      toast({
        title: newStatus === 'active' ? "Fonte ativada" : "Fonte desativada",
        description: `A fonte "${source.name}" foi ${newStatus === 'active' ? 'ativada' : 'desativada'}`
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar o status da fonte",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSource = async (source: NewsSource) => {
    try {
      const { error } = await supabase
        .from('news_sources')
        .delete()
        .eq('id', source.id);
        
      if (error) throw error;
      
      // Update the local state
      setSources(prev => prev.filter(s => s.id !== source.id));
      
      toast({
        title: "Fonte removida",
        description: `A fonte "${source.name}" foi removida com sucesso`
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover a fonte",
        variant: "destructive"
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
          ) : loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando fontes de notícias...</p>
            </div>
          ) : sources.length > 0 ? (
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
                          <Pause size={16} />
                          <span className="sr-only">{source.status === 'active' ? 'Pausar' : 'Ativar'}</span>
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
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Info className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">Você ainda não adicionou nenhuma fonte de notícias.</p>
              <Button onClick={handleAddSource}>
                <Plus size={16} className="mr-1" />
                Adicionar Fonte
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

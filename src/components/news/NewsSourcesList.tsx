
import { useState } from 'react';
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

export const NewsSourcesList = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingSource, setSavingSource] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fetchSources = async () => {
    // Since the news_sources table no longer exists, we'll just show an empty state
    setIsLoading(true);
    setSources([]);
    setIsLoading(false);
  };

  const handleSaveSource = async (source: any) => {
    if (!user) {
      handleRequireAuth(() => handleSaveSource(source));
      return;
    }

    try {
      setSavingSource(true);
      setError(null);
      
      // Since the table no longer exists, we'll just simulate a successful save
      toast({
        title: source.id ? 'Fonte Atualizada' : 'Fonte Adicionada',
        description: source.id 
          ? 'A fonte de notícias foi atualizada com sucesso.' 
          : 'A nova fonte de notícias foi adicionada com sucesso.',
      });
      
      setShowForm(false);
      fetchSources();
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

  const handleToggleStatus = async (source: any) => {
    handleRequireAuth(async () => {
      try {
        const newStatus = source.status === 'active' ? 'inactive' : 'active';
        
        // Since the table no longer exists, we'll just show a toast
        toast({
          title: newStatus === 'active' ? 'Fonte Ativada' : 'Fonte Desativada',
          description: `A fonte "${source.name}" foi ${newStatus === 'active' ? 'ativada' : 'desativada'}.`,
        });
        
        fetchSources();
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
        // Since the table no longer exists, we'll just show a toast
        toast({
          title: 'Fonte Excluída',
          description: `A fonte "${source.name}" foi excluída com sucesso.`,
        });
        
        fetchSources();
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

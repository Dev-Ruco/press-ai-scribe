
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, Download, Trash2, Headphones } from 'lucide-react';
import { getTranscriptions, deleteTranscription } from '@/services/transcriptionService';

interface TranscriptionProps {
  id: string;
  name: string;
  duration?: string;
  content?: string;
  status?: string;
  created_at: string;
}

export function TranscriptionHistory() {
  const [transcriptions, setTranscriptions] = useState<TranscriptionProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTranscriptions();
    } else {
      setTranscriptions([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchTranscriptions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    console.log('Buscando transcrições para o usuário:', user.id);
    
    const result = await getTranscriptions();
    
    if (result.success) {
      setTranscriptions(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as transcrições."
      });
    }
    
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      console.log('Excluindo transcrição:', id);
      
      const result = await deleteTranscription(id);
      
      if (result.success) {
        setTranscriptions(transcriptions.filter(t => t.id !== id));
        
        toast({
          title: 'Transcrição Excluída',
          description: 'A transcrição foi excluída com sucesso.',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erro ao excluir transcrição:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a transcrição.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getStatusBadge = (status: string = 'pending') => {
    switch (status) {
      case "completed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Concluída</span>;
      case "processing":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Processando</span>;
      case "failed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Falha</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pendente</span>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transcrições</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            Carregando transcrições...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transcriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transcrições</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            {user 
              ? "Você ainda não tem transcrições. Faça o upload de um arquivo de áudio para começar."
              : "Faça login para visualizar suas transcrições."}
          </div>
          {user && (
            <div className="text-center mt-4">
              <Button onClick={() => navigate('/transcribe/new')}>
                Nova Transcrição
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Histórico de Transcrições</CardTitle>
        <Button onClick={() => navigate('/transcribe/new')}>
          Nova Transcrição
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Modo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transcriptions.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{formatDate(item.created_at)}</TableCell>
                <TableCell>{item.duration || '---'}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Headphones className="h-4 w-4 mr-1" />
                    <span>Whisper</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/transcribe/${item.id}`)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver</span>
                    </Button>
                    {item.status === 'completed' && (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive/80" 
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

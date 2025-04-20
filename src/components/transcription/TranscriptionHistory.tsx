
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardHeader,
  CardContent
} from "@/components/ui/card";
import { 
  Download, 
  Edit, 
  Trash2, 
  Play, 
  Search, 
  Calendar,
  SlidersHorizontal,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Transcription {
  id: string;
  name: string;
  date: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed' | 'pending';
}

export function TranscriptionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transcriptionToDelete, setTranscriptionToDelete] = useState<Transcription | null>(null);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carregar transcrições do usuário atual
  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        setIsLoading(true);
        
        // Obter dados do usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          return;
        }
        
        // Buscar transcrições do usuário
        const { data, error } = await supabase
          .from('transcriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Formatar os dados para o componente
        const formattedTranscriptions = data?.map(item => ({
          id: item.id,
          name: item.name,
          date: new Date(item.created_at).toLocaleDateString('pt-BR'),
          duration: item.duration || "00:00",
          status: item.status as 'completed' | 'processing' | 'failed' | 'pending'
        })) || [];
        
        setTranscriptions(formattedTranscriptions);
      } catch (error) {
        console.error('Erro ao buscar transcrições:', error);
        toast.error('Não foi possível carregar suas transcrições.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTranscriptions();
  }, []);
  
  const filteredTranscriptions = transcriptions.filter(
    (transcription) => 
      transcription.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDelete = (transcription: Transcription) => {
    setTranscriptionToDelete(transcription);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!transcriptionToDelete) return;
    
    try {
      const { error } = await supabase
        .from('transcriptions')
        .delete()
        .eq('id', transcriptionToDelete.id);
      
      if (error) throw error;
      
      // Atualizar a lista de transcrições
      setTranscriptions(transcriptions.filter(t => t.id !== transcriptionToDelete.id));
      
      toast.success(`Transcrição "${transcriptionToDelete.name}" excluída com sucesso`);
    } catch (error) {
      console.error('Erro ao excluir transcrição:', error);
      toast.error('Não foi possível excluir a transcrição.');
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Play className="h-5 w-5" />
            Suas Transcrições
          </h2>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar transcrições..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Arquivo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTranscriptions.length > 0 ? (
                  filteredTranscriptions.map((transcription) => (
                    <TableRow key={transcription.id}>
                      <TableCell className="font-medium">{transcription.name}</TableCell>
                      <TableCell>{transcription.date}</TableCell>
                      <TableCell>{transcription.duration}</TableCell>
                      <TableCell>
                        <span className={
                          transcription.status === 'completed' ? "text-success bg-success/10 px-2 py-1 rounded-full text-xs" :
                          transcription.status === 'processing' ? "text-primary bg-primary/10 px-2 py-1 rounded-full text-xs" :
                          "text-destructive bg-destructive/10 px-2 py-1 rounded-full text-xs"
                        }>
                          {transcription.status === 'completed' ? 'Concluído' : 
                          transcription.status === 'processing' ? 'Processando' : 
                          transcription.status === 'pending' ? 'Pendente' : 'Falhou'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {transcription.status === 'completed' && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => toast.success(`Iniciando download de ${transcription.name}`)}>
                                <Download size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => toast.info(`Editando transcrição: ${transcription.name}`)}>
                                <Edit size={16} />
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(transcription)}
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'Nenhuma transcrição encontrada para sua busca.' : 'Você ainda não possui transcrições.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a transcrição "{transcriptionToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

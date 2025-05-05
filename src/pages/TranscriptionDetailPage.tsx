
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ArrowLeft, Download, Trash2, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import { getTranscriptionById, deleteTranscription, subscribeToTranscriptionUpdates } from "@/services/transcriptionService";
import { SaveTranscriptionButton } from "@/components/transcription/SaveTranscriptionButton";

const TranscriptionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transcription, setTranscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTranscription(id);

      // Subscribe to real-time updates for this transcription
      const unsubscribe = subscribeToTranscriptionUpdates(id, (payload) => {
        if (payload.new) {
          setTranscription(payload.new);
          
          // Show toast notification if status changed
          if (payload.old && payload.old.status !== payload.new.status && payload.new.status === 'completed') {
            toast({
              title: "Transcrição concluída",
              description: "Sua transcrição foi processada com sucesso!"
            });
          }
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [id]);

  const fetchTranscription = async (transcriptionId: string) => {
    try {
      setIsLoading(true);
      const result = await getTranscriptionById(transcriptionId);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setTranscription(result.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes da transcrição:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da transcrição.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      const result = await deleteTranscription(id);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Transcrição excluída",
        description: "A transcrição foi excluída com sucesso.",
      });
      
      navigate('/transcribe');
    } catch (error) {
      console.error("Erro ao excluir transcrição:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a transcrição.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getStatusBadge = (status: string = 'pending') => {
    switch (status) {
      case "completed":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Concluída</span>;
      case "processing":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Processando</span>;
      case "failed":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Falha</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pendente</span>;
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/transcribe')}
          className="mb-4 pl-0 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Voltar para Transcrições
        </Button>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Carregando detalhes da transcrição...</p>
          </div>
        ) : !transcription ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">Transcrição não encontrada</h2>
            <p className="text-muted-foreground mb-4">A transcrição que você está procurando não existe ou foi removida.</p>
            <Button onClick={() => navigate('/transcribe')}>
              Ver todas as transcrições
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Headphones className="h-8 w-8" />
                  {transcription.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(transcription.status)}
                  <span className="text-muted-foreground text-sm">
                    Criado em {formatDate(transcription.created_at)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {transcription.status === 'completed' && (
                  <>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download size={16} />
                      Download
                    </Button>
                    
                    <SaveTranscriptionButton
                      fileName={transcription.name}
                      fileUrl={transcription.file_path}
                      mimeType={transcription.source_type || "audio/mpeg"}
                      transcriptionText={transcription.content || ""}
                      disabled={!transcription.content}
                    />
                  </>
                )}
                <Button 
                  variant="destructive" 
                  className="flex items-center gap-2"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} />
                  Excluir
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Conteúdo da Transcrição</CardTitle>
              </CardHeader>
              <CardContent>
                {transcription.status === 'completed' ? (
                  transcription.content ? (
                    <div className="prose max-w-none">
                      <p>{transcription.content}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Esta transcrição foi concluída mas não contém texto.</p>
                  )
                ) : transcription.status === 'processing' ? (
                  <div className="text-center py-10">
                    <Headphones className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Sua transcrição está sendo processada...</p>
                  </div>
                ) : transcription.status === 'failed' ? (
                  <div className="text-center py-10">
                    <p className="text-destructive">Ocorreu um erro ao processar esta transcrição.</p>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">A transcrição ainda não foi iniciada.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detalhes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p>{transcription.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de criação</p>
                    <p>{formatDate(transcription.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de conclusão</p>
                    <p>{formatDate(transcription.completed_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duração</p>
                    <p>{transcription.duration || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p>{getStatusBadge(transcription.status)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo de fonte</p>
                    <p>{transcription.source_type || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TranscriptionDetailPage;

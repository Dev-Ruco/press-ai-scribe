
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Edit, Upload, FileAudio } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

// Tipos
interface Transcription {
  id: string;
  name: string;
  date: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
  file_path?: string;
  content?: string;
}

const AUDIO_BUCKET = 'audio-files';

export default function TranscribePage() {
  const { user } = useAuth();
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [selectedTranscription, setSelectedTranscription] = useState<Transcription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTranscriptions();
    // eslint-disable-next-line
  }, [user]);

  const fetchTranscriptions = async () => {
    if (!user) {
      setTranscriptions([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from('transcriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped = data.map((item) => ({
        id: item.id,
        name: item.name,
        date: new Date(item.created_at).toLocaleDateString('pt-BR'),
        duration: item.duration || '00:00',
        status: item.status as 'completed' | 'processing' | 'failed',
        file_path: item.file_path,
        content: item.content,
      }));
      setTranscriptions(mapped);
      if (!selectedTranscription && mapped.length > 0) setSelectedTranscription(mapped[0]);
    }
    setIsLoading(false);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:h-[80vh] gap-6 p-4">
        {/* Lista de transcrições */}
        <Card className="w-full md:w-2/5 flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="bg-muted px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Minhas Transcrições</h2>
            </div>
            <ScrollArea className="flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground bg-accent border-b">
                    <th className="py-2 px-4 text-left">Arquivo</th>
                    <th className="py-2 px-2">Data</th>
                    <th className="py-2 px-2">Duração</th>
                    <th className="py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        Carregando...
                      </td>
                    </tr>
                  ) : transcriptions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-muted-foreground">
                        Nenhuma transcrição encontrada
                      </td>
                    </tr>
                  ) : (
                    transcriptions.map((tr) => (
                      <tr
                        key={tr.id}
                        className={`cursor-pointer hover:bg-muted/40 transition-all ${selectedTranscription?.id === tr.id ? "bg-primary/10" : ""}`}
                        onClick={() => setSelectedTranscription(tr)}
                      >
                        <td className="py-3 px-4 font-medium flex gap-2 items-center">
                          <FileAudio className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate max-w-[120px]">{tr.name}</span>
                        </td>
                        <td className="py-3 px-2">{tr.date}</td>
                        <td className="py-3 px-2">{tr.duration}</td>
                        <td className="py-3 px-2">
                          {tr.status === "completed" && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Concluída</span>
                          )}
                          {tr.status === "processing" && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Processando</span>
                          )}
                          {tr.status === "failed" && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">Falhou</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="w-full md:w-3/5 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-6">
            {!selectedTranscription ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Selecione uma transcrição à esquerda para visualizar detalhes
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <FileAudio className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-lg font-bold">{selectedTranscription.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedTranscription.date} &#183; {selectedTranscription.duration}</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex gap-1 items-center"
                    disabled={!selectedTranscription.file_path}
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-1 items-center"
                    disabled={selectedTranscription.status !== "completed"}
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                </div>

                <div className="border rounded-lg px-4 py-3 bg-accent flex-1 overflow-y-auto">
                  {selectedTranscription.status === "completed" ? (
                    <pre className="whitespace-pre-wrap text-sm">{selectedTranscription.content || "Transcrição indisponível."}</pre>
                  ) : selectedTranscription.status === "processing" ? (
                    <div className="text-muted-foreground">Transcrição em processamento...</div>
                  ) : (
                    <div className="text-destructive">Erro ao processar transcrição.</div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

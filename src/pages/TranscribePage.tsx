
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FileUp, Headphones, Upload, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { TranscriptionHistory } from "@/components/transcription/TranscriptionHistory";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Transcription {
  id: string;
  name: string;
  date: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
}

const AUDIO_BUCKET = 'audio-files';

const TranscribePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (user) {
      fetchTranscriptions();
    } else {
      setTranscriptions([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchTranscriptions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(item => ({
        id: item.id,
        name: item.name,
        date: new Date(item.created_at).toLocaleDateString('pt-BR'),
        duration: item.duration || '00:00',
        status: item.status as 'completed' | 'processing' | 'failed'
      })) || [];

      setTranscriptions(formattedData);
    } catch (error) {
      console.error("Error fetching transcriptions:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar transcrições",
        description: "Ocorreu um erro ao carregar o histórico de transcrições."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    try {
      // Upload para Storage (bucket)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(AUDIO_BUCKET)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Regista a inserção na base de dados
      const { data: insertData, error: insertError } = await supabase
        .from('transcriptions')
        .insert([
          {
            user_id: user.id,
            name: file.name,
            file_path: uploadData?.path,
            status: 'processing',
            duration: '00:00' // Pode ser atualizado após processamento real
          }
        ]);

      if (insertError) throw insertError;

      toast({
        title: "Ficheiro enviado com sucesso!",
        description: "A transcrição será processada em breve."
      });
      fetchTranscriptions();
    } catch (err: any) {
      console.error("Erro upload/inserção transcrição:", err);
      toast({
        variant: "destructive",
        title: "Erro ao enviar ficheiro",
        description: err.message || "Não foi possível carregar o ficheiro."
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <AuthGuard>
      <MainLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Headphones size={24} className="text-primary" />
              <h1 className="text-3xl font-bold text-text-primary">Transcrições</h1>
            </div>
            <p className="text-text-secondary">
              Transforme áudio em texto com transcrição automática
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <FileUp size={20} className="text-primary" />
                    <h2 className="text-xl font-semibold">Nova Transcrição</h2>
                  </div>

                  <div className="border-2 border-dashed rounded-lg p-10 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <FileUp className="h-10 w-10 text-muted-foreground" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Arraste e solte seu arquivo de áudio</p>
                        <p className="text-muted-foreground text-sm">
                          Suporta MP3, WAV, M4A, FLAC e outros formatos
                        </p>
                      </div>
                      <label className={`cursor-pointer bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                        <Upload className="mr-1 h-4 w-4" />
                        {uploading ? (
                          <>
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            <span>Enviando...</span>
                          </>
                        ) : (
                          <span>Escolher arquivo</span>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="audio/*"
                          disabled={uploading}
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 flex flex-col">
              <CardContent className="p-4 flex-1">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Headphones size={16} className="text-primary" />
                  Histórico de Transcrições
                </h2>
                <TranscriptionHistory 
                  transcriptions={transcriptions}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default TranscribePage;



import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FileUp, Headphones } from "lucide-react";
import { TranscriptionHistory } from "@/components/transcription/TranscriptionHistory";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Transcription {
  id: string;
  name: string;
  date: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
}

const TranscribePage = () => {
  const { user } = useAuth();
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
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
                      <label className="cursor-pointer bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg">
                        Escolher arquivo
                        <input type="file" className="hidden" accept="audio/*" />
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

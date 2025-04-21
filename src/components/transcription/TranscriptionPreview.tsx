
import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Transcription {
  id: string;
  name: string;
  date: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
  file_path?: string;
  content?: string;
}

interface TranscriptionPreviewProps {
  transcription: Transcription | null;
  isLoading?: boolean;
}

const AUDIO_BUCKET = 'audio-files';

export function TranscriptionPreview({ transcription, isLoading = false }: TranscriptionPreviewProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (transcription?.file_path) {
      fetchAudioUrl(transcription.file_path);
    } else {
      setAudioUrl(null);
    }

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [transcription]);

  const fetchAudioUrl = async (filePath: string) => {
    try {
      setIsLoadingAudio(true);
      const { data, error } = await supabase.storage
        .from(AUDIO_BUCKET)
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

      if (error) throw error;
      setAudioUrl(data.signedUrl);
    } catch (error) {
      console.error("Error fetching audio URL:", error);
      setAudioUrl(null);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!transcription) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground mb-2">Nenhuma transcrição selecionada</p>
        <p className="text-xs text-muted-foreground">Selecione uma transcrição da lista abaixo para visualizar detalhes</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {audioUrl && (
        <audio 
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
      
      <div className="mb-4">
        <h3 className="font-medium truncate">{transcription.name}</h3>
        <p className="text-sm text-muted-foreground">
          {transcription.date} · {transcription.duration}
        </p>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "flex-1",
            audioUrl ? "" : "opacity-50 cursor-not-allowed"
          )}
          onClick={togglePlayPause}
          disabled={!audioUrl || isLoadingAudio}
        >
          {isLoadingAudio ? (
            <>Carregando áudio...</>
          ) : isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Reproduzir
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          disabled={!audioUrl}
          title="Download"
          className="text-muted-foreground"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        {transcription.status === 'completed' && (
          <Button 
            variant="outline" 
            size="sm"
            title="Editar transcrição"
            className="text-muted-foreground"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {transcription.status === 'completed' ? (
            transcription.content ? (
              <div className="text-sm whitespace-pre-wrap">{transcription.content}</div>
            ) : (
              <p className="text-muted-foreground text-sm">Conteúdo da transcrição não disponível.</p>
            )
          ) : transcription.status === 'processing' ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Transcrição em processamento...</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">Erro no processamento da transcrição.</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

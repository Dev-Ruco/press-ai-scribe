
import { Button } from "@/components/ui/button";
import { FileText, FileAudio, FileVideo, FileImage, File, X, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export function FilePreview({ files, onRemove }: FilePreviewProps) {
  const { toast } = useToast();
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRefs = useRef<{[key: string]: HTMLAudioElement}>({});
  
  const getFileIcon = (file: File) => {
    if (file.type.includes('audio')) {
      return <FileAudio className="h-4 w-4 text-primary" />;
    } else if (file.type.includes('pdf') || file.type.includes('doc')) {
      return <FileText className="h-4 w-4 text-primary" />;
    } else if (file.type.includes('image')) {
      return <FileImage className="h-4 w-4 text-primary" />;
    } else if (file.type.includes('video')) {
      return <FileVideo className="h-4 w-4 text-primary" />;
    } else {
      return <File className="h-4 w-4 text-primary" />;
    }
  };

  const getFileThumbnail = (file: File) => {
    if (file.type.includes('image')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const toggleAudio = (file: File, index: number) => {
    const audioId = `audio-${index}`;
    const audio = audioRefs.current[audioId];

    if (audio) {
      if (playingAudio === audioId) {
        audio.pause();
        setPlayingAudio(null);
      } else {
        // Pause any currently playing audio
        if (playingAudio && audioRefs.current[playingAudio]) {
          audioRefs.current[playingAudio].pause();
        }
        audio.play();
        setPlayingAudio(audioId);
      }
    }
  };

  const copyFileContent = async (file: File) => {
    try {
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        const text = await file.text();
        await navigator.clipboard.writeText(text);
        toast({
          title: "Conteúdo copiado",
          description: "O texto do arquivo foi copiado para a área de transferência"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Não foi possível copiar",
          description: "Este tipo de arquivo não pode ser copiado como texto"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao copiar",
        description: "Não foi possível copiar o conteúdo do arquivo"
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2 max-w-3xl mx-auto">
      {files.map((file, index) => {
        const thumbnail = getFileThumbnail(file);
        const isAudio = file.type.includes('audio');
        const isVideo = file.type.includes('video');
        const audioId = `audio-${index}`;
        const isPlaying = playingAudio === audioId;

        return (
          <div 
            key={index}
            className="relative group border border-border/40 rounded-md overflow-hidden bg-muted/20"
          >
            {thumbnail ? (
              <div className="relative h-20 w-20">
                <img 
                  src={thumbnail} 
                  alt={file.name} 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col p-2 min-w-[160px]">
                <div className="flex items-center gap-2 mb-1">
                  {getFileIcon(file)}
                  <span className="text-xs truncate flex-1">{file.name}</span>
                </div>
                
                {isAudio && (
                  <>
                    <audio 
                      ref={el => el && (audioRefs.current[audioId] = el)}
                      src={URL.createObjectURL(file)} 
                      className="hidden"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-1 h-7"
                      onClick={() => toggleAudio(file, index)}
                    >
                      {isPlaying ? (
                        <Pause className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <Play className="h-3.5 w-3.5 mr-1" />
                      )}
                      {isPlaying ? 'Pausar' : 'Reproduzir'}
                    </Button>
                  </>
                )}
                
                {isVideo && (
                  <video 
                    src={URL.createObjectURL(file)} 
                    className="max-h-[100px] w-full object-cover mt-1"
                    controls
                  />
                )}
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

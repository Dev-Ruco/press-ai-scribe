
import { Button } from "@/components/ui/button";
import { FileText, FileAudio, FileVideo, FileImage, File, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export function FilePreview({ files, onRemove }: FilePreviewProps) {
  const { toast } = useToast();
  
  const getFileIcon = (file: File) => {
    if (file.type.includes('audio')) {
      return <FileAudio className="h-4 w-4 text-primary" />;
    } else if (file.type.includes('pdf')) {
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

  const copyFileContent = async (file: File, index: number) => {
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
                <div className="absolute top-0 right-0 p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemove(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 pr-8 h-10 w-40">
                {getFileIcon(file)}
                <span className="text-xs truncate flex-1">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

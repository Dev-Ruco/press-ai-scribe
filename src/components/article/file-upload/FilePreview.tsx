
import { FileText, X, AlertCircle, CheckCircle, Clock, Loader, FileImage, FileVideo, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FilePreviewProps {
  files: Array<{
    file: File;
    id: string;
    progress: number;
    status: 'queued' | 'uploading' | 'completed' | 'error';
    error?: string;
  }>;
  onRemove: (file: { id: string }) => void;
}

export function FilePreview({ files, onRemove }: FilePreviewProps) {
  if (files.length === 0) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'uploading':
        return <Loader className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getFileIconByType = (file: File) => {
    // Melhor detecção de tipo de arquivo
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-5 w-5 text-blue-400" />;
    } else if (file.type.startsWith('audio/')) {
      return <FileAudio className="h-5 w-5 text-green-400" />;
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-5 w-5 text-purple-400" />;
    } else if (
      file.type.includes('pdf') || 
      file.type.includes('document') || 
      file.type.includes('text') ||
      file.name.endsWith('.pdf') || 
      file.name.endsWith('.doc') || 
      file.name.endsWith('.docx') || 
      file.name.endsWith('.txt')
    ) {
      return <FileText className="h-5 w-5 text-amber-400" />;
    } else {
      return <FileText className="h-5 w-5 text-white/70" />;
    }
  };

  return (
    <>
      {files.map((file) => (
        <div key={file.id} className="p-3 bg-[#111]/70 rounded-md border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {getFileIconByType(file.file)}
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{file.file.name || `Arquivo ${file.id.substring(0, 5)}`}</p>
                <div className="flex items-center gap-2">
                  {file.file.size > 0 ? (
                    <p className="text-xs text-gray-400">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Tamanho desconhecido
                    </p>
                  )}
                  <div className="flex items-center gap-1">
                    {getStatusIcon(file.status)}
                    {file.status === 'uploading' && (
                      <p className="text-xs text-blue-400">
                        {file.progress}%
                      </p>
                    )}
                    {file.status === 'completed' && (
                      <p className="text-xs text-green-400">
                        Concluído
                      </p>
                    )}
                    {file.status === 'queued' && (
                      <p className="text-xs text-gray-400">
                        Em fila
                      </p>
                    )}
                  </div>
                </div>
                {file.status === 'error' && (
                  <div className="flex items-center gap-1 text-xs text-red-400 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{file.error || "Erro no upload"}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {file.status === 'uploading' && (
                <div className="w-24">
                  <Progress value={file.progress} className="h-2" />
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-white/10"
                onClick={() => onRemove(file)}
                disabled={file.status === 'uploading'}
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

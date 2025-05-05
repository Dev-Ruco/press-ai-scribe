
import { useState } from "react";
import { formatFileSize, getFileTypeCategory } from "@/utils/fileUtils";
import { X, FileText, FileImage, FileAudio, FileVideo, File, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileObject {
  file: File;
  id: string;
  progress: number;
  status: 'queued' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FilePreviewProps {
  files: FileObject[];
  onRemove: (file: FileObject) => void;
}

export function FilePreview({ files, onRemove }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  if (files.length === 0) return null;

  const getFileIcon = (file: File) => {
    const type = file.type;
    
    if (type.startsWith('image/')) return <FileImage className="h-5 w-5 text-blue-400" />;
    if (type.startsWith('audio/')) return <FileAudio className="h-5 w-5 text-green-400" />;
    if (type.startsWith('video/')) return <FileVideo className="h-5 w-5 text-red-400" />;
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) 
      return <FileText className="h-5 w-5 text-yellow-400" />;
    
    return <File className="h-5 w-5 text-gray-400" />;
  };

  const handlePreviewFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Cleanup when done
      return () => URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      {files.map((fileObj) => (
        <div 
          key={fileObj.id}
          className="flex items-center gap-3 rounded-lg border border-border/30 bg-card p-2 shadow-sm"
        >
          <div className="flex-shrink-0">
            {getFileIcon(fileObj.file)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
              <span className="text-xs text-muted-foreground">{formatFileSize(fileObj.file.size)}</span>
            </div>
            
            {fileObj.status === 'uploading' && (
              <Progress value={fileObj.progress} className="h-1.5 mt-1" />
            )}
            
            {fileObj.status === 'error' && (
              <p className="text-xs text-red-400 mt-1 truncate">{fileObj.error || 'Erro no upload'}</p>
            )}
            
            {fileObj.status === 'completed' && fileObj.file.type.startsWith('image/') && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 h-6 px-2 py-0 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => handlePreviewFile(fileObj.file)}
              >
                Visualizar
              </Button>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-muted/30 text-muted-foreground hover:text-foreground"
            onClick={() => onRemove(fileObj)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setPreviewUrl(null)}>
          <div className="max-w-3xl max-h-[80vh] p-2">
            <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
            <Button
              variant="outline"
              className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full"
              onClick={() => setPreviewUrl(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

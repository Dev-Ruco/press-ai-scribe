
import { Button } from "@/components/ui/button";
import { X, FileText, File } from "lucide-react";

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export function FilePreview({ files, onRemove }: FilePreviewProps) {
  const getFileIcon = (file: File) => {
    if (file.type.includes('audio')) {
      return <FileText className="h-4 w-4 text-primary" />;
    } else if (file.type.includes('pdf')) {
      return <FileText className="h-4 w-4 text-primary" />;
    } else if (file.type.includes('image')) {
      return <FileText className="h-4 w-4 text-primary" />;
    } else if (file.type.includes('video')) {
      return <FileText className="h-4 w-4 text-primary" />;
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

  return (
    <div className="flex flex-wrap gap-2 mb-2">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-6 w-6 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 pr-8 h-10 w-32">
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

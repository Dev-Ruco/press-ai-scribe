
import { FileText, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface FilePreviewProps {
  files: Array<{
    file: File;
    progress: number;
    status: 'queued' | 'uploading' | 'completed' | 'error';
    error?: string;
  }>;
  onRemove: (index: number) => void;
}

export function FilePreview({ files, onRemove }: FilePreviewProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <Card key={index} className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <FileText className="h-5 w-5 text-primary/70" />
              <div className="flex-1">
                <p className="text-sm font-medium">{file.file.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {file.status === 'uploading' && (
                    <p className="text-xs text-blue-500">
                      Carregando...
                    </p>
                  )}
                  {file.status === 'completed' && (
                    <p className="text-xs text-green-500">
                      Concluído
                    </p>
                  )}
                </div>
                {file.status === 'error' && (
                  <div className="flex items-center gap-1 text-xs text-destructive mt-1">
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
                className="h-8 w-8"
                onClick={() => onRemove(index)}
                disabled={file.status === 'uploading'}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

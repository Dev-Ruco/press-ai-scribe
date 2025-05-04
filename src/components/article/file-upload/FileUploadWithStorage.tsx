
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileAudio, File as FileIcon, FileImage, Loader2 } from "lucide-react";
import { UploadedFile, useSupabaseStorage } from "@/hooks/useSupabaseStorage";
import { FilePreview } from "./FilePreview";
import { useAuth } from "@/contexts/AuthContext";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { useToast } from "@/hooks/use-toast";

interface FileUploadWithStorageProps {
  onFileUploaded: (files: UploadedFile[]) => void;
  maxSize?: number; // em bytes
  accept?: string;
  disabled?: boolean;
}

export function FileUploadWithStorage({
  onFileUploaded,
  maxSize = 50 * 1024 * 1024, // Default 50MB
  accept = "audio/*,image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/*",
  disabled = false
}: FileUploadWithStorageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadFiles, uploadedFiles, removeFile } = useSupabaseStorage();
  const { user } = useAuth();
  const { requireAuth } = useProgressiveAuth();
  const { toast } = useToast();

  // Clique no botão de upload
  const handleUploadClick = () => {
    requireAuth(() => {
      fileInputRef.current?.click();
    });
  };

  // Arquivos selecionados
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const selectedFiles = Array.from(event.target.files);
    setIsUploading(true);

    try {
      // Validar tamanho dos arquivos
      const invalidFiles = selectedFiles.filter(file => file.size > maxSize);
      if (invalidFiles.length > 0) {
        const invalidNames = invalidFiles.map(f => f.name).join(", ");
        toast({
          variant: "destructive",
          title: "Arquivos muito grandes",
          description: `Os seguintes arquivos excedem o limite de ${(maxSize / (1024 * 1024)).toFixed(0)}MB: ${invalidNames}`
        });
        
        // Continuar apenas com arquivos válidos
        const validFiles = selectedFiles.filter(file => file.size <= maxSize);
        if (validFiles.length === 0) {
          setIsUploading(false);
          return;
        }
        
        // Upload dos arquivos válidos
        const uploadedFiles = await uploadFiles(validFiles);
        
        // Notificar componente pai sobre os arquivos carregados
        if (uploadedFiles.length > 0) {
          onFileUploaded(uploadedFiles);
        }
      } else {
        // Todos os arquivos são válidos
        const uploadedFiles = await uploadFiles(selectedFiles);
        
        // Notificar componente pai sobre os arquivos carregados
        if (uploadedFiles.length > 0) {
          onFileUploaded(uploadedFiles);
        }
      }
    } catch (error) {
      console.error("Erro no upload de arquivos:", error);
    } finally {
      setIsUploading(false);
      // Limpar input para permitir selecionar os mesmos arquivos novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remover arquivo
  const handleRemoveFile = (fileId: string) => {
    removeFile(fileId);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading || disabled || !user}
      />

      <Button
        type="button"
        variant="outline"
        onClick={handleUploadClick}
        disabled={isUploading || disabled}
        className="w-full border-dashed border-2 p-6 flex flex-col items-center gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Enviando arquivos...</span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6" />
            <span>Carregar arquivos</span>
            <span className="text-xs text-muted-foreground">
              *.pdf, *.docx, *.mp3, *.mp4, *.jpg, *.png (máx {(maxSize / (1024 * 1024)).toFixed(0)}MB)
            </span>
          </>
        )}
      </Button>

      {uploadedFiles.length > 0 && (
        <FilePreview
          files={uploadedFiles.map(file => ({
            id: file.id,
            file: new File([], file.fileName, { type: file.mimeType }),
            progress: file.progress,
            status: file.status,
            error: file.error
          }))}
          onRemove={item => handleRemoveFile(item.id)}
        />
      )}
    </div>
  );
}

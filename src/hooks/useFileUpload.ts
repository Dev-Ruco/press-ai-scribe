
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useFileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file
  const ALLOWED_FILE_TYPES = [
    // Documentos
    'text/plain',
    'text/markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'text/html',
    'text/rtf',
    'application/rtf',
    
    // Áudio - formatos expandidos
    'audio/wav',
    'audio/mpeg',
    'audio/mp3',
    'audio/mp4',
    'audio/aac',
    'audio/ogg',
    'audio/webm',
    'audio/flac',
    'audio/x-m4a',
    'audio/*', // Adicionar wildcard para qualquer formato de áudio
    
    // Imagens
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    
    // Vídeos - formatos expandidos
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime', // para .mov
    'video/x-msvideo', // para .avi
    'video/*', // Adicionar wildcard para qualquer formato de vídeo
    
    // Extensões de arquivo (como fallback)
    '.doc',
    '.docx',
    '.pdf',
    '.txt',
    '.md',
    '.rtf',
    '.wav',
    '.mp3',
    '.aac',
    '.ogg',
    '.m4a',
    '.flac',
    '.mp4',
    '.webm',
    '.mov',
    '.avi'
  ];

  // Modified to accept either FileList or array of Files
  const handleFileUpload = (uploadedFiles: FileList | File[]) => {
    const fileArray = Array.isArray(uploadedFiles) 
      ? uploadedFiles 
      : Array.from(uploadedFiles);
    
    const newFiles = fileArray.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 50MB.`
        });
        return false;
      }
      
      // Lógica melhorada para verificação de tipo
      const fileTypeValid = ALLOWED_FILE_TYPES.some(type => {
        // Verificar se o mimetype coincide diretamente
        if (file.type === type) return true;
        
        // Verificar se é um subtipo (ex: audio/* corresponde a audio/mp3)
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          if (file.type.startsWith(category + '/')) return true;
        }
        
        // Verificar se o nome do arquivo termina com a extensão
        if (type.startsWith('.')) {
          if (file.name.toLowerCase().endsWith(type.toLowerCase())) return true;
        }
        
        return false;
      });
      
      if (!fileTypeValid) {
        toast({
          variant: "destructive",
          title: "Tipo de arquivo não suportado",
          description: `${file.name} não é um tipo de arquivo suportado.`
        });
        return false;
      }
      
      return true;
    });

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      
      toast({
        title: "Arquivos adicionados",
        description: `${newFiles.length} arquivo(s) adicionado(s) com sucesso.`
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return { files, handleFileUpload, removeFile };
};

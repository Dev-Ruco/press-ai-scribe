
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useFileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file
  const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB for audio files
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
    console.log("useFileUpload: Handling file upload");
    
    const fileArray = Array.isArray(uploadedFiles) 
      ? uploadedFiles 
      : Array.from(uploadedFiles);
    
    console.log("useFileUpload: Processing files:", fileArray.map(f => ({ 
      name: f.name, 
      type: f.type || "unknown", 
      size: f.size 
    })));
    
    const newFiles = fileArray.filter(file => {
      // Check file size with special handling for audio files
      const isAudio = file.type.includes('audio');
      const maxSize = isAudio ? MAX_AUDIO_SIZE : MAX_FILE_SIZE;
      
      if (file.size > maxSize) {
        console.log(`useFileUpload: File too large: ${file.name} (${file.size} bytes), type: ${file.type}`);
        const sizeMB = Math.round(file.size / (1024 * 1024) * 10) / 10;
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: `${file.name} (${sizeMB}MB) excede o limite de ${maxSizeMB}MB.`
        });
        return false;
      }
      
      // Lógica melhorada para verificação de tipo
      const fileType = file.type || "";
      console.log(`useFileUpload: Checking file type for ${file.name}: ${fileType}`);
      
      const fileTypeValid = ALLOWED_FILE_TYPES.some(type => {
        // Verificar se o mimetype coincide diretamente
        if (fileType === type) {
          console.log(`useFileUpload: File type matched directly: ${type}`);
          return true;
        }
        
        // Verificar se é um subtipo (ex: audio/* corresponde a audio/mp3)
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          if (fileType.startsWith(category + '/')) {
            console.log(`useFileUpload: File type matched category: ${category}`);
            return true;
          }
        }
        
        // Verificar se o nome do arquivo termina com a extensão
        if (type.startsWith('.')) {
          if (file.name.toLowerCase().endsWith(type.toLowerCase())) {
            console.log(`useFileUpload: File name matched extension: ${type}`);
            return true;
          }
        }
        
        return false;
      });
      
      if (!fileTypeValid) {
        console.log(`useFileUpload: Unsupported file type: ${file.name} (${fileType})`);
        toast({
          variant: "destructive",
          title: "Tipo de arquivo não suportado",
          description: `${file.name} não é um tipo de arquivo suportado.`
        });
        return false;
      }
      
      console.log(`useFileUpload: File passed validation: ${file.name}`);
      return true;
    });

    if (newFiles.length > 0) {
      console.log(`useFileUpload: Adding ${newFiles.length} files`);
      setFiles(prev => [...prev, ...newFiles]);
      
      toast({
        title: "Arquivos adicionados",
        description: `${newFiles.length} arquivo(s) adicionado(s) com sucesso.`
      });
    }
  };

  const removeFile = (index: number) => {
    console.log(`useFileUpload: Removing file at index ${index}`);
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return { files, handleFileUpload, removeFile };
};

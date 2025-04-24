
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useFileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file
  const ALLOWED_FILE_TYPES = [
    'text/plain',
    'text/markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'text/html',
    'text/rtf',
    'application/rtf',
    'audio/wav',
    'audio/mpeg',
    'audio/mp3',
    'audio/webm',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    '.doc',
    '.docx',
    '.pdf',
    '.txt',
    '.md',
    '.rtf',
    '.wav',
    '.mp3'
  ];

  const handleFileUpload = (uploadedFiles: FileList) => {
    const newFiles = Array.from(uploadedFiles).filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 50MB.`
        });
        return false;
      }
      
      if (!ALLOWED_FILE_TYPES.some(type => 
        file.type.includes(type) || type.includes(file.type)
      )) {
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

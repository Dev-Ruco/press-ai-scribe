
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { v4 as uuidv4 } from "uuid";

export interface UploadedFile {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  fileType: 'audio' | 'document' | 'image';
  fileSize: number;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export function useSupabaseStorage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  /**
   * Determina o tipo de arquivo baseado no MIME type
   */
  const getFileType = (mimeType: string): 'audio' | 'document' | 'image' => {
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('image/')) return 'image';
    return 'document';
  };

  /**
   * Faz upload de um arquivo para o Supabase Storage
   */
  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const fileId = uuidv4();
    const fileType = getFileType(file.type);
    const folderPath = fileType === 'audio' ? 'audios' : fileType === 'image' ? 'images' : 'documents';
    
    // Cria um nome único para o arquivo no storage
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = `${folderPath}/${fileName}`;
    
    // Adiciona o arquivo à lista com status 'uploading'
    const newFile: UploadedFile = {
      id: fileId,
      url: '',
      fileName: file.name,
      mimeType: file.type,
      fileType,
      fileSize: file.size,
      status: 'uploading',
      progress: 0
    };
    
    setUploadedFiles(prev => [...prev, newFile]);
    
    try {
      // Upload do arquivo para o Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('media-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
      }
      
      // Obter a URL pública do arquivo
      const { data: publicUrlData } = supabase.storage
        .from('media-files')
        .getPublicUrl(filePath);
      
      if (!publicUrlData?.publicUrl) {
        throw new Error("Não foi possível obter URL pública do arquivo");
      }
      
      // Atualiza o arquivo na lista com a URL e status 'completed'
      const uploadedFile: UploadedFile = {
        ...newFile,
        url: publicUrlData.publicUrl,
        status: 'completed',
        progress: 100
      };
      
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? uploadedFile : f)
      );
      
      return uploadedFile;
    } catch (error) {
      console.error("Erro no upload:", error);
      
      // Atualiza o arquivo na lista com status 'error'
      const errorFile: UploadedFile = {
        ...newFile,
        status: 'error',
        error: error.message,
        progress: 0
      };
      
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? errorFile : f)
      );
      
      toast({
        variant: "destructive",
        title: "Erro de upload",
        description: `Não foi possível fazer upload de ${file.name}: ${error.message}`
      });
      
      throw error;
    }
  };

  /**
   * Faz upload de múltiplos arquivos para o Supabase Storage
   */
  const uploadFiles = async (files: File[]): Promise<UploadedFile[]> => {
    if (files.length === 0) return [];
    
    setIsUploading(true);
    
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Autenticação necessária",
          description: "Você precisa estar logado para fazer upload de arquivos"
        });
        throw new Error("Usuário não autenticado");
      }
      
      // Upload de todos os arquivos em paralelo
      const results = await Promise.allSettled(files.map(uploadFile));
      
      // Filtrar apenas os uploads bem-sucedidos
      const successfulUploads = results
        .filter((result): result is PromiseFulfilledResult<UploadedFile> => result.status === 'fulfilled')
        .map(result => result.value);
      
      if (successfulUploads.length > 0) {
        toast({
          title: "Upload concluído",
          description: `${successfulUploads.length} de ${files.length} arquivos carregados com sucesso`
        });
      }
      
      return successfulUploads;
    } catch (error) {
      console.error("Erro no processamento de uploads:", error);
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Remove um arquivo da lista de uploads
   */
  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  /**
   * Limpa todos os arquivos da lista
   */
  const clearFiles = () => {
    setUploadedFiles([]);
  };

  return {
    uploadedFiles,
    isUploading,
    uploadFile,
    uploadFiles,
    removeFile,
    clearFiles
  };
}

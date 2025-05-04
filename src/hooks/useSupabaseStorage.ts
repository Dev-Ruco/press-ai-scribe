import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { v4 as uuidv4 } from "uuid";

export interface UploadedFile {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  fileType: 'audio' | 'document' | 'image' | 'video';
  fileSize: number;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string; // Ensuring error property is included here as well
}

export function useSupabaseStorage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  /**
   * Determines the file type based on MIME type
   */
  const getFileType = (mimeType: string): 'audio' | 'document' | 'image' | 'video' => {
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  };

  /**
   * Uploads a file to the Supabase Storage
   */
  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const fileId = uuidv4();
    const fileType = getFileType(file.type);
    
    // Create a unique name for the file in storage
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = `${fileType}/${fileName}`;
    
    // Add the file to the list with 'uploading' status
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
      // Upload the file to Supabase Storage in the content-files bucket
      const { error: uploadError, data } = await supabase.storage
        .from('content-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`);
      }
      
      // Get the public URL of the file
      const { data: publicUrlData } = supabase.storage
        .from('content-files')
        .getPublicUrl(filePath);
      
      if (!publicUrlData?.publicUrl) {
        throw new Error("Could not get file's public URL");
      }
      
      // Update the file in the list with the URL and 'completed' status
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
      console.error("Upload error:", error);
      
      // Update the file in the list with 'error' status
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
        title: "Upload error",
        description: `Could not upload ${file.name}: ${error.message}`
      });
      
      throw error;
    }
  };

  /**
   * Upload multiple files to Supabase Storage
   */
  const uploadFiles = async (files: File[]): Promise<UploadedFile[]> => {
    if (files.length === 0) return [];
    
    setIsUploading(true);
    
    try {
      // Check if the user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You need to be logged in to upload files"
        });
        throw new Error("User not authenticated");
      }
      
      // Upload all files in parallel
      const results = await Promise.allSettled(files.map(uploadFile));
      
      // Filter only successful uploads
      const successfulUploads = results
        .filter((result): result is PromiseFulfilledResult<UploadedFile> => result.status === 'fulfilled')
        .map(result => result.value);
      
      if (successfulUploads.length > 0) {
        toast({
          title: "Upload complete",
          description: `${successfulUploads.length} of ${files.length} files uploaded successfully`
        });
      }
      
      return successfulUploads;
    } catch (error) {
      console.error("Error processing uploads:", error);
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Remove a file from the upload list
   */
  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  /**
   * Clear all files from the list
   */
  const clearFiles = () => {
    setUploadedFiles([]);
  };

  return {
    uploadedFiles,
    isUploading,
    uploadFile,
    uploadFiles,  // Garantindo que esta função está disponível para exportação
    removeFile,
    clearFiles
  };
}

// Adicionando uma exportação da função para uso direto em imports
export const uploadFiles = async (files: File[]): Promise<UploadedFile[]> => {
  // Implementação simplificada para uso sem o hook
  const supabase = (await import('@/integrations/supabase/client')).supabase;
  const getFileType = (mimeType: string): 'audio' | 'document' | 'image' | 'video' => {
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  };
  
  const uploadResults: UploadedFile[] = [];
  
  for (const file of files) {
    const fileId = uuidv4();
    const fileType = getFileType(file.type);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = `${fileType}/${fileName}`;
    
    try {
      const { error } = await supabase.storage
        .from('content-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('content-files')
        .getPublicUrl(filePath);
      
      if (data?.publicUrl) {
        uploadResults.push({
          id: fileId,
          url: data.publicUrl,
          fileName: file.name,
          mimeType: file.type,
          fileType,
          fileSize: file.size,
          status: 'completed',
          progress: 100
        });
      }
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
    }
  }
  
  return uploadResults;
};

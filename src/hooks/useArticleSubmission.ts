
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { triggerN8NWebhook, ContentPayload, chunkedUpload, MAX_CHUNK_SIZE } from '@/utils/webhookUtils';

interface SavedLink {
  url: string;
  id: string;
}

export function useArticleSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitArticle = async (content: string, files: File[], links: SavedLink[] = []) => {
    setIsSubmitting(true);
    console.log("Starting submission with:", { 
      contentLength: content?.length || 0, 
      filesCount: files?.length || 0, 
      linksCount: links?.length || 0 
    });

    try {
      // Process files if present
      if (files.length > 0) {
        console.log("Processing files:", files.map(f => ({ name: f.name, type: f.type, size: f.size })));
        
        for (const file of files) {
          console.log(`Processing file: ${file.name} (${file.type}, ${file.size} bytes)`);
          
          const fileId = crypto.randomUUID();
          
          // Determine if we should use chunked upload based on file type and size
          const isAudio = file.type.includes('audio');
          const isLargeFile = file.size > MAX_CHUNK_SIZE;
          
          if (isAudio || isLargeFile) {
            console.log(`Using chunked upload for ${file.name} (${file.type}, ${file.size} bytes)`);
            await chunkedUpload(file, fileId);
            console.log(`Chunked upload complete for ${file.name}`);
          } else {
            // For smaller non-audio files, use the original method
            const reader = new FileReader();
            reader.readAsDataURL(file);

            await new Promise((resolve, reject) => {
              reader.onload = async () => {
                try {
                  if (!reader.result) {
                    throw new Error(`Failed to read file: ${file.name}`);
                  }
                  
                  console.log(`File read successfully: ${file.name}, data length: ${(reader.result as string).length}`);
                  
                  const payload: ContentPayload = {
                    id: fileId,
                    type: 'file',
                    mimeType: file.type || 'application/octet-stream',
                    data: reader.result as string,
                    authMethod: null,
                    fileName: file.name,
                    fileSize: file.size
                  };

                  console.log(`Sending file to webhook: ${file.name} (${payload.mimeType})`);
                  await triggerN8NWebhook(payload);
                  console.log(`File sent successfully: ${file.name}`);
                  resolve(null);
                } catch (error) {
                  console.error(`Error processing file ${file.name}:`, error);
                  reject(error);
                }
              };
              
              reader.onerror = (event) => {
                console.error(`Error reading file ${file.name}:`, reader.error);
                reject(reader.error);
              };
            });
          }
        }
      }

      // Process text content if present
      if (content && content.trim()) {
        console.log("Processing text content, length:", content.length);
        const textPayload: ContentPayload = {
          id: crypto.randomUUID(),
          type: 'text',
          mimeType: 'text/plain',
          data: content,
          authMethod: null
        };

        await triggerN8NWebhook(textPayload);
        console.log("Text content sent successfully");
      }

      // Process links if present
      if (links && links.length > 0) {
        console.log("Processing links:", links);
        for (const link of links) {
          console.log(`Processing link: ${link.url}`);
          const linkPayload: ContentPayload = {
            id: link.id || crypto.randomUUID(),
            type: 'link',
            mimeType: 'text/uri-list',
            data: link.url,
            authMethod: null
          };

          await triggerN8NWebhook(linkPayload);
          console.log(`Link sent successfully: ${link.url}`);
        }
      }

      toast({
        title: "Sucesso",
        description: "Conteúdo enviado com sucesso para processamento.",
      });

    } catch (error) {
      console.error('Erro ao enviar artigo:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível enviar o conteúdo: ${error.message || 'Erro desconhecido'}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitArticle
  };
}

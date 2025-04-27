
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { triggerN8NWebhook, ContentPayload, chunkedUpload } from '@/utils/webhookUtils';

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
          const fileId = crypto.randomUUID();
          
          // Use the chunkedUpload function from webhookUtils
          const uploadSuccess = await chunkedUpload(file, fileId);
          
          if (!uploadSuccess) {
            throw new Error(`Failed to upload file: ${file.name}`);
          }
          
          console.log(`File uploaded successfully: ${file.name}`);
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
      throw error; // Re-throw to be handled by the caller
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitArticle
  };
}

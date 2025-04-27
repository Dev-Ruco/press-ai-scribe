
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { triggerN8NWebhook, ContentPayload } from '@/utils/webhookUtils';

interface SavedLink {
  url: string;
  id: string;
}

export function useArticleSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitArticle = async (content: string, files: File[], links: SavedLink[] = []) => {
    setIsSubmitting(true);

    try {
      // Process files if present
      if (files.length > 0) {
        for (const file of files) {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          await new Promise((resolve, reject) => {
            reader.onload = async () => {
              try {
                const payload: ContentPayload = {
                  id: crypto.randomUUID(),
                  type: 'file',
                  mimeType: file.type,
                  data: reader.result as string,
                  authMethod: null
                };

                await triggerN8NWebhook(payload);
                resolve(null);
              } catch (error) {
                reject(error);
              }
            };
            reader.onerror = () => reject(reader.error);
          });
        }
      }

      // Process text content if present
      if (content.trim()) {
        const textPayload: ContentPayload = {
          id: crypto.randomUUID(),
          type: 'text',
          mimeType: 'text/plain',
          data: content,
          authMethod: null
        };

        await triggerN8NWebhook(textPayload);
      }

      // Process links if present
      if (links.length > 0) {
        for (const link of links) {
          const linkPayload: ContentPayload = {
            id: crypto.randomUUID(),
            type: 'link',
            mimeType: 'text/uri-list',
            data: link.url,
            authMethod: null
          };

          await triggerN8NWebhook(linkPayload);
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
        description: "Não foi possível enviar o conteúdo. Por favor, tente novamente.",
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

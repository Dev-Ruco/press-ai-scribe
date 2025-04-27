
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { triggerN8NWebhook, ContentPayload } from '@/utils/webhookUtils';

export function useArticleSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitArticle = async (content: string, files: File[]) => {
    setIsSubmitting(true);

    try {
      // Se houver arquivos, envia cada um
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

      // Se houver conteúdo textual, envia também
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

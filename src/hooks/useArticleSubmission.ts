
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useProcessingStatus } from './useProcessingStatus';
import { submitArticleToN8N, SubmissionResult } from '@/utils/articleSubmissionUtils';
import { N8N_WEBHOOK_URL } from '@/utils/webhook/types';

export function useArticleSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { processingStatus, updateProgress } = useProcessingStatus();
  const { toast } = useToast();

  const submitArticle = async (
    content: string, 
    articleType: string,
    files: any[] = [], 
    links: string[] = [], 
    onSuccess?: () => void
  ) => {
    setIsSubmitting(true);
    
    try {
      const result = await submitArticleToN8N(
        content, 
        articleType,
        files, 
        links, 
        updateProgress,
        onSuccess
      );
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: `Conteúdo enviado com sucesso para ${N8N_WEBHOOK_URL}! Avançando para a próxima etapa...`,
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: `Não foi possível enviar o conteúdo para ${N8N_WEBHOOK_URL}: ${result.status.error || 'Erro desconhecido'}`,
        });
      }
      
      return result;
      
    } catch (error) {
      console.error(`Erro ao enviar artigo para ${N8N_WEBHOOK_URL}:`, error);
      
      updateProgress(
        "error", 
        0, 
        `Ocorreu um erro durante o envio para ${N8N_WEBHOOK_URL}.`, 
        error.message || 'Erro desconhecido'
      );
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível enviar o conteúdo para ${N8N_WEBHOOK_URL}: ${error.message || 'Erro desconhecido'}`,
      });
      
      return {
        success: false,
        status: processingStatus
      };
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelProcessing = () => {
    setIsSubmitting(false);
    updateProgress("idle", 0, "");
    
    toast({
      title: "Processamento cancelado",
      description: `O envio para ${N8N_WEBHOOK_URL} foi interrompido pelo usuário.`
    });
  };

  return {
    isSubmitting,
    processingStatus,
    submitArticle,
    cancelProcessing
  };
}

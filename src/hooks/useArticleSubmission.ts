
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  triggerN8NWebhook, 
  ContentPayload, 
  chunkedUpload, 
  N8N_WEBHOOK_URL,
  sendArticleToN8N
} from '@/utils/webhookUtils';

interface ProcessingStatus {
  stage: 'idle' | 'uploading' | 'analyzing' | 'extracting' | 'organizing' | 'completed' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export function useArticleSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    stage: "idle",
    progress: 0,
    message: ""
  });
  const { toast } = useToast();

  const updateProgress = (
    stage: ProcessingStatus['stage'], 
    progress: number, 
    message: string, 
    error?: string
  ) => {
    console.log('Updating progress:', { stage, progress, message, error });
    setProcessingStatus({ stage, progress, message, error });
  };

  const submitArticle = async (content: string, files: File[], links: any[] = [], onSuccess?: () => void) => {
    setIsSubmitting(true);
    updateProgress("uploading", 5, `Iniciando envio para ${N8N_WEBHOOK_URL}...`);
    
    console.log("Starting submission with:", { 
      contentLength: content?.length || 0, 
      filesCount: files?.length || 0, 
      linksCount: links?.length || 0,
      webhookUrl: N8N_WEBHOOK_URL
    });

    try {
      // Enviar todo o conteúdo de uma vez no formato exigido
      updateProgress("uploading", 20, `Enviando dados para ${N8N_WEBHOOK_URL}...`);
      
      // Obter o tipo de artigo (se estiver disponível)
      const articleType = "Artigo"; // Valor padrão
      
      // Enviar tudo de uma vez para o webhook no formato necessário
      await sendArticleToN8N(
        content,
        articleType,
        files,
        links
      );
      
      updateProgress("analyzing", 80, `A IA está analisando seu conteúdo via ${N8N_WEBHOOK_URL}...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateProgress("completed", 100, `Processamento concluído com sucesso via ${N8N_WEBHOOK_URL}!`);

      // Add delay before transitioning
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Sucesso",
        description: `Conteúdo enviado com sucesso para ${N8N_WEBHOOK_URL}! Avançando para a próxima etapa...`,
      });

      // Call success callback if provided
      if (onSuccess) {
        console.log(`Calling success callback after content was processed via ${N8N_WEBHOOK_URL}`);
        onSuccess();
      }

      return {
        success: true,
        status: processingStatus
      };

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

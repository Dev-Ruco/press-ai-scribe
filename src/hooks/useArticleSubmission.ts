
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { triggerN8NWebhook, ContentPayload, chunkedUpload, N8N_WEBHOOK_URL } from '@/utils/webhookUtils';

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
    updateProgress("uploading", 5, `Iniciando envio de arquivos para ${N8N_WEBHOOK_URL}...`);
    
    console.log("Starting submission with:", { 
      contentLength: content?.length || 0, 
      filesCount: files?.length || 0, 
      linksCount: links?.length || 0,
      webhookUrl: N8N_WEBHOOK_URL
    });

    try {
      // Generate a session ID for this submission
      const sessionId = `submission_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      console.log(`Generated session ID: ${sessionId} for submission to ${N8N_WEBHOOK_URL}`);
      
      // First notify the webhook that we're starting a session
      try {
        await triggerN8NWebhook({
          id: `session-${sessionId}`,
          type: 'session-start',
          mimeType: 'application/json',
          data: JSON.stringify({ timestamp: new Date().toISOString() }),
          authMethod: null,
          sessionId
        });
        console.log(`Session start notification sent to ${N8N_WEBHOOK_URL}`);
      } catch (error) {
        console.warn(`Failed to send session start notification to ${N8N_WEBHOOK_URL}:`, error);
        // Continue anyway as this is just a notification
      }

      // Process files if present
      if (files.length > 0) {
        console.log(`Processing ${files.length} files to ${N8N_WEBHOOK_URL}:`, files.map(f => ({ name: f.name, type: f.type, size: f.size })));
        
        const totalFiles = files.length;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileId = crypto.randomUUID();
          
          updateProgress(
            "uploading", 
            5 + Math.floor((i / totalFiles) * 40), 
            `Enviando arquivo ${i+1} de ${totalFiles}: ${file.name} para ${N8N_WEBHOOK_URL}`
          );
          
          try {
            const uploadSuccess = await chunkedUpload(file, fileId, undefined, sessionId);
            
            if (!uploadSuccess) {
              throw new Error(`Falha ao enviar arquivo: ${file.name} para ${N8N_WEBHOOK_URL}`);
            }
            
            console.log(`File uploaded successfully: ${file.name} to ${N8N_WEBHOOK_URL}`);
          } catch (error) {
            console.error(`Error uploading file ${file.name} to ${N8N_WEBHOOK_URL}:`, error);
            toast({
              variant: "destructive",
              title: `Erro ao enviar arquivo: ${file.name}`,
              description: error.message || "Falha ao enviar arquivo"
            });
            // Continue with other files instead of failing completely
          }
        }
      }

      // Process text content if present
      if (content && content.trim()) {
        updateProgress("uploading", 50, `Enviando conteúdo de texto para ${N8N_WEBHOOK_URL}...`);
        
        console.log(`Processing text content (${content.length} chars) to ${N8N_WEBHOOK_URL}`);
        const textPayload: ContentPayload = {
          id: crypto.randomUUID(),
          type: 'text',
          mimeType: 'text/plain',
          data: content,
          authMethod: null,
          sessionId
        };

        await triggerN8NWebhook(textPayload);
        console.log(`Text content sent successfully to ${N8N_WEBHOOK_URL}`);
      }

      // Process links if present
      if (links && links.length > 0) {
        updateProgress("uploading", 75, `Enviando ${links.length} links para ${N8N_WEBHOOK_URL}...`);
        
        console.log(`Processing ${links.length} links to ${N8N_WEBHOOK_URL}:`, links);
        for (const link of links) {
          try {
            const linkPayload: ContentPayload = {
              id: link.id || crypto.randomUUID(),
              type: 'link',
              mimeType: 'text/uri-list',
              data: link.url,
              authMethod: null,
              sessionId
            };

            await triggerN8NWebhook(linkPayload);
            console.log(`Link sent successfully: ${link.url} to ${N8N_WEBHOOK_URL}`);
          } catch (error) {
            console.error(`Error sending link ${link.url} to ${N8N_WEBHOOK_URL}:`, error);
            toast({
              variant: "destructive",
              title: `Erro ao enviar link`,
              description: error.message || "Falha ao processar link"
            });
            // Continue with other links
          }
        }
      }

      // Notify webhook that session is complete
      try {
        await triggerN8NWebhook({
          id: `session-end-${sessionId}`,
          type: 'session-end',
          mimeType: 'application/json',
          data: JSON.stringify({ 
            timestamp: new Date().toISOString(),
            summary: {
              files: files.length,
              links: links?.length || 0,
              textContentLength: content?.length || 0
            }
          }),
          authMethod: null,
          sessionId
        });
        console.log(`Session end notification sent to ${N8N_WEBHOOK_URL}`);
      } catch (error) {
        console.warn(`Failed to send session end notification to ${N8N_WEBHOOK_URL}:`, error);
        // Continue anyway as this is just a notification
      }

      // Simular etapas de processamento pela IA
      updateProgress("analyzing", 80, `A IA está analisando seu conteúdo via ${N8N_WEBHOOK_URL}...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      updateProgress("extracting", 90, "Extraindo informações relevantes...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateProgress("organizing", 95, "Organizando os dados para apresentação...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateProgress("completed", 100, `Processamento concluído com sucesso via ${N8N_WEBHOOK_URL}!`);

      // Add delay before transitioning
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Sucesso",
        description: `Conteúdo enviado e processado com sucesso para ${N8N_WEBHOOK_URL}! Avançando para a próxima etapa...`,
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
        `Ocorreu um erro durante o processamento com o webhook ${N8N_WEBHOOK_URL}.`, 
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

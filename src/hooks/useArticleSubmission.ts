
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { triggerN8NWebhook, ContentPayload, chunkedUpload } from '@/utils/webhookUtils';

interface SavedLink {
  url: string;
  id: string;
}

type ProcessingStage = "idle" | "uploading" | "analyzing" | "extracting" | "organizing" | "completed" | "error";

interface ProcessingStatus {
  stage: ProcessingStage;
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
    stage: ProcessingStage, 
    progress: number, 
    message: string, 
    error?: string
  ) => {
    setProcessingStatus({ stage, progress, message, error });
  };

  const submitArticle = async (content: string, files: File[], links: SavedLink[] = []) => {
    setIsSubmitting(true);
    updateProgress("uploading", 5, "Iniciando envio de arquivos...");
    
    console.log("Starting submission with:", { 
      contentLength: content?.length || 0, 
      filesCount: files?.length || 0, 
      linksCount: links?.length || 0 
    });

    try {
      // Process files if present
      if (files.length > 0) {
        console.log("Processing files:", files.map(f => ({ name: f.name, type: f.type, size: f.size })));
        
        const totalFiles = files.length;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileId = crypto.randomUUID();
          
          updateProgress(
            "uploading", 
            5 + Math.floor((i / totalFiles) * 40), 
            `Enviando arquivo ${i+1} de ${totalFiles}: ${file.name}`
          );
          
          // Use the chunkedUpload function from webhookUtils
          const uploadSuccess = await chunkedUpload(file, fileId);
          
          if (!uploadSuccess) {
            throw new Error(`Falha ao enviar arquivo: ${file.name}`);
          }
          
          console.log(`File uploaded successfully: ${file.name}`);
        }
      }

      // Process text content if present
      if (content && content.trim()) {
        updateProgress("uploading", 50, "Enviando conteúdo de texto...");
        
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
        updateProgress("uploading", 75, "Enviando links...");
        
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

      // Simular etapas de processamento pela IA
      // Na implementação real, isso seria controlado por eventos de retorno do webhook
      updateProgress("analyzing", 80, "A IA está analisando seu conteúdo...");
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulação de tempo de processamento
      
      updateProgress("extracting", 90, "Extraindo informações relevantes...");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulação de tempo de processamento
      
      updateProgress("organizing", 95, "Organizando os dados para apresentação...");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulação de tempo de processamento
      
      updateProgress("completed", 100, "Processamento concluído com sucesso!");

      toast({
        title: "Sucesso",
        description: "Conteúdo enviado com sucesso para processamento.",
      });

      return {
        success: true,
        status: processingStatus
      };

    } catch (error) {
      console.error('Erro ao enviar artigo:', error);
      
      updateProgress(
        "error", 
        0, 
        "Ocorreu um erro durante o processamento.", 
        error.message || 'Erro desconhecido'
      );
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível enviar o conteúdo: ${error.message || 'Erro desconhecido'}`,
      });
      
      return {
        success: false,
        status: processingStatus
      };
    }
  };

  const cancelProcessing = () => {
    // Implementar lógica para cancelar processamento aqui
    setIsSubmitting(false);
    updateProgress("idle", 0, "");
    
    toast({
      title: "Processamento cancelado",
      description: "O envio foi interrompido pelo usuário."
    });
  };

  return {
    isSubmitting,
    processingStatus,
    submitArticle,
    cancelProcessing
  };
}

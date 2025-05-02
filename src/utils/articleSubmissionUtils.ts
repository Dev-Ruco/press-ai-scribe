
import { useToast } from "@/hooks/use-toast";
import { N8N_WEBHOOK_URL } from '@/utils/webhook/types';
import { sendArticleToN8N } from '@/utils/webhookUtils';
import { ProcessingStatus } from '@/types/processing';

export interface SubmissionResult {
  success: boolean;
  status: ProcessingStatus;
}

export const submitArticleToN8N = async (
  content: string, 
  files: File[], 
  links: any[] = [],
  updateProgress: (stage: ProcessingStatus['stage'], progress: number, message: string, error?: string) => void,
  onSuccess?: () => void
): Promise<SubmissionResult> => {
  const { toast } = useToast();
  
  try {
    // Start submission process
    updateProgress("uploading", 5, `Iniciando envio para ${N8N_WEBHOOK_URL}...`);
    
    console.log("Starting submission with:", { 
      contentLength: content?.length || 0, 
      filesCount: files?.length || 0, 
      linksCount: links?.length || 0,
      webhookUrl: N8N_WEBHOOK_URL
    });

    // Send all content at once in required format
    updateProgress("uploading", 20, `Enviando dados para ${N8N_WEBHOOK_URL}...`);
      
    // Get article type (if available)
    const articleType = "Artigo"; // Default value
      
    // Send everything at once to the webhook using FormData
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

    // Call success callback if provided
    if (onSuccess) {
      console.log(`Calling success callback after content was processed via ${N8N_WEBHOOK_URL}`);
      onSuccess();
    }

    return {
      success: true,
      status: { stage: "completed", progress: 100, message: `Processamento concluído com sucesso via ${N8N_WEBHOOK_URL}!` }
    };

  } catch (error) {
    console.error(`Erro ao enviar artigo para ${N8N_WEBHOOK_URL}:`, error);
    
    updateProgress(
      "error", 
      0, 
      `Ocorreu um erro durante o envio para ${N8N_WEBHOOK_URL}.`, 
      error.message || 'Erro desconhecido'
    );
    
    return {
      success: false,
      status: { 
        stage: "error", 
        progress: 0, 
        message: `Ocorreu um erro durante o envio para ${N8N_WEBHOOK_URL}.`, 
        error: error.message || 'Erro desconhecido'
      }
    };
  }
};


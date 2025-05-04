
import { useToast } from "@/hooks/use-toast";
import { N8N_WEBHOOK_URL } from '@/utils/webhook/types';
import { sendArticleToN8N } from '@/utils/webhookUtils';
import { ProcessingStatus } from '@/types/processing';
import { supabase } from '@/integrations/supabase/client';
import { UploadedFile } from '@/hooks/useArticleSubmission';

export interface SubmissionResult {
  success: boolean;
  status: ProcessingStatus;
}

export const submitArticleToN8N = async (
  content: string, 
  articleType: string,
  uploadedFiles: UploadedFile[] = [],
  links: string[] = [],
  updateProgress: (stage: ProcessingStatus['stage'], progress: number, message: string, error?: string) => void,
  onSuccess?: () => void
): Promise<SubmissionResult> => {
  try {
    // Start submission process
    updateProgress("uploading", 50, `Preparando envio dos dados para o webhook...`);
    
    console.log("Starting submission with:", { 
      contentLength: content?.length || 0, 
      filesCount: uploadedFiles?.length || 0, 
      linksCount: links?.length || 0,
      webhookUrl: N8N_WEBHOOK_URL
    });

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("User not authenticated!");
      throw new Error("Você precisa estar autenticado. Por favor, faça login.");
    }
    
    // Send article data to N8N webhook
    updateProgress("uploading", 70, `Enviando dados para o webhook...`);
    
    // Enviar dados para N8N
    try {
      const response = await sendArticleToN8N(
        content, 
        articleType, 
        uploadedFiles.map(file => ({
          url: file.url,
          fileName: file.fileName,
          mimeType: file.mimeType,
          fileType: file.fileType,
          fileSize: file.fileSize
        })), 
        links
      );
      
      if (!response.success) {
        throw new Error(response.error || "Erro ao enviar dados para o webhook");
      }
    } catch (webhookError) {
      console.error("Error calling webhook:", webhookError);
      updateProgress("error", 0, `Erro ao chamar o webhook.`, webhookError.message);
      throw new Error(`Erro ao chamar o webhook: ${webhookError.message}`);
    }
    
    updateProgress("completed", 100, `Processamento concluído com sucesso! ${uploadedFiles.length} arquivo(s) enviado(s).`);

    // Add delay before transitioning
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Call success callback if provided
    if (onSuccess) {
      console.log(`Calling success callback after content was processed`);
      onSuccess();
    }

    return {
      success: true,
      status: { stage: "completed", progress: 100, message: `Processamento concluído com sucesso! ${uploadedFiles.length} arquivo(s) enviado(s).` }
    };

  } catch (error) {
    console.error(`Erro ao enviar artigo:`, error);
    
    updateProgress(
      "error", 
      0, 
      `Ocorreu um erro durante o envio.`, 
      error.message || 'Erro desconhecido'
    );
    
    return {
      success: false,
      status: { 
        stage: "error", 
        progress: 0, 
        message: `Ocorreu um erro durante o envio.`, 
        error: error.message || 'Erro desconhecido'
      }
    };
  }
};

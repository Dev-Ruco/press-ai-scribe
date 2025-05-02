
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

    // Validate files
    if (files.length > 0) {
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const fileSizeMB = Math.round(totalSize / (1024 * 1024) * 10) / 10;
      
      console.log(`Total file size: ${fileSizeMB}MB for ${files.length} files`);
      
      // Check if any individual file exceeds limit
      const maxFileSizeMB = 50;
      const oversizedFiles = files.filter(file => file.size > maxFileSizeMB * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles.map(f => f.name).join(", ");
        throw new Error(`Os seguintes arquivos excedem o limite de ${maxFileSizeMB}MB: ${fileNames}`);
      }
    }

    // Update progress before sending files
    updateProgress("uploading", 20, `Enviando arquivos para processamento...`);

    // Get article type (if available)
    const articleType = "Artigo"; // Default value
      
    // Update progress before sending files
    updateProgress("uploading", 30, `Preparando arquivos para envio...`);
    
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    if (audioFiles.length > 0) {
      updateProgress("uploading", 40, `Fazendo upload de ${audioFiles.length} arquivo(s) de áudio...`);
    }
    
    // Send everything at once to the webhook in JSON format
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

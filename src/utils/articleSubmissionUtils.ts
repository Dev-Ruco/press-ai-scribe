
import { useToast } from "@/hooks/use-toast";
import { N8N_WEBHOOK_URL } from '@/utils/webhook/types';
import { uploadFileAndGetUrl } from '@/utils/webhookUtils';
import { ProcessingStatus } from '@/types/processing';
import { supabase } from '@/integrations/supabase/client';

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

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("User not authenticated! Files will not be uploaded to Supabase storage.");
      throw new Error("Você precisa estar autenticado para enviar arquivos. Por favor, faça login.");
    }

    // Update progress before uploading files
    updateProgress("uploading", 20, `Fazendo upload dos arquivos para o armazenamento...`);

    // Process all files - upload to Supabase storage first
    const uploadedFiles = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileProgress = 20 + Math.round((i / files.length) * 30); // Progress from 20% to 50%
      
      updateProgress("uploading", fileProgress, `Fazendo upload do arquivo ${i+1}/${files.length}: ${file.name}...`);
      
      try {
        // Upload to Supabase and get public URL
        const fileUrl = await uploadFileAndGetUrl(file);
        console.log(`File uploaded successfully to Supabase: ${fileUrl}`);
        
        uploadedFiles.push({
          url: fileUrl,
          mimeType: file.type,
          nome: file.name,
          tamanho: file.size
        });
      } catch (uploadError) {
        console.error(`Error uploading file ${file.name} to Supabase:`, uploadError);
        throw new Error(`Erro ao fazer upload do arquivo ${file.name}: ${uploadError.message}`);
      }
    }

    // Check if any files were uploaded
    console.log(`Uploaded ${uploadedFiles.length} files to Supabase storage`);
    
    // After all files are uploaded, prepare to send to N8N webhook
    updateProgress("uploading", 60, `Enviando dados para processamento no N8N...`);
    
    // Get article type (if available)
    const articleType = "Artigo"; // Default value
    
    // Separate uploaded files by type
    const audiosArray = uploadedFiles.filter(file => file.mimeType.startsWith('audio/'));
    const documentsArray = uploadedFiles.filter(file => !file.mimeType.startsWith('audio/') && !file.mimeType.startsWith('image/'));
    const imagesArray = uploadedFiles.filter(file => file.mimeType.startsWith('image/'));
    
    // Prepare the payload for N8N
    const payload = {
      audios: audiosArray,
      documents: documentsArray,
      images: imagesArray,
      links: links.map(link => link.url),
      text: content,
      articleType: articleType
    };
    
    console.log('Enviando payload JSON para webhook:', payload);
    
    // Send to the webhook as JSON
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'lovable-app'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}. Detalhes: ${errorText}`);
    }
    
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

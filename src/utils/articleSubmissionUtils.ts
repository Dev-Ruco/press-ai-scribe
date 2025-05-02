
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
    updateProgress("uploading", 5, `Iniciando processamento de arquivos...`);
    
    console.log("Starting submission with:", { 
      contentLength: content?.length || 0, 
      filesCount: files?.length || 0, 
      linksCount: links?.length || 0,
      webhookUrl: N8N_WEBHOOK_URL
    });

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("User not authenticated for file uploads!");
      throw new Error("Você precisa estar autenticado para enviar arquivos. Por favor, faça login.");
    }
    
    console.log("User authenticated successfully:", session.user.id);

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

    // First, upload all files to Supabase storage
    updateProgress("uploading", 20, `Fazendo upload dos arquivos para o Supabase...`);
    
    const uploadedFiles = [];
    let successfulUploads = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileProgress = 20 + Math.round((i / files.length) * 30); // Progress from 20% to 50%
      const currentFile = i + 1;
      
      updateProgress("uploading", fileProgress, `Enviando arquivo ${currentFile}/${files.length}: ${file.name}...`);
      
      try {
        console.log(`Uploading file ${currentFile}/${files.length}: ${file.name} to Supabase...`);
        // Upload to Supabase and get public URL - This is the key part
        const fileUrl = await uploadFileAndGetUrl(file);
        successfulUploads++;
        
        console.log(`File ${file.name} uploaded successfully to Supabase: ${fileUrl}`);
        
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
    
    // Log successful uploads
    console.log(`Successfully uploaded ${successfulUploads}/${files.length} files to Supabase`);

    // Check if any files were successfully uploaded
    if (files.length > 0 && uploadedFiles.length === 0) {
      throw new Error("Nenhum arquivo foi carregado com sucesso. Verifique se você tem permissão para fazer upload.");
    }
    
    // After all files are uploaded to Supabase, prepare to send to N8N webhook
    updateProgress("uploading", 60, `Enviando dados para processamento no webhook...`);
    
    // Get article type (if available)
    const articleType = "Artigo"; // Default value
    
    // Separate uploaded files by type
    const audiosArray = uploadedFiles.filter(file => file.mimeType.startsWith('audio/'));
    const documentsArray = uploadedFiles.filter(file => !file.mimeType.startsWith('audio/') && !file.mimeType.startsWith('image/'));
    const imagesArray = uploadedFiles.filter(file => file.mimeType.startsWith('image/'));
    
    // Prepare the payload for N8N - using uploaded file URLs from Supabase
    const payload = {
      audios: audiosArray,
      documents: documentsArray,
      images: imagesArray,
      links: links.map(link => link.url),
      text: content,
      articleType: articleType
    };
    
    console.log('Enviando payload com URLs das mídias para webhook:', {
      audioCount: audiosArray.length,
      documentCount: documentsArray.length,
      imageCount: imagesArray.length,
      linkCount: links.length
    });
    
    // Send URLs and metadata to the webhook as JSON
    try {
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
        console.error(`Webhook response error: ${response.status} ${response.statusText}`, errorText);
        // Even if webhook fails, files are already uploaded to Supabase
        updateProgress("completed", 80, `Arquivos carregados com sucesso, mas ocorreu um erro ao processar via webhook.`);
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}. Os arquivos foram carregados, mas ocorreu um erro no webhook.`);
      }
      
      console.log("Webhook call successful");
    } catch (webhookError) {
      console.error("Error calling webhook:", webhookError);
      // Even if webhook fails, files are already uploaded to Supabase
      updateProgress("completed", 80, `Arquivos carregados com sucesso, mas ocorreu um erro ao chamar o webhook.`);
      throw new Error(`Erro ao chamar o webhook: ${webhookError.message}. Os arquivos foram carregados com sucesso.`);
    }
    
    updateProgress("analyzing", 80, `Processando seu conteúdo...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateProgress("completed", 100, `Processamento concluído com sucesso! ${successfulUploads} arquivo(s) carregado(s).`);

    // Add delay before transitioning
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Call success callback if provided
    if (onSuccess) {
      console.log(`Calling success callback after content was processed`);
      onSuccess();
    }

    return {
      success: true,
      status: { stage: "completed", progress: 100, message: `Processamento concluído com sucesso! ${successfulUploads} arquivo(s) carregado(s).` }
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

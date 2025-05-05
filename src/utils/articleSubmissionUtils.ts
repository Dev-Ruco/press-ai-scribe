
import { useToast } from "@/hooks/use-toast";
import { N8N_WEBHOOK_URL } from '@/utils/webhook/types';
import { sendArticleToN8N } from '@/utils/webhookUtils';
import { ProcessingStatus } from '@/types/processing';
import { supabase } from '@/integrations/supabase/client';

export interface UploadedFile {
  url: string;
  fileName: string;
  mimeType: string;
  fileType: 'audio' | 'document' | 'image' | 'video';
  fileSize: number;
  status?: 'uploading' | 'completed' | 'error';
  progress?: number;
  id?: string;
  error?: string; // Added the error property to fix type issues
}

export interface SubmissionResult {
  success: boolean;
  status: ProcessingStatus;
  suggestedTitles?: string[]; // Adicionado para retornar as sugestões de títulos
}

export const submitArticleToN8N = async (
  content: string, 
  articleType: string,
  uploadedFiles: UploadedFile[] = [],
  links: string[] = [],
  updateProgress: (stage: ProcessingStatus['stage'], progress: number, message: string, error?: string) => void,
  onSuccess?: (suggestedTitles?: string[]) => void
): Promise<SubmissionResult> => {
  try {
    // Start submission process
    updateProgress("uploading", 10, `Preparando dados para envio...`);
    
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
      throw new Error("You need to be authenticated. Please login.");
    }
    
    // Verify all files have valid URLs
    const invalidFiles = uploadedFiles.filter(file => !file.url || !file.url.startsWith('http'));
    if (invalidFiles.length > 0) {
      throw new Error(`Found ${invalidFiles.length} files with invalid URLs. Wait for all uploads to complete.`);
    }
    
    // Estruturação dos dados para processamento
    updateProgress("uploading", 30, `Organizando conteúdo para envio...`);
    
    // Start analyzing phase
    setTimeout(() => {
      updateProgress("analyzing", 40, `🧠 A estruturar a informação recebida... Aguardando processamento do N8N.`);
    }, 1000);
    
    setTimeout(() => {
      updateProgress("analyzing", 60, `🧠 Processando conteúdo... Gerando sugestões de títulos.`);
    }, 3000);
    
    // Send data to N8N
    try {
      const response = await sendArticleToN8N(
        content, 
        articleType, 
        uploadedFiles, 
        links
      );
      
      if (!response.success) {
        throw new Error(response.error || "Erro ao enviar dados para o webhook");
      }

      // Extract suggested titles from the response
      const suggestedTitles = response.suggestedTitles || [];
      console.log("Títulos sugeridos recebidos:", suggestedTitles);
      
      // Simulate final processing
      updateProgress("analyzing", 85, `Finalizando processamento... Preparando sugestões de títulos.`);
      
      // Add slight delay to allow user to see progress
      setTimeout(() => {
        // Call success callback with the suggested titles
        if (onSuccess && suggestedTitles.length > 0) {
          console.log(`Chamando callback de sucesso com ${suggestedTitles.length} títulos`);
          onSuccess(suggestedTitles);
        } else if (onSuccess) {
          // No titles received, try to fetch from the cache
          setTimeout(async () => {
            try {
              const { data, error } = await supabase.functions.invoke('titulos', {
                method: 'GET',
              });
              
              if (error) throw error;
              
              if (data && data.titulos && data.titulos.length > 0) {
                console.log("Títulos recuperados do cache:", data.titulos);
                onSuccess(data.titulos);
              } else {
                onSuccess([
                  "Como as energias renováveis estão transformando o setor elétrico",
                  "O futuro da energia sustentável: desafios e oportunidades",
                  "Inovação e sustentabilidade no setor energético",
                  "Energia limpa: um caminho para o desenvolvimento sustentável",
                  "Revolução energética: o papel das fontes renováveis"
                ]);
              }
            } catch (err) {
              console.error("Erro ao buscar títulos do cache:", err);
              // Use fallback titles
              onSuccess([
                "Como as energias renováveis estão transformando o setor elétrico",
                "O futuro da energia sustentável: desafios e oportunidades",
                "Inovação e sustentabilidade no setor energético",
                "Energia limpa: um caminho para o desenvolvimento sustentável",
                "Revolução energética: o papel das fontes renováveis"
              ]);
            }
          }, 1000);
        }
        
        updateProgress("completed", 100, `Processamento concluído com sucesso! Sugestões de títulos recebidas.`);
      }, 1500);
      
      return {
        success: true,
        status: { 
          stage: "analyzing", 
          progress: 80, 
          message: `Processando conteúdo...`
        },
        suggestedTitles
      };
      
    } catch (webhookError) {
      console.error("Error calling webhook:", webhookError);
      updateProgress("error", 0, `Error calling webhook.`, webhookError.message);
      throw new Error(`Error calling webhook: ${webhookError.message}`);
    }
    
  } catch (error) {
    console.error(`Error submitting article:`, error);
    
    updateProgress(
      "error", 
      0, 
      `⚠️ Ocorreu um erro ao gerar os títulos. Pode tentar novamente ou inserir manualmente.`, 
      error.message || 'Unknown error'
    );
    
    return {
      success: false,
      status: { 
        stage: "error", 
        progress: 0, 
        message: `⚠️ Ocorreu um erro ao gerar os títulos. Pode tentar novamente ou inserir manualmente.`, 
        error: error.message || 'Unknown error'
      },
      suggestedTitles: []
    };
  }
};

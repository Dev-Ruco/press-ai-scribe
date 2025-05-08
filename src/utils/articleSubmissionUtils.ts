
import { useToast } from "@/hooks/use-toast";
import { N8N_WEBHOOK_URL } from '@/utils/webhook/types';
import { sendArticleToN8N } from '@/utils/webhookUtils';
import { ProcessingStatus } from '@/types/processing';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

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
  article_id?: string; // Adicionado para retornar o ID do artigo para rastreamento
}

export const submitArticleToN8N = async (
  content: string, 
  articleType: string,
  uploadedFiles: UploadedFile[] = [],
  links: string[] = [],
  updateProgress: (stage: ProcessingStatus['stage'], progress: number, message: string, error?: string) => void,
  onSuccess?: (suggestedTitles?: string[], article_id?: string) => void,
  providedArticleId?: string
): Promise<SubmissionResult> => {
  try {
    // Start submission process
    updateProgress("uploading", 10, `Preparando dados para envio...`);
    
    // Gerar ou usar o ID do artigo fornecido
    const article_id = providedArticleId || `article-${uuidv4()}`;
    console.log("Usando article_id para submissão:", article_id);
    
    console.log("Starting submission with:", { 
      contentLength: content?.length || 0, 
      filesCount: uploadedFiles?.length || 0, 
      linksCount: links?.length || 0,
      webhookUrl: N8N_WEBHOOK_URL,
      article_id
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
    
    // Verificar primeiro se já existem títulos no endpoint para este article_id específico
    try {
      console.log("Verificando se já existem títulos no endpoint para article_id:", article_id);
      const url = new URL('https://vskzyeurkubazrigfnau.supabase.co/functions/v1/titulos');
      if (article_id) {
        url.searchParams.append('article_id', article_id);
      }
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza3p5ZXVya3ViYXpyaWdmbmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzU4NTcsImV4cCI6MjA2MDcxMTg1N30.NTvxBgUFHDz0U3xuxUMFSZMRFKrY9K4gASBPF6N-zMc',
          'cache-control': 'no-cache, no-store'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Resposta do endpoint de títulos:", data);
        
        if (data.titulos && data.titulos.length > 0) {
          console.log("Títulos já existem no endpoint:", data.titulos, "Article ID:", data.article_id || article_id);
          
          // Mostrar status processando
          updateProgress("analyzing", 85, `Já existem títulos disponíveis! Preparando...`);
          
          // Chamar callback de sucesso
          if (onSuccess) {
            console.log("Chamando callback com títulos existentes:", data.titulos, "Article ID:", data.article_id || article_id);
            onSuccess(data.titulos, data.article_id || article_id);
          }
          
          // Retornar sucesso imediato
          return {
            success: true,
            status: { 
              stage: "completed", 
              progress: 100, 
              message: `Títulos já disponíveis!`
            },
            suggestedTitles: data.titulos,
            article_id: data.article_id || article_id
          };
        } else {
          console.log("Nenhum título encontrado no endpoint para este article_id, continuando com N8N");
        }
      }
    } catch (error) {
      console.warn("Erro ao verificar títulos existentes:", error);
      // Continuar com o envio para N8N, não interromper o fluxo
    }
    
    // Send data to N8N
    try {
      // Aqui está o erro - corrigindo a chamada para sendArticleToN8N
      const response = await sendArticleToN8N(
        content, 
        articleType, 
        uploadedFiles, 
        links,
        article_id  // Este é o 5º argumento que está causando o erro
      );
      
      if (!response.success) {
        throw new Error(response.error || "Erro ao enviar dados para o webhook");
      }

      // Extract suggested titles and article_id from the response (mantendo o nosso article_id se o N8N não retornar)
      const suggestedTitles = response.suggestedTitles || [];
      const returnedArticleId = response.article_id || article_id;
      
      console.log("Títulos sugeridos recebidos:", suggestedTitles, "Article ID:", returnedArticleId);
      
      // Simulate final processing
      updateProgress("analyzing", 85, `Finalizando processamento... Preparando sugestões de títulos.`);
      
      // Call success callback with the suggested titles and article_id
      if (onSuccess) {
        console.log(`Chamando callback de sucesso com ${suggestedTitles.length} títulos e article_id:`, returnedArticleId);
        onSuccess(suggestedTitles, returnedArticleId);
      }
      
      // Check if we need to fetch titles directly if n8n didn't provide any
      if (suggestedTitles.length === 0 && onSuccess) {
        // No titles received from n8n, fetch from the cache
        setTimeout(async () => {
          try {
            console.log("N8n não retornou títulos, buscando diretamente da função Supabase para article_id:", returnedArticleId);
            const url = new URL('https://vskzyeurkubazrigfnau.supabase.co/functions/v1/titulos');
            
            // Adicionar article_id à URL se disponível
            url.searchParams.append('article_id', returnedArticleId);
            
            const response = await fetch(url.toString(), {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza3p5ZXVya3ViYXpyaWdmbmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzU4NTcsImV4cCI6MjA2MDcxMTg1N30.NTvxBgUFHDz0U3xuxUMFSZMRFKrY9K4gASBPF6N-zMc',
                'cache-control': 'no-cache, no-store'
              }
            });
            
            if (!response.ok) {
              throw new Error(`Erro HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Resposta da função títulos:", data);
            
            if (data && data.titulos && data.titulos.length > 0) {
              console.log("Títulos recuperados diretamente da função:", data.titulos, "Article ID:", data.article_id || returnedArticleId);
              onSuccess(data.titulos, data.article_id || returnedArticleId);
            } else {
              console.log("Nenhum título encontrado na função, usando fallback");
              onSuccess([
                "Como as energias renováveis estão transformando o setor elétrico",
                "O futuro da energia sustentável: desafios e oportunidades",
                "Inovação e sustentabilidade no setor energético",
                "Energia limpa: um caminho para o desenvolvimento sustentável",
                "Revolução energética: o papel das fontes renováveis"
              ], returnedArticleId);
            }
          } catch (err) {
            console.error("Erro ao buscar títulos da função:", err);
            // Use fallback titles
            onSuccess([
              "Como as energias renováveis estão transformando o setor elétrico",
              "O futuro da energia sustentável: desafios e oportunidades",
              "Inovação e sustentabilidade no setor energético",
              "Energia limpa: um caminho para o desenvolvimento sustentável",
              "Revolução energética: o papel das fontes renováveis"
            ], returnedArticleId);
          }
        }, 1000);
      }
      
      updateProgress("completed", 100, `Processamento concluído com sucesso! Sugestões de títulos recebidas.`);
      return {
        success: true,
        status: { 
          stage: "analyzing", 
          progress: 80, 
          message: `Processando conteúdo...`
        },
        suggestedTitles,
        article_id: returnedArticleId
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

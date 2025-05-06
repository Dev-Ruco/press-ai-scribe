
import { supabase } from "@/integrations/supabase/client";

export const N8N_WEBHOOK_URL = "https://felisberto.app.n8n.cloud/webhook-test/new-article";
export const N8N_TRANSCRIPTION_WEBHOOK_URL = "https://felisberto.app.n8n.cloud/webhook-test/new-transcription";
export const N8N_WEBHOOK_SAVE_TRANSCRIPTION_URL = "https://teu-webhook.app.n8n.cloud/webhook";

/**
 * Envia os metadados do artigo e URLs dos arquivos para o webhook N8N
 */
export async function sendArticleToN8N(
  content: string,
  articleType: string,
  fileUrls: Array<{
    url: string;
    fileName: string;
    mimeType: string;
    fileType: 'audio' | 'document' | 'image' | 'video';
    fileSize: number;
  }> = [],
  links: string[] = []
) {
  try {
    console.log("Enviando dados para N8N:", {
      fileCount: fileUrls.length,
      linkCount: links.length,
      contentLength: content.length,
      articleType
    });
    
    // Separar arquivos por tipo
    const audios = fileUrls.filter(file => file.fileType === 'audio').map(file => ({
      url: file.url,
      mimeType: file.mimeType,
      nome: file.fileName
    }));
    
    const documents = fileUrls.filter(file => file.fileType === 'document').map(file => ({
      url: file.url,
      mimeType: file.mimeType,
      nome: file.fileName
    }));
    
    const images = fileUrls.filter(file => file.fileType === 'image').map(file => ({
      url: file.url,
      mimeType: file.mimeType,
      nome: file.fileName
    }));
    
    const videos = fileUrls.filter(file => file.fileType === 'video').map(file => ({
      url: file.url,
      mimeType: file.mimeType,
      nome: file.fileName
    }));
    
    // Preparar payload para o webhook
    const payload = {
      audios,
      documents,
      images,
      videos,
      links: links.map(link => ({ url: link })),
      text: content,
      articleType
    };
    
    console.log("Enviando payload para N8N:", {
      audioCount: audios.length,
      documentCount: documents.length,
      imageCount: images.length,
      videoCount: videos.length,
      linkCount: links.length
    });
    
    // Enviar para o webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'lovable-app',
        'Cache-Control': 'no-cache, no-store'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro HTTP ${response.status}: ${errorText}`);
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }
    
    // Processar e retornar a resposta do n8n com as sugestões de títulos
    const responseData = await response.json();
    console.log("Resposta do N8N:", responseData);
    
    // Extrair as sugestões de títulos da resposta
    const suggestedTitles = responseData.suggestedTitles || [];
    
    if (suggestedTitles.length === 0) {
      console.warn("Nenhum título sugerido foi retornado pelo N8N");
      return { 
        success: false, 
        error: "Nenhum título sugerido foi retornado",
        suggestedTitles: []
      };
    }
    
    // Se houver títulos sugeridos, os enviamos diretamente para o endpoint titulos
    try {
      // Limpar títulos existentes
      await clearTitles();
      
      // Enviar os títulos sugeridos diretamente para o endpoint titulos
      console.log("Enviando títulos para o endpoint titulos:", suggestedTitles);
      
      const titulosResponse = await fetch('https://vskzyeurkubazrigfnau.supabase.co/functions/v1/titulos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza3p5ZXVya3ViYXpyaWdmbmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzU4NTcsImV4cCI6MjA2MDcxMTg1N30.NTvxBgUFHDz0U3xuxUMFSZMRFKrY9K4gASBPF6N-zMc',
          'Cache-Control': 'no-cache, no-store'
        },
        body: JSON.stringify({ titulos: suggestedTitles })
      });
      
      if (!titulosResponse.ok) {
        const errorText = await titulosResponse.text();
        console.error(`Erro ao enviar títulos para endpoint: ${titulosResponse.status}: ${errorText}`);
        throw new Error(`Erro HTTP ${titulosResponse.status}: ${errorText}`);
      }
      
      const titulosData = await titulosResponse.json();
      console.log("Resposta do endpoint titulos:", titulosData);
    } catch (titulosError) {
      console.error("Erro ao chamar função titulos:", titulosError);
      // Continue mesmo com erro no armazenamento dos títulos
      // O N8N ainda retornou títulos que podemos usar
    }
    
    console.log("Títulos sugeridos processados:", suggestedTitles);
    return { 
      success: true, 
      suggestedTitles
    };
  } catch (error) {
    console.error("Erro ao enviar para N8N:", error);
    return { 
      success: false,
      error: error.message,
      suggestedTitles: []
    };
  }
}

/**
 * Limpa os títulos existentes no endpoint
 */
export async function clearTitles() {
  try {
    console.log("Limpando títulos existentes...");
    const response = await fetch('https://vskzyeurkubazrigfnau.supabase.co/functions/v1/titulos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza3p5ZXVya3ViYXpyaWdmbmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzU4NTcsImV4cCI6MjA2MDcxMTg1N30.NTvxBgUFHDz0U3xuxUMFSZMRFKrY9K4gASBPF6N-zMc'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Títulos limpos com sucesso:", data);
    return true;
  } catch (error) {
    console.error("Erro ao limpar títulos:", error);
    return false;
  }
}

/**
 * Envia um arquivo de áudio para transcrição no webhook N8N
 */
export async function sendTranscriptionToN8N(
  audioFile: {
    url: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
  },
  transcriptionId: string
) {
  try {
    console.log("Enviando áudio para transcrição N8N:", {
      fileName: audioFile.fileName,
      mimeType: audioFile.mimeType,
      fileSize: audioFile.fileSize,
      transcriptionId
    });
    
    // Preparar payload para o webhook
    const payload = {
      audioFile: {
        url: audioFile.url,
        mimeType: audioFile.mimeType,
        name: audioFile.fileName,
        size: audioFile.fileSize
      },
      transcriptionId,
      source: 'lovable-app'
    };
    
    // Enviar para o webhook
    const response = await fetch(N8N_TRANSCRIPTION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'lovable-app'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }
    
    // Processar a resposta do n8n
    const responseData = await response.json();
    console.log("Resposta do N8N para transcrição:", responseData);
    
    return { 
      success: true, 
      data: responseData
    };
  } catch (error) {
    console.error("Erro ao enviar para N8N:", error);
    return { 
      success: false,
      error: error.message
    };
  }
}

/**
 * Envia uma transcrição finalizada para o webhook personalizado do n8n
 * @param fileName Nome do arquivo de áudio
 * @param fileUrl URL público do arquivo
 * @param mimeType Tipo MIME do arquivo
 * @param transcriptionText Texto da transcrição
 * @returns Objeto com status de sucesso e dados da resposta ou erro
 */
export async function sendTranscriptionToCustomWebhook(
  fileName: string,
  fileUrl: string,
  mimeType: string,
  transcriptionText: string
) {
  try {
    console.log("Enviando transcrição para webhook personalizado:", {
      fileName,
      mimeType,
      textLength: transcriptionText.length,
    });
    
    // Obter a sessão atual do usuário para extrair o token de acesso
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.access_token) {
      throw new Error("Usuário não autenticado ou token de acesso não disponível");
    }
    
    // Preparar payload para o webhook
    const payload = {
      ficheiro_nome: fileName,
      ficheiro_url: fileUrl,
      mime_type: mimeType,
      transcricao: transcriptionText
    };
    
    // Enviar para o webhook personalizado com o token de acesso no cabeçalho
    const response = await fetch(N8N_WEBHOOK_SAVE_TRANSCRIPTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'X-Source': 'lovable-app'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }
    
    // Processar a resposta do webhook
    const responseData = await response.json();
    console.log("Resposta do webhook personalizado:", responseData);
    
    return { 
      success: true, 
      data: responseData
    };
  } catch (error) {
    console.error("Erro ao enviar para webhook personalizado:", error);
    return { 
      success: false,
      error: error.message
    };
  }
}

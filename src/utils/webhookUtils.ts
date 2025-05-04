

import { supabase } from "@/integrations/supabase/client";

export const N8N_WEBHOOK_URL = "https://felisberto.app.n8n.cloud/webhook-test/new-article";

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
        'X-Source': 'lovable-app'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }
    
    // Processar e retornar a resposta do n8n com as sugestões de títulos
    const responseData = await response.json();
    console.log("Resposta do N8N:", responseData);
    
    // Extrair as sugestões de títulos da resposta
    const suggestedTitles = responseData.suggestedTitles || [];
    
    console.log("Títulos sugeridos recebidos:", suggestedTitles);
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

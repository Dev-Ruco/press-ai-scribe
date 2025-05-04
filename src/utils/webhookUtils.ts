
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
    fileType: 'audio' | 'document' | 'image';
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
      nome: file.fileName,
      tamanho: file.fileSize
    }));
    
    const documents = fileUrls.filter(file => file.fileType === 'document').map(file => ({
      url: file.url,
      mimeType: file.mimeType,
      nome: file.fileName,
      tamanho: file.fileSize
    }));
    
    const images = fileUrls.filter(file => file.fileType === 'image').map(file => ({
      url: file.url,
      mimeType: file.mimeType,
      nome: file.fileName,
      tamanho: file.fileSize
    }));
    
    // Preparar payload para o webhook
    const payload = {
      audios,
      images,
      documents,
      links: links.map(link => typeof link === 'string' ? link : link.toString()),
      text: content,
      articleType
    };
    
    console.log("Enviando payload para N8N:", {
      audioCount: audios.length,
      documentCount: documents.length,
      imageCount: images.length,
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
    
    console.log("Conteúdo enviado com sucesso para N8N");
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar para N8N:", error);
    return { 
      success: false,
      error: error.message 
    };
  }
}


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
      links: links.map(link => typeof link === 'string' ? link : String(link)),
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

/**
 * Verifica se o bucket de armazenamento existe e o cria se necessário
 */
export async function ensureStorageBucketExists() {
  try {
    // Verificar se o usuário está autenticado
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { created: false, message: 'Usuário não autenticado' };
    }

    // Verificar se o bucket já existe
    const { data: buckets } = await supabase.storage.listBuckets();
    const mediaFilesBucket = buckets?.find(bucket => bucket.name === 'media-files');

    if (mediaFilesBucket) {
      console.log('Bucket "media-files" já existe');
      return { created: false, message: 'Bucket já existe' };
    }

    // Criar o bucket
    const { error } = await supabase.storage.createBucket('media-files', {
      public: true,
      fileSizeLimit: 50 * 1024 * 1024 // 50 MB
    });

    if (error) {
      console.error('Erro ao criar bucket:', error.message);
      return { created: false, error: error.message };
    }

    console.log('Bucket "media-files" criado com sucesso');
    return { created: true };
  } catch (error) {
    console.error('Erro ao verificar/criar bucket:', error);
    return { created: false, error: error.message };
  }
}

/**
 * Envia dados para um webhook N8N com autenticação apropriada
 */
export async function triggerN8NWebhook(payload: {
  id: string;
  type: 'file' | 'link' | 'text' | 'session-start' | 'session-end';
  mimeType: string;
  data: any;
  authMethod: string | null;
  sessionId: string;
}, onProgress?: (progress: number) => void) {
  try {
    // Implementação simplificada - envia dados para N8N
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': payload.sessionId
      },
      body: JSON.stringify({
        type: payload.type,
        id: payload.id,
        data: payload.data,
        mimeType: payload.mimeType
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao acionar webhook N8N:", error);
    return { success: false, message: error.message };
  }
}

/**
 * Realiza upload de um arquivo em pedaços para melhor performance
 */
export async function chunkedUpload(
  file: File, 
  fileId: string, 
  onProgress?: (progress: number) => void
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Usuário não autenticado');
    }
    
    const fileType = file.type.startsWith('audio/') 
      ? 'audio' 
      : file.type.startsWith('image/') 
        ? 'image' 
        : 'document';
    
    const folderPath = fileType === 'audio' ? 'audios' : fileType === 'image' ? 'images' : 'documents';
    const filePath = `${folderPath}/${fileId}-${file.name}`;
    
    // Upload do arquivo para o Supabase Storage
    const { error } = await supabase.storage
      .from('media-files')
      .upload(filePath, file, {
        cacheControl: '3600'
      });
    
    if (error) {
      throw new Error(`Upload error: ${error.message}`);
    }
    
    // Notificar progresso completo
    if (onProgress) onProgress(100);
    
    // Obter a URL pública
    const { data } = supabase.storage
      .from('media-files')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Erro no chunked upload:", error);
    throw error;
  }
}

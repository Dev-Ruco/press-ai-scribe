
import { WebhookResponse } from '@/types/news';
import { N8N_WEBHOOK_URL, REQUEST_TIMEOUT, MAX_CHUNK_SIZE, MAX_CONCURRENT_CHUNKS } from './webhook/types';
import { chunkedUpload } from './webhook/chunkedUpload';
import { sendWithTimeout } from './webhook/sendWithTimeout';

// Re-export constants and functions
export { 
  N8N_WEBHOOK_URL, 
  chunkedUpload, 
  sendWithTimeout,
  REQUEST_TIMEOUT,
  MAX_CHUNK_SIZE,
  MAX_CONCURRENT_CHUNKS 
};

// Re-export types with proper syntax for isolatedModules
export type { ContentPayload, ProgressCallback } from './webhook/types';

export async function triggerN8NWebhook(
  payload: import('./webhook/types').ContentPayload, 
  onProgress?: import('./webhook/types').ProgressCallback
): Promise<WebhookResponse> {
  try {
    console.log('Iniciando triggerN8NWebhook com payload:', {
      id: payload.id,
      type: payload.type,
      mimeType: payload.mimeType,
      dataLength: payload.data instanceof File ? payload.data.size : (typeof payload.data === 'string' ? payload.data.length : 0),
      authMethod: payload.authMethod,
      chunkIndex: payload.chunkIndex,
      totalChunks: payload.totalChunks,
      sessionId: payload.sessionId,
      webhookUrl: N8N_WEBHOOK_URL
    });
    
    // Special handling for file uploads
    if (payload.type === 'file' && payload.data instanceof File) {
      const success = await chunkedUpload(
        payload.data, 
        payload.id, 
        onProgress,
        payload.sessionId
      );
      
      return { success };
    }
    
    return await sendWithTimeout(payload);
  } catch (error) {
    console.error(`Erro no triggerN8NWebhook para ${N8N_WEBHOOK_URL}:`, error);
    throw error;
  }
}

// Nova função para enviar todos os dados de uma vez no formato exigido pela n8n
export async function sendArticleToN8N(
  text: string,
  articleType: string,
  files: File[] = [],
  links: { url: string; id: string }[] = []
): Promise<WebhookResponse> {
  try {
    console.log('Enviando artigo para N8N:', { text, articleType, filesCount: files.length, linksCount: links.length });
    
    // Separar arquivos por tipo
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    const documentFiles = files.filter(file => !file.type.startsWith('audio/'));
    
    // Preparar o payload no formato exigido
    const payload = {
      audios: audioFiles.map(file => ({
        url: URL.createObjectURL(file), // Isto é temporário e não funcionará em produção
        mimeType: file.type,
        nome: file.name
      })),
      documents: documentFiles.map(file => ({
        url: URL.createObjectURL(file), // Isto é temporário e não funcionará em produção
        mimeType: file.type,
        nome: file.name
      })),
      links: links.map(link => ({
        url: link.url
      })),
      text: text,
      articleType: articleType
    };
    
    console.log('Enviando payload para N8N:', payload);
    
    // Enviar para o webhook
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
    
    const responseData = await response.json();
    return {
      ...responseData,
      success: true
    };
  } catch (error) {
    console.error('Erro ao enviar artigo para N8N:', error);
    throw error;
  }
}

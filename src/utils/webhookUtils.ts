
import { WebhookResponse } from '@/types/news';
import { ContentPayload, N8N_WEBHOOK_URL, ProgressCallback } from './webhook/types';
import { chunkedUpload } from './webhook/chunkedUpload';
import { sendWithTimeout } from './webhook/sendWithTimeout';

export { 
  ContentPayload, 
  N8N_WEBHOOK_URL, 
  chunkedUpload, 
  sendWithTimeout 
};

export async function triggerN8NWebhook(
  payload: ContentPayload, 
  onProgress?: ProgressCallback
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

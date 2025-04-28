import { WebhookResponse } from '@/types/news';
import { useToast } from "@/hooks/use-toast";

export interface ContentPayload {
  id: string;
  type: 'file' | 'link' | 'text';
  mimeType: string;
  data: string;
  authMethod: string | null;
  credentials?: {
    username: string;
    password: string;
  };
  chunkIndex?: number;
  totalChunks?: number;
  fileId?: string;
  fileName?: string;
  fileSize?: number;
}

export const N8N_WEBHOOK_URL = 'https://felisberto.app.n8n.cloud/webhook-test/2c9b841f-82db-42ca-b734-c3266b2083fb';

// Maximum size for a single chunk in bytes (3MB)
export const MAX_CHUNK_SIZE = 3 * 1024 * 1024;

export const chunkedUpload = async (file: File, fileId: string): Promise<boolean> => {
  try {
    console.log(`Iniciando upload em chunks para arquivo: ${file.name} (${file.size} bytes)`);
    
    const chunkSize = MAX_CHUNK_SIZE;
    const totalChunks = Math.ceil(file.size / chunkSize);
    const chunks: { index: number; data: string }[] = [];
    
    // Read file in chunks
    for (let index = 0; index < totalChunks; index++) {
      const start = index * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      const arrayBuffer = await chunk.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64Data = btoa(
        Array.from(uint8Array)
          .map(byte => String.fromCharCode(byte))
          .join('')
      );
      
      chunks.push({ index, data: base64Data });
    }
    
    // Send chunks with retry logic
    const sendChunkWithRetry = async (chunk: { index: number; data: string }, attempts = 3) => {
      try {
        const chunkPayload: ContentPayload = {
          id: `${fileId}-chunk-${chunk.index}`,
          fileId: fileId,
          type: 'file',
          mimeType: file.type || 'application/octet-stream',
          data: chunk.data,
          authMethod: null,
          chunkIndex: chunk.index,
          totalChunks: totalChunks,
          fileName: file.name,
          fileSize: file.size
        };
        
        await triggerN8NWebhook(chunkPayload);
        console.log(`Chunk ${chunk.index + 1}/${totalChunks} enviado com sucesso`);
      } catch (error) {
        if (attempts > 1) {
          console.log(`Retrying chunk ${chunk.index}, attempts left: ${attempts - 1}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return sendChunkWithRetry(chunk, attempts - 1);
        }
        throw error;
      }
    };
    
    // Process chunks in parallel with a limit of 3 concurrent uploads
    const concurrentLimit = 3;
    for (let i = 0; i < chunks.length; i += concurrentLimit) {
      const batch = chunks.slice(i, i + concurrentLimit);
      await Promise.all(batch.map(chunk => sendChunkWithRetry(chunk)));
    }
    
    console.log(`Upload em chunks completo para ${file.name}`);
    return true;
  } catch (error) {
    console.error('Erro no chunkedUpload:', error);
    throw error;
  }
};

export async function triggerN8NWebhook(payload: ContentPayload): Promise<WebhookResponse> {
  try {
    console.log('Iniciando triggerN8NWebhook com payload:', {
      id: payload.id,
      type: payload.type,
      mimeType: payload.mimeType,
      dataLength: payload.data ? payload.data.length : 0,
      authMethod: payload.authMethod,
      chunkIndex: payload.chunkIndex,
      totalChunks: payload.totalChunks
    });
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Erro na resposta do webhook:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Webhook executado com sucesso:', response.status, data);
    return data;
  } catch (error) {
    console.error('Erro no triggerN8NWebhook:', error);
    throw error;
  }
}

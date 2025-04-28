
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
// Maximum concurrent chunks to process per file
export const MAX_CONCURRENT_CHUNKS = 3;
// Timeout for webhook requests in milliseconds
export const REQUEST_TIMEOUT = 30000; // 30 seconds

export const chunkedUpload = async (
  file: File, 
  fileId: string,
  onProgress?: (progress: number) => void
): Promise<boolean> => {
  try {
    console.log(`Iniciando upload em chunks para arquivo: ${file.name} (${file.size} bytes)`);
    
    const chunkSize = MAX_CHUNK_SIZE;
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    // Function to read and process a single chunk
    const processChunk = async (index: number, maxRetries = 3): Promise<boolean> => {
      try {
        const start = index * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        
        console.log(`Processando chunk ${index + 1}/${totalChunks} para ${file.name} (${start}-${end})`);
        
        const arrayBuffer = await chunk.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const base64Data = btoa(
          Array.from(uint8Array)
            .map(byte => String.fromCharCode(byte))
            .join('')
        );
        
        const chunkPayload: ContentPayload = {
          id: `${fileId}-chunk-${index}`,
          fileId: fileId,
          type: 'file',
          mimeType: file.type || 'application/octet-stream',
          data: base64Data,
          authMethod: null,
          chunkIndex: index,
          totalChunks: totalChunks,
          fileName: file.name,
          fileSize: file.size
        };
        
        await sendWithTimeout(chunkPayload, REQUEST_TIMEOUT);
        console.log(`Chunk ${index + 1}/${totalChunks} enviado com sucesso`);
        
        return true;
      } catch (error) {
        console.error(`Erro ao processar chunk ${index} para arquivo ${file.name}:`, error);
        
        if (maxRetries > 0) {
          console.log(`Tentativa ${4 - maxRetries} de 3: Retrying chunk ${index}`);
          // Exponential backoff for retries
          const delay = 1000 * Math.pow(2, 3 - maxRetries);
          await new Promise(resolve => setTimeout(resolve, delay));
          return processChunk(index, maxRetries - 1);
        }
        
        throw new Error(`Falha ao fazer upload do chunk ${index} após várias tentativas`);
      }
    };
    
    // Process chunks in parallel with a concurrency limit
    // and report progress as we go
    let processedChunks = 0;
    const chunkIndices = Array.from({ length: totalChunks }, (_, i) => i);
    
    // Process chunks in sequential batches with internal parallelism
    for (let i = 0; i < totalChunks; i += MAX_CONCURRENT_CHUNKS) {
      const batchIndices = chunkIndices.slice(i, i + MAX_CONCURRENT_CHUNKS);
      
      await Promise.all(
        batchIndices.map(async (chunkIndex) => {
          const result = await processChunk(chunkIndex);
          
          if (result) {
            processedChunks++;
            if (onProgress) {
              onProgress(Math.round((processedChunks / totalChunks) * 100));
            }
          }
          
          return result;
        })
      );
    }
    
    console.log(`Upload em chunks completo para ${file.name}`);
    return true;
  } catch (error) {
    console.error('Erro no chunkedUpload:', error);
    throw error;
  }
};

// Helper function to send with timeout
const sendWithTimeout = async (payload: ContentPayload, timeout: number): Promise<WebhookResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
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
    
    return await sendWithTimeout(payload, REQUEST_TIMEOUT);
  } catch (error) {
    console.error('Erro no triggerN8NWebhook:', error);
    throw error;
  }
}

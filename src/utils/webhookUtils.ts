
import { WebhookResponse } from '@/types/news';
import { useToast } from "@/hooks/use-toast";

export interface ContentPayload {
  id: string;
  type: 'file' | 'link' | 'text' | 'session-start' | 'session-end';
  mimeType: string;
  data: string | File;
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
  sessionId?: string; // Added session ID for grouping related uploads
}

// Define the webhook URL as a constant that can be used throughout the application
export const N8N_WEBHOOK_URL = 'https://felisberto.app.n8n.cloud/webhook-test/new-article';

// Maximum size for a single chunk in bytes (3MB)
export const MAX_CHUNK_SIZE = 3 * 1024 * 1024;
// Maximum concurrent chunks to process per file
export const MAX_CONCURRENT_CHUNKS = 3;
// Timeout for webhook requests in milliseconds
export const REQUEST_TIMEOUT = 30000; // 30 seconds

export interface ProgressCallback {
  (progress: number): void;
}

export const chunkedUpload = async (
  file: File, 
  fileId: string,
  onProgress?: ProgressCallback,
  sessionId?: string
): Promise<boolean> => {
  try {
    console.log(`Iniciando upload em chunks para arquivo: ${file.name} (${file.size} bytes)`);
    console.log(`Usando webhook URL: ${N8N_WEBHOOK_URL}`);
    
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
          fileSize: file.size,
          sessionId: sessionId // Add session ID to each chunk
        };
        
        await sendWithTimeout(chunkPayload, REQUEST_TIMEOUT);
        console.log(`Chunk ${index + 1}/${totalChunks} enviado com sucesso para ${N8N_WEBHOOK_URL}`);
        
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
    console.log(`Enviando requisição para ${N8N_WEBHOOK_URL} com tipo de conteúdo: ${payload.type}`);
    
    // Handle file uploads differently
    if (payload.type === 'file' && payload.data instanceof File) {
      // Use chunked upload for files
      await chunkedUpload(payload.data, payload.id, undefined, payload.sessionId);
      clearTimeout(timeoutId);
      return { success: true };
    }
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': payload.sessionId || '' // Add session ID as header too
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro HTTP ${response.status}: ${response.statusText}`, errorText);
      throw new Error(`HTTP error ${response.status}: ${response.statusText}. Details: ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log(`Resposta recebida do webhook: ${JSON.stringify(responseData)}`);
    
    // Ensure the response conforms to our WebhookResponse interface
    return {
      ...responseData,
      success: responseData.success ?? true,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('Request timed out while connecting to', N8N_WEBHOOK_URL);
      throw new Error(`Request timed out while connecting to ${N8N_WEBHOOK_URL}`);
    }
    console.error('Erro no sendWithTimeout:', error);
    throw error;
  }
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
    
    return await sendWithTimeout(payload, REQUEST_TIMEOUT);
  } catch (error) {
    console.error('Erro no triggerN8NWebhook:', error);
    throw error;
  }
}

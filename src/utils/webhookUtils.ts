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

// New function to chunk and send large files
export async function chunkedUpload(file: File, fileId: string): Promise<boolean> {
  try {
    console.log(`Iniciando upload em chunks para arquivo: ${file.name} (${file.size} bytes)`);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const chunks: Uint8Array[] = [];
      const chunkSize = MAX_CHUNK_SIZE;
      let offset = 0;
      
      const readNextChunk = () => {
        const slice = file.slice(offset, offset + chunkSize);
        reader.readAsArrayBuffer(slice);
      };
      
      reader.onload = async (e) => {
        if (e.target?.result) {
          const chunk = new Uint8Array(e.target.result as ArrayBuffer);
          chunks.push(chunk);
          
          offset += chunk.length;
          console.log(`Chunk lido: ${chunk.length} bytes, Progresso: ${Math.round((offset / file.size) * 100)}%`);
          
          if (offset < file.size) {
            // Continue reading
            readNextChunk();
          } else {
            // All chunks read, now send them
            console.log(`Leitura completa: ${chunks.length} chunks totalizando ${offset} bytes`);
            
            try {
              for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                const base64Data = btoa(
                  Array.from(chunk)
                    .map(byte => String.fromCharCode(byte))
                    .join('')
                );
                
                const chunkPayload: ContentPayload = {
                  id: `${fileId}-chunk-${i}`,
                  fileId: fileId,
                  type: 'file',
                  mimeType: file.type || 'application/octet-stream',
                  data: base64Data,
                  authMethod: null,
                  chunkIndex: i,
                  totalChunks: chunks.length,
                  fileName: file.name,
                  fileSize: file.size
                };
                
                console.log(`Enviando chunk ${i + 1}/${chunks.length} (${chunk.length} bytes)`);
                await triggerN8NWebhook(chunkPayload);
                console.log(`Chunk ${i + 1}/${chunks.length} enviado com sucesso`);
              }
              
              console.log(`Upload em chunks completo para ${file.name}`);
              resolve(true);
            } catch (error) {
              console.error('Erro ao enviar chunks:', error);
              reject(error);
            }
          }
        }
      };
      
      reader.onerror = (error) => {
        console.error('Erro na leitura do arquivo:', error);
        reject(error);
      };
      
      // Start reading the first chunk
      readNextChunk();
    });
  } catch (error) {
    console.error('Erro no chunkedUpload:', error);
    return false;
  }
}

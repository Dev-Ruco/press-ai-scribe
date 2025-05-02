
import { ContentPayload, MAX_CHUNK_SIZE, MAX_CONCURRENT_CHUNKS, N8N_WEBHOOK_URL, ProgressCallback } from './types';
import { sendWithTimeout } from './sendWithTimeout';

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
          type: 'file',
          mimeType: file.type || 'application/octet-stream',
          data: base64Data,
          authMethod: null,
          chunkIndex: index,
          totalChunks: totalChunks,
          fileName: file.name,
          fileSize: file.size,
          sessionId: sessionId,
          fileId: fileId
        };
        
        await sendWithTimeout(chunkPayload);
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
    
    console.log(`Upload em chunks completo para ${file.name} via ${N8N_WEBHOOK_URL}`);
    return true;
  } catch (error) {
    console.error(`Erro no chunkedUpload via ${N8N_WEBHOOK_URL}:`, error);
    throw error;
  }
};

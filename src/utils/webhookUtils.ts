
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

// Função para carregar arquivo para o servidor e obter URL pública
async function uploadFileAndGetUrl(file: File): Promise<string> {
  try {
    // Implementação simulada - em um ambiente real, você precisaria 
    // carregar o arquivo para seu próprio servidor ou serviço de armazenamento
    // e retornar a URL pública
    
    // Por enquanto, vamos simular que o arquivo foi carregado e retornar um URL fictício
    const mockUrl = `https://storage.example.com/${file.name}`;
    console.log(`Simulando upload do arquivo ${file.name}, URL gerada: ${mockUrl}`);
    
    // Aguardar um curto período para simular o tempo de upload
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockUrl;
  } catch (error) {
    console.error(`Erro ao fazer upload do arquivo ${file.name}:`, error);
    throw new Error(`Falha ao fazer upload do arquivo ${file.name}`);
  }
}

// Função para enviar todos os dados no formato JSON exigido pela n8n
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
    
    console.log(`Processando ${audioFiles.length} arquivos de áudio e ${documentFiles.length} documentos`);
    
    // Arrays para armazenar as informações processadas
    const audiosArray = [];
    const documentsArray = [];
    
    // Processar arquivos de áudio (em um cenário real, faça upload para obter URLs)
    for (const audioFile of audioFiles) {
      try {
        // Aqui seria feito o upload real do arquivo para obter uma URL pública
        const audioUrl = await uploadFileAndGetUrl(audioFile);
        
        audiosArray.push({
          url: audioUrl,
          mimeType: audioFile.type,
          nome: audioFile.name
        });
      } catch (err) {
        console.error(`Erro ao processar arquivo de áudio ${audioFile.name}:`, err);
      }
    }
    
    // Processar documentos (em um cenário real, faça upload para obter URLs)
    for (const docFile of documentFiles) {
      try {
        // Aqui seria feito o upload real do arquivo para obter uma URL pública
        const docUrl = await uploadFileAndGetUrl(docFile);
        
        documentsArray.push({
          url: docUrl,
          mimeType: docFile.type,
          nome: docFile.name
        });
      } catch (err) {
        console.error(`Erro ao processar documento ${docFile.name}:`, err);
      }
    }
    
    // Preparar o payload final no formato JSON exigido
    const payload = {
      audios: audiosArray,
      documents: documentsArray,
      links: links.map(link => link.url),  // Converter para array de strings
      text: text,
      articleType: articleType
    };
    
    console.log('Enviando payload JSON para webhook:', payload);
    
    // Enviar para o webhook como JSON
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
    console.log('Resposta recebida do webhook:', responseData);
    
    return {
      ...responseData,
      success: true
    };
  } catch (error) {
    console.error('Erro ao enviar artigo para N8N:', error);
    throw error;
  }
}

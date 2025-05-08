
// Verificando os argumentos aceitos pela função sendArticleToN8N
import { N8N_WEBHOOK_URL, N8N_TRANSCRIPTION_WEBHOOK_URL, N8N_WEBHOOK_SAVE_TRANSCRIPTION_URL, REQUEST_TIMEOUT } from './webhook/types';
import { UploadedFile } from './articleSubmissionUtils';

/**
 * Envia os dados do artigo para o webhook do N8N
 */
export const sendArticleToN8N = async (
  content: string,
  articleType: string, 
  files: UploadedFile[] = [],
  links: string[] = [],
  article_id?: string
) => {
  try {
    console.log(`Enviando dados para o webhook N8N: ${N8N_WEBHOOK_URL}`);
    console.log(`Conteúdo: ${content.substring(0, 50)}...`);
    console.log(`Tipo: ${articleType}`);
    console.log(`Número de arquivos: ${files.length}`);
    console.log(`Número de links: ${links.length}`);
    console.log(`Article ID: ${article_id || 'não fornecido'}`);

    // Preparação dos dados para envio
    const payload = {
      content,
      articleType,
      files: files.map(file => ({
        url: file.url,
        fileName: file.fileName,
        mimeType: file.mimeType,
        fileType: file.fileType,
        fileSize: file.fileSize
      })),
      links,
      article_id
    };

    // Envio para o webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na resposta do webhook: ${response.status}`, errorText);
      return {
        success: false,
        error: `Falha na chamada do webhook: ${response.status} ${response.statusText}`,
      };
    }

    try {
      const responseData = await response.json();
      console.log("Resposta do webhook:", responseData);
      
      return {
        success: true,
        ...responseData,
      };
    } catch (e) {
      // Se a resposta não for JSON válido, ainda consideramos como sucesso
      console.log("Resposta do webhook não é JSON válido, mas o status é OK");
      return {
        success: true,
        message: "Requisição enviada com sucesso"
      };
    }
  } catch (error) {
    console.error("Erro ao enviar para webhook:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar para webhook",
    };
  }
};

/**
 * Envia uma transcrição para o webhook do N8N
 * @param file Informações do arquivo de áudio
 * @param transcriptionId ID da transcrição
 * @returns Resultado da operação
 */
export const sendTranscriptionToN8N = async (
  file: { url: string; fileName: string; mimeType: string; fileSize?: number },
  transcriptionId: string
) => {
  try {
    console.log("==========================================");
    console.log(`INICIANDO ENVIO DE TRANSCRIÇÃO PARA N8N`);
    console.log(`ID da transcrição: ${transcriptionId}`);
    console.log(`Nome do arquivo: ${file.fileName}`);
    console.log(`URL do arquivo: ${file.url}`);
    console.log(`Tipo MIME: ${file.mimeType}`);
    console.log(`Tamanho do arquivo: ${file.fileSize || 'não especificado'}`);
    console.log(`Webhook URL: ${N8N_TRANSCRIPTION_WEBHOOK_URL}`);
    console.log("==========================================");
    
    // Verificar URL do arquivo
    try {
      const fileCheckResponse = await fetch(file.url, { method: 'HEAD' });
      console.log(`Verificação de disponibilidade do arquivo: ${fileCheckResponse.status} ${fileCheckResponse.statusText}`);
    } catch (error) {
      console.warn(`Não foi possível verificar a disponibilidade do arquivo: ${error.message}`);
    }
    
    // Preparar payload
    const payload = {
      file: {
        url: file.url,
        fileName: file.fileName,
        mimeType: file.mimeType,
        fileSize: file.fileSize || 0
      },
      transcription_id: transcriptionId,
      action: 'process_transcription',
      timestamp: new Date().toISOString()
    };
    
    console.log(`Payload para N8N: ${JSON.stringify(payload, null, 2)}`);
    
    // Configurar timeout para a requisição
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    // Enviar para o webhook
    console.log(`Enviando requisição para: ${N8N_TRANSCRIPTION_WEBHOOK_URL}`);
    const response = await fetch(N8N_TRANSCRIPTION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Source': 'lovable-app'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log(`Resposta do N8N: Status ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ERRO NA RESPOSTA DO N8N: ${response.status}`, errorText);
      return {
        success: false,
        error: `Falha ao enviar transcrição: ${response.status} ${response.statusText}. Detalhes: ${errorText}`
      };
    }
    
    try {
      const data = await response.json();
      console.log("Resposta do webhook de transcrição (JSON):", data);
      console.log("==========================================");
      return {
        success: true,
        ...data
      };
    } catch (e) {
      const responseText = await response.text();
      console.log("Resposta do webhook não é JSON válido, mas o status é OK");
      console.log(`Resposta em texto: ${responseText}`);
      console.log("==========================================");
      return {
        success: true,
        message: "Transcrição enviada para processamento",
        responseText
      };
    }
  } catch (error) {
    console.error("ERRO CRÍTICO AO ENVIAR TRANSCRIÇÃO:", error);
    if (error.name === 'AbortError') {
      console.error(`Requisição para ${N8N_TRANSCRIPTION_WEBHOOK_URL} atingiu o timeout de ${REQUEST_TIMEOUT/1000} segundos`);
    }
    console.log("==========================================");
    return {
      success: false,
      error: error.message || "Erro ao enviar transcrição para processamento"
    };
  }
};

/**
 * Envia uma transcrição salva para o webhook personalizado
 */
export const sendTranscriptionToCustomWebhook = async (
  fileName: string,
  fileUrl: string,
  mimeType: string,
  transcriptionText: string
) => {
  try {
    console.log("==========================================");
    console.log(`INICIANDO ENVIO DE TRANSCRIÇÃO SALVA`);
    console.log(`Nome do arquivo: ${fileName}`);
    console.log(`URL do arquivo: ${fileUrl}`);
    console.log(`Tipo MIME: ${mimeType}`);
    console.log(`Tamanho do texto: ${transcriptionText.length} caracteres`);
    console.log(`Webhook URL: ${N8N_WEBHOOK_SAVE_TRANSCRIPTION_URL}`);
    console.log("==========================================");
    
    // Payload para o webhook
    const payload = {
      transcription: {
        fileName,
        fileUrl,
        mimeType,
        content: transcriptionText,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log(`Payload para webhook personalizado: ${JSON.stringify(payload, null, 2)}`);
    
    // Configurar timeout para a requisição
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    // Enviar para o webhook
    console.log(`Enviando requisição para: ${N8N_WEBHOOK_SAVE_TRANSCRIPTION_URL}`);
    const response = await fetch(N8N_WEBHOOK_SAVE_TRANSCRIPTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Source': 'lovable-app'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log(`Resposta do webhook personalizado: Status ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ERRO NA RESPOSTA DO WEBHOOK PERSONALIZADO: ${response.status}`, errorText);
      return {
        success: false,
        error: `Falha ao enviar transcrição salva: ${response.status} ${response.statusText}. Detalhes: ${errorText}`
      };
    }
    
    try {
      const data = await response.json();
      console.log("Resposta do webhook personalizado (JSON):", data);
      console.log("==========================================");
      return {
        success: true,
        ...data
      };
    } catch (e) {
      const responseText = await response.text();
      console.log("Resposta do webhook personalizado não é JSON válido, mas o status é OK");
      console.log(`Resposta em texto: ${responseText}`);
      console.log("==========================================");
      return {
        success: true,
        message: "Transcrição salva enviada com sucesso",
        responseText
      };
    }
  } catch (error) {
    console.error("ERRO CRÍTICO AO ENVIAR TRANSCRIÇÃO SALVA:", error);
    if (error.name === 'AbortError') {
      console.error(`Requisição para ${N8N_WEBHOOK_SAVE_TRANSCRIPTION_URL} atingiu o timeout de ${REQUEST_TIMEOUT/1000} segundos`);
    }
    console.log("==========================================");
    return {
      success: false,
      error: error.message || "Erro ao enviar transcrição salva"
    };
  }
};

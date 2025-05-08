
// Verificando os argumentos aceitos pela função sendArticleToN8N
import { N8N_WEBHOOK_URL } from './webhook/types';
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
    console.log(`Enviando transcrição para processamento: ${transcriptionId}`);
    console.log(`Arquivo: ${file.fileName}, URL: ${file.url}`);
    
    // Preparar payload
    const payload = {
      file: {
        url: file.url,
        fileName: file.fileName,
        mimeType: file.mimeType,
        fileSize: file.fileSize || 0
      },
      transcription_id: transcriptionId,
      action: 'process_transcription'
    };
    
    // Enviar para o webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na resposta do webhook de transcrição: ${response.status}`, errorText);
      return {
        success: false,
        error: `Falha ao enviar transcrição: ${response.status} ${response.statusText}`
      };
    }
    
    try {
      const data = await response.json();
      console.log("Resposta do webhook de transcrição:", data);
      return {
        success: true,
        ...data
      };
    } catch (e) {
      return {
        success: true,
        message: "Transcrição enviada para processamento"
      };
    }
  } catch (error) {
    console.error("Erro ao enviar transcrição:", error);
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
    console.log(`Enviando transcrição salva para webhook: ${fileName}`);
    
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
    
    // Enviar para o webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na resposta do webhook: ${response.status}`, errorText);
      return {
        success: false,
        error: `Falha ao enviar transcrição salva: ${response.status} ${response.statusText}`
      };
    }
    
    try {
      const data = await response.json();
      console.log("Resposta do webhook:", data);
      return {
        success: true,
        ...data
      };
    } catch (e) {
      return {
        success: true,
        message: "Transcrição salva enviada com sucesso"
      };
    }
  } catch (error) {
    console.error("Erro ao enviar transcrição salva:", error);
    return {
      success: false,
      error: error.message || "Erro ao enviar transcrição salva"
    };
  }
};

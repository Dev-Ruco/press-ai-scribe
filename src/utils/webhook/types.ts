
export interface WebhookResponse {
  success: boolean;
  message?: string;
  data?: any;
  responseText?: string;
}

export interface ContentPayload {
  id: string;
  type: 'text' | 'file' | 'link' | 'session-start' | 'session-end';
  mimeType?: string;
  data: string | File;
  authMethod?: 'none' | 'session' | 'basic' | 'apikey' | 'oauth2' | 'form' | null;
  chunkIndex?: number;
  totalChunks?: number;
  sessionId?: string;
  fileId?: string;
  fileName?: string;
  fileSize?: number;
  credentials?: {
    username?: string;
    password?: string;
    [key: string]: string | undefined;
  };
}

export type ProgressCallback = (progress: number) => void;

// Atualizando para a URL do webhook de produção
export const N8N_WEBHOOK_URL = "https://felisberto.app.n8n.cloud/webhook/new-article";
export const N8N_TRANSCRIPTION_WEBHOOK_URL = "https://felisberto.app.n8n.cloud/webhook/new-transcription";
export const N8N_WEBHOOK_SAVE_TRANSCRIPTION_URL = "https://teu-webhook.app.n8n.cloud/webhook";

export const REQUEST_TIMEOUT = 30000; // Timeout de 30 segundos

export const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

export const MAX_CONCURRENT_CHUNKS = 3;

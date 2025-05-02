export interface WebhookResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface ContentPayload {
  id: string;
  type: 'text' | 'file';
  mimeType?: string;
  data: string | File;
  authMethod?: 'none' | 'session';
  chunkIndex?: number;
  totalChunks?: number;
  sessionId?: string;
}

export type ProgressCallback = (progress: number) => void;

// URL do webhook para onde os dados serão enviados
export const N8N_WEBHOOK_URL = "https://felisberto.app.n8n.cloud/webhook-test/new-article";

export const REQUEST_TIMEOUT = 30000; // Timeout de 30 segundos

export const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

export const MAX_CONCURRENT_CHUNKS = 3;

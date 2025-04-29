
import { WebhookResponse } from '@/types/news';

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
  sessionId?: string;
}

// Maximum size for a single chunk in bytes (3MB)
export const MAX_CHUNK_SIZE = 3 * 1024 * 1024;
// Maximum concurrent chunks to process per file
export const MAX_CONCURRENT_CHUNKS = 3;
// Timeout for webhook requests in milliseconds
export const REQUEST_TIMEOUT = 30000; // 30 seconds

export interface ProgressCallback {
  (progress: number): void;
}

// Define the webhook URL as a constant that can be used throughout the application
export const N8N_WEBHOOK_URL = 'https://felisberto.app.n8n.cloud/webhook-test/new-article';

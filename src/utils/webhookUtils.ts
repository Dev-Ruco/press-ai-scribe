
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
}

export const N8N_WEBHOOK_URL = 'https://felisberto.app.n8n.cloud/webhook-test/2c9b841f-82db-42ca-b734-c3266b2083fb';

export async function triggerN8NWebhook(payload: ContentPayload): Promise<WebhookResponse> {
  try {
    console.log('Iniciando triggerN8NWebhook com payload:', {
      ...payload,
      credentials: payload.credentials ? '**oculto**' : undefined
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
    console.log('Webhook executado com sucesso:', response.status);
    return data;
  } catch (error) {
    console.error('Erro no triggerN8NWebhook:', error);
    throw error;
  }
}

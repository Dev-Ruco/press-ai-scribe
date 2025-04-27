
import { WebhookPayload, WebhookResponse, NewsArticle } from '@/types/news';

export const N8N_WEBHOOK_URL = 'https://felisberto.app.n8n.cloud/webhook-test/2c9b841f-82db-42ca-b734-c3266b2083fb';

export async function triggerN8NWebhook(
  userId: string,
  payload: WebhookPayload
): Promise<NewsArticle[]> {
  try {
    console.log('Iniciando triggerN8NWebhook com payload:', payload);
    console.log('Enviando para URL:', N8N_WEBHOOK_URL);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-UserId': userId
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Erro na resposta do webhook:', {
        status: response.status,
        statusText: response.statusText
      });
      return []; // Return empty array instead of throwing
    }

    console.log('Webhook executado com sucesso:', response.status);
    return [];
  } catch (error) {
    console.error('Error in triggerN8NWebhook:', error);
    return []; // Return empty array on error
  }
}

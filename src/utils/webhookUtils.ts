
import { WebhookPayload, WebhookResponse, NewsArticle } from '@/types/news';

const N8N_WEBHOOK_URL = 'https://felisberto.app.n8n.cloud/webhook-test/2c9b841f-82db-42ca-b734-c3266b2083fb';

export async function triggerN8NWebhook(
  userId: string,
  payload: WebhookPayload
): Promise<NewsArticle[]> {
  try {
    console.log('Iniciando triggerN8NWebhook com payload:', payload);
    console.log('Enviando para URL:', N8N_WEBHOOK_URL);
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-UserId': userId
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta do webhook:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`Erro no webhook: ${response.status} - ${errorText}`);
    }

    const data: WebhookResponse = await response.json();
    console.log('Resposta do webhook recebida:', data);
    return data.articles;
  } catch (error) {
    console.error('Erro em triggerN8NWebhook:', error);
    throw error;
  }
}

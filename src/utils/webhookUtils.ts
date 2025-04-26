
import { WebhookPayload, WebhookResponse, NewsArticle } from '@/types/news';

export const N8N_WEBHOOK_URL = 'https://felisberto.app.n8n.cloud/webhook-test/2c9b841f-82db-42ca-b734-c3266b2083fb';

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
      mode: 'no-cors', // Add CORS mode
      body: JSON.stringify(payload)
    });

    // When using no-cors, we won't get JSON response
    // Instead, we'll assume success if the request doesn't throw
    console.log('Resposta do webhook recebida com status:', response.status);
    
    if (!response.ok && response.status !== 0) { // Status 0 is expected with no-cors
      const errorText = await response.text();
      console.error('Erro na resposta do webhook:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`Erro no webhook: ${response.status}`);
    }

    // With no-cors, we can't read the response body
    // Return an empty array as we can't process the actual response
    return [];
  } catch (error) {
    console.error('Erro em triggerN8NWebhook:', error);
    throw error;
  }
}

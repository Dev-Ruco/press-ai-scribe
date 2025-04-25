
import { WebhookPayload, WebhookResponse, NewsArticle } from '@/types/news';

const N8N_WEBHOOK_URL = 'https://felisberto.app.n8n.cloud/webhook-test/agentedenoticias';

export async function triggerN8NWebhook(
  userId: string,
  payload: WebhookPayload
): Promise<NewsArticle[]> {
  try {
    console.log('Triggering n8n webhook for source:', payload);
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-UserId': userId
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WebhookResponse = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error triggering n8n webhook:', error);
    throw error;
  }
}


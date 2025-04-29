
import { ContentPayload, N8N_WEBHOOK_URL, REQUEST_TIMEOUT } from './types';
import { WebhookResponse } from '@/types/news';

// Helper function to send with timeout
export async function sendWithTimeout(payload: ContentPayload, timeout: number = REQUEST_TIMEOUT): Promise<WebhookResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    console.log(`Enviando requisição para ${N8N_WEBHOOK_URL} com tipo de conteúdo: ${payload.type}`);
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': payload.sessionId || '',
        'X-Webhook-Source': 'lovable-app'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro HTTP ${response.status}: ${response.statusText}`, errorText);
      throw new Error(`HTTP error ${response.status}: ${response.statusText}. Details: ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log(`Resposta recebida do webhook ${N8N_WEBHOOK_URL}: ${JSON.stringify(responseData)}`);
    
    // Ensure the response conforms to our WebhookResponse interface
    return {
      ...responseData,
      success: responseData.success ?? true,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error(`Request timed out while connecting to ${N8N_WEBHOOK_URL}`);
      throw new Error(`Request timed out while connecting to ${N8N_WEBHOOK_URL}`);
    }
    console.error(`Erro no sendWithTimeout para ${N8N_WEBHOOK_URL}:`, error);
    throw error;
  }
}

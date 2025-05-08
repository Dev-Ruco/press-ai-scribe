
import { ContentPayload, N8N_WEBHOOK_URL, REQUEST_TIMEOUT } from './types';
import { WebhookResponse } from '@/types/news';

// Helper function to send with timeout
export async function sendWithTimeout(payload: ContentPayload, timeout: number = REQUEST_TIMEOUT): Promise<WebhookResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    console.log(`Enviando requisição para ${N8N_WEBHOOK_URL} com tipo de conteúdo: ${payload.type}`);
    console.log(`Payload: ${JSON.stringify(payload, null, 2)}`);
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': payload.sessionId || '',
        'X-Webhook-Source': 'lovable-app',
        'X-Request-ID': `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log(`Resposta do webhook: Status ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro HTTP ${response.status}: ${response.statusText}`, errorText);
      throw new Error(`HTTP error ${response.status}: ${response.statusText}. Details: ${errorText}`);
    }
    
    try {
      const responseData = await response.json();
      console.log(`Resposta recebida do webhook ${N8N_WEBHOOK_URL}: ${JSON.stringify(responseData)}`);
      
      // Ensure the response conforms to our WebhookResponse interface
      return {
        ...responseData,
        success: responseData.success ?? true,
      };
    } catch (e) {
      const responseText = await response.text();
      console.log("Resposta do webhook não é JSON válido, mas o status é OK");
      console.log(`Resposta em texto: ${responseText}`);
      return {
        success: true,
        message: "Requisição enviada com sucesso",
        responseText
      };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error(`Request timed out while connecting to ${N8N_WEBHOOK_URL} (${timeout/1000}s)`);
      throw new Error(`Request timed out while connecting to ${N8N_WEBHOOK_URL} (${timeout/1000}s)`);
    }
    console.error(`Erro no sendWithTimeout para ${N8N_WEBHOOK_URL}:`, error);
    throw error;
  }
}

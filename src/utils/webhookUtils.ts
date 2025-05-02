
import { WebhookResponse } from '@/types/news';
import { N8N_WEBHOOK_URL, REQUEST_TIMEOUT, MAX_CHUNK_SIZE, MAX_CONCURRENT_CHUNKS } from './webhook/types';
import { chunkedUpload } from './webhook/chunkedUpload';
import { sendWithTimeout } from './webhook/sendWithTimeout';
import { supabase } from '@/integrations/supabase/client';

// Re-export constants and functions
export { 
  N8N_WEBHOOK_URL, 
  chunkedUpload, 
  sendWithTimeout,
  REQUEST_TIMEOUT,
  MAX_CHUNK_SIZE,
  MAX_CONCURRENT_CHUNKS 
};

// Re-export types with proper syntax for isolatedModules
export type { ContentPayload, ProgressCallback } from './webhook/types';

export async function triggerN8NWebhook(
  payload: import('./webhook/types').ContentPayload, 
  onProgress?: import('./webhook/types').ProgressCallback
): Promise<WebhookResponse> {
  try {
    console.log('Iniciando triggerN8NWebhook com payload:', {
      id: payload.id,
      type: payload.type,
      mimeType: payload.mimeType,
      dataLength: payload.data instanceof File ? payload.data.size : (typeof payload.data === 'string' ? payload.data.length : 0),
      authMethod: payload.authMethod,
      chunkIndex: payload.chunkIndex,
      totalChunks: payload.totalChunks,
      sessionId: payload.sessionId,
      webhookUrl: N8N_WEBHOOK_URL
    });
    
    // Special handling for file uploads
    if (payload.type === 'file' && payload.data instanceof File) {
      const success = await chunkedUpload(
        payload.data, 
        payload.id, 
        onProgress,
        payload.sessionId
      );
      
      return { success };
    }
    
    return await sendWithTimeout(payload);
  } catch (error) {
    console.error(`Erro no triggerN8NWebhook para ${N8N_WEBHOOK_URL}:`, error);
    throw error;
  }
}

// Função para verificar permissões de storage
export async function checkStoragePermissions(): Promise<{
  hasAccess: boolean;
  message: string;
  bucketExists: boolean;
}> {
  try {
    // Verificar se o usuário está autenticado
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { 
        hasAccess: false, 
        message: "Usuário não autenticado. Faça login para verificar permissões.",
        bucketExists: false
      };
    }
    
    // Verificar se o bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError);
      return {
        hasAccess: false,
        message: `Erro ao verificar buckets: ${bucketsError.message}`,
        bucketExists: false
      };
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'Media Files');
    if (!bucketExists) {
      return {
        hasAccess: false,
        message: "O bucket 'Media Files' não existe. Entre em contato com o administrador.",
        bucketExists: false
      };
    }
    
    // Tentar listar arquivos para verificar permissão
    const { data: files, error: listError } = await supabase.storage
      .from('Media Files')
      .list('', { limit: 1 });
    
    if (listError) {
      return {
        hasAccess: false,
        message: `Erro de permissão: ${listError.message}`,
        bucketExists: true
      };
    }
    
    return {
      hasAccess: true,
      message: "Permissões OK. Você pode fazer upload de arquivos.",
      bucketExists: true
    };
  } catch (error) {
    console.error("Erro ao verificar permissões:", error);
    return {
      hasAccess: false,
      message: `Erro ao verificar permissões: ${error.message}`,
      bucketExists: false
    };
  }
}

// Função para carregar arquivo para o servidor e obter URL pública
export async function uploadFileAndGetUrl(file: File): Promise<string> {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("Erro de autenticação: Usuário não está autenticado");
      throw new Error("Usuário não autenticado. Faça login para fazer upload de arquivos.");
    }
    
    console.log("Autenticação verificada com sucesso. User ID:", session.user.id);
    
    // Generate a unique file path using UUID and the original file name
    // to avoid name collisions in the storage bucket
    const uniqueFileName = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = `uploads/${uniqueFileName}`;
    
    console.log(`Iniciando upload do arquivo ${file.name} (${file.size} bytes, tipo: ${file.type}) para Supabase no caminho: ${filePath}`);
    console.log(`Usando bucket 'Media Files' (com espaço no nome)`);
    
    // Upload file to Supabase storage - using "Media Files" bucket name with space
    // This matches the actual bucket name in Supabase
    const { data, error } = await supabase.storage
      .from('Media Files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream'
      });
    
    if (error) {
      console.error("Erro detalhado do upload para Supabase:", error);
      console.error("Mensagem:", error.message);
      
      // Check if it's a permission error based on message
      if (error.message.includes('Permission') || error.message.includes('permission')) {
        throw new Error(`Erro de permissão ao acessar o bucket 'Media Files': ${error.message}`);
      }
      
      // Check if it's a bucket not found error based on message
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        throw new Error(`O bucket 'Media Files' não foi encontrado: ${error.message}`);
      }
      
      throw new Error(`Erro ao fazer upload do arquivo para o Supabase: ${error.message}`);
    }
    
    if (!data || !data.path) {
      console.error("Erro: upload realizado, mas sem caminho retornado");
      throw new Error('Falha ao obter caminho do arquivo após upload para o Supabase');
    }
    
    console.log(`Arquivo carregado com sucesso. Caminho: ${data.path}`);
    
    // Get the public URL for the uploaded file - also using "Media Files" bucket name with space
    const { data: publicUrlData } = supabase.storage
      .from('Media Files')
      .getPublicUrl(data.path);
    
    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error("Erro: falha ao gerar URL pública");
      throw new Error('Falha ao gerar URL pública para o arquivo');
    }
    
    console.log(`Arquivo ${file.name} carregado com sucesso. URL pública: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(`Erro detalhado ao fazer upload do arquivo ${file.name}:`, error);
    throw new Error(`Falha ao fazer upload do arquivo ${file.name}: ${error.message}`);
  }
}

// Função para enviar todos os dados no formato JSON exigido pela n8n
export async function sendArticleToN8N(
  text: string,
  articleType: string,
  files: File[] = [],
  links: { url: string; id: string }[] = []
): Promise<WebhookResponse> {
  try {
    console.log('Enviando artigo para N8N:', { text, articleType, filesCount: files.length, linksCount: links.length });
    
    // Separar arquivos por tipo
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    const documentFiles = files.filter(file => !file.type.startsWith('audio/') && !file.type.startsWith('image/'));
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    console.log(`Processando ${audioFiles.length} arquivos de áudio, ${imageFiles.length} imagens e ${documentFiles.length} documentos`);
    
    // Arrays para armazenar as informações processadas
    const audiosArray = [];
    const documentsArray = [];
    const imagesArray = [];
    
    // Processar arquivos de áudio 
    for (const audioFile of audioFiles) {
      try {
        // Upload do arquivo para o Supabase e obtenção da URL pública
        const audioUrl = await uploadFileAndGetUrl(audioFile);
        
        audiosArray.push({
          url: audioUrl,
          mimeType: audioFile.type,
          nome: audioFile.name,
          tamanho: audioFile.size
        });
      } catch (err) {
        console.error(`Erro ao processar arquivo de áudio ${audioFile.name}:`, err);
        throw err; // Propaga o erro para tratamento superior
      }
    }
    
    // Processar documentos
    for (const docFile of documentFiles) {
      try {
        // Upload do arquivo para o Supabase e obtenção da URL pública
        const docUrl = await uploadFileAndGetUrl(docFile);
        
        documentsArray.push({
          url: docUrl,
          mimeType: docFile.type,
          nome: docFile.name,
          tamanho: docFile.size
        });
      } catch (err) {
        console.error(`Erro ao processar documento ${docFile.name}:`, err);
        throw err; // Propaga o erro para tratamento superior
      }
    }
    
    // Processar imagens
    for (const imageFile of imageFiles) {
      try {
        // Upload do arquivo para o Supabase e obtenção da URL pública
        const imageUrl = await uploadFileAndGetUrl(imageFile);
        
        imagesArray.push({
          url: imageUrl,
          mimeType: imageFile.type,
          nome: imageFile.name,
          tamanho: imageFile.size
        });
      } catch (err) {
        console.error(`Erro ao processar imagem ${imageFile.name}:`, err);
        throw err; // Propaga o erro para tratamento superior
      }
    }
    
    // Preparar o payload final no formato JSON exigido
    const payload = {
      audios: audiosArray,
      documents: documentsArray,
      images: imagesArray,
      links: links.map(link => link.url),  // Converter para array de strings
      text: text,
      articleType: articleType
    };
    
    console.log('Enviando payload JSON para webhook:', payload);
    
    // Enviar para o webhook como JSON
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'lovable-app'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}. Detalhes: ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Resposta recebida do webhook:', responseData);
    
    return {
      ...responseData,
      success: true
    };
  } catch (error) {
    console.error('Erro ao enviar artigo para N8N:', error);
    throw error;
  }
}

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

// Constants for Supabase bucket - usando kebab-case consistentemente
const BUCKET_ID = 'media-files';
const BUCKET_NAME = 'media-files';

// Função para criar o bucket se não existir
export async function ensureStorageBucketExists(): Promise<{
  exists: boolean;
  created: boolean;
  error?: string;
}> {
  try {
    // Verificar sessão do usuário
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { 
        exists: false, 
        created: false,
        error: "Usuário não autenticado. Faça login para criar o bucket." 
      };
    }
    
    // Listar buckets para ver se o bucket já existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Erro ao listar buckets:", listError);
      return {
        exists: false,
        created: false,
        error: `Erro ao verificar buckets: ${listError.message}`
      };
    }
    
    // Verificar se o bucket existe
    const bucketExists = buckets?.some(bucket => 
      bucket.id === BUCKET_ID || bucket.name === BUCKET_NAME
    );
    
    if (bucketExists) {
      console.log(`Bucket '${BUCKET_NAME}' já existe.`);
      return { exists: true, created: false };
    }
    
    // Criar bucket se não existir
    const { error: createError } = await supabase.storage.createBucket(BUCKET_ID, {
      public: true,
      fileSizeLimit: 50 * 1024 * 1024 // 50MB
    });
    
    if (createError) {
      console.error(`Erro ao criar bucket '${BUCKET_NAME}':`, createError);
      return {
        exists: false,
        created: false,
        error: `Erro ao criar bucket: ${createError.message}`
      };
    }
    
    console.log(`Bucket '${BUCKET_NAME}' criado com sucesso.`);
    return { exists: false, created: true };
  } catch (error) {
    console.error("Erro ao verificar/criar bucket:", error);
    return {
      exists: false,
      created: false,
      error: `Erro ao verificar/criar bucket: ${error.message}`
    };
  }
}

// Função para verificar permissões de storage
export async function checkStoragePermissions(): Promise<{
  hasAccess: boolean;
  message: string;
  bucketExists: boolean;
  isAuthenticated: boolean;
}> {
  try {
    // Verificar se o usuário está autenticado
    const { data: { session } } = await supabase.auth.getSession();
    
    // Authentication check
    if (!session) {
      console.log("Storage check failed: User not authenticated");
      return { 
        hasAccess: false, 
        message: "Usuário não autenticado. Faça login para verificar permissões.",
        bucketExists: false,
        isAuthenticated: false
      };
    }
    
    console.log("Storage check: User authenticated", session.user.id);
    
    // Verificar se o bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      // Verificar se é um erro de autenticação
      if (bucketsError.message.includes('JWT') || 
          bucketsError.message.includes('token') || 
          bucketsError.message.includes('auth') || 
          bucketsError.message.includes('permission')) {
        return {
          hasAccess: false,
          message: `Erro de autenticação: ${bucketsError.message}. Por favor, faça login novamente.`,
          bucketExists: false,
          isAuthenticated: false
        };
      }
      
      return {
        hasAccess: false,
        message: `Erro ao verificar buckets: ${bucketsError.message}`,
        bucketExists: false,
        isAuthenticated: true
      };
    }
    
    // Verificar se o bucket existe por ID ou nome
    const bucketExists = buckets?.some(bucket => 
      bucket.id === BUCKET_ID || bucket.name === BUCKET_NAME
    );
    
    if (!bucketExists) {
      // Tentar criar o bucket automaticamente
      const { created, error } = await ensureStorageBucketExists();
      
      if (error) {
        return {
          hasAccess: false,
          message: `O bucket '${BUCKET_NAME}' não existe e não foi possível criá-lo: ${error}`,
          bucketExists: false,
          isAuthenticated: true
        };
      }
      
      if (created) {
        // Se o bucket foi criado com sucesso, continuar verificação
        console.log(`Bucket '${BUCKET_NAME}' criado, verificando permissões...`);
      } else {
        return {
          hasAccess: false,
          message: `O bucket '${BUCKET_NAME}' não existe. Entre em contato com o administrador.`,
          bucketExists: false,
          isAuthenticated: true
        };
      }
    }
    
    // Tentar listar arquivos para verificar permissão
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_ID)
      .list('', { limit: 1 });
    
    if (listError) {
      // Verificar se é um erro de autenticação
      if (listError.message.includes('JWT') || 
          listError.message.includes('token') || 
          listError.message.includes('auth') || 
          listError.message.includes('permission')) {
        return {
          hasAccess: false,
          message: `Erro de autenticação: ${listError.message}. Por favor, faça login novamente.`,
          bucketExists: true,
          isAuthenticated: false
        };
      }
      
      return {
        hasAccess: false,
        message: `Erro de permissão: ${listError.message}`,
        bucketExists: true,
        isAuthenticated: true
      };
    }
    
    return {
      hasAccess: true,
      message: "Permissões OK. Você pode fazer upload de arquivos.",
      bucketExists: true,
      isAuthenticated: true
    };
  } catch (error) {
    // Verificar se é um erro de autenticação
    if (error.message?.includes('JWT') || 
        error.message?.includes('token') || 
        error.message?.includes('auth') || 
        error.message?.includes('permission') ||
        error.message?.includes('unauthorized')) {
      return {
        hasAccess: false,
        message: `Erro de autenticação: ${error.message}. Por favor, faça login novamente.`,
        bucketExists: false,
        isAuthenticated: false
      };
    }
    
    return {
      hasAccess: false,
      message: `Erro ao verificar permissões: ${error.message}`,
      bucketExists: false,
      isAuthenticated: true
    };
  }
}

// Função para carregar arquivo para o servidor e obter URL pública
export async function uploadFileAndGetUrl(file: File): Promise<string> {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Usuário não autenticado. Faça login para fazer upload de arquivos.");
    }
    
    // Verificar/criar bucket se necessário
    await ensureStorageBucketExists();
    
    // Generate a unique file path using UUID and the original file name
    const uniqueFileName = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = `uploads/${uniqueFileName}`;
    
    console.log(`Iniciando upload do arquivo ${file.name} (${file.size} bytes, tipo: ${file.type})`);
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(BUCKET_ID)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream'
      });
    
    if (error) {
      console.error("Erro detalhado do upload para Supabase:", error);
      
      // Check if it's a permission error or bucket not found
      if (error.message.includes('Permission') || 
          error.message.includes('permission') ||
          error.message.includes('not found') || 
          error.message.includes('does not exist')) {
        
        // Tentar criar o bucket e tentar novamente
        const { created } = await ensureStorageBucketExists();
        if (created) {
          // Tentar upload novamente
          const { data: retryData, error: retryError } = await supabase.storage
            .from(BUCKET_ID)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
              contentType: file.type || 'application/octet-stream'
            });
            
          if (retryError) {
            throw new Error(`Erro ao fazer upload após criar bucket: ${retryError.message}`);
          }
          
          if (!retryData || !retryData.path) {
            throw new Error('Falha ao obter caminho do arquivo após upload para o Supabase');
          }
          
          // Get the public URL for the uploaded file
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_ID)
            .getPublicUrl(retryData.path);
          
          return publicUrlData.publicUrl;
        } else {
          throw new Error(`Erro de acesso ao bucket: ${error.message}`);
        }
      }
      
      throw new Error(`Erro ao fazer upload do arquivo para o Supabase: ${error.message}`);
    }
    
    if (!data || !data.path) {
      throw new Error('Falha ao obter caminho do arquivo após upload para o Supabase');
    }
    
    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_ID)
      .getPublicUrl(data.path);
    
    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Falha ao gerar URL pública para o arquivo');
    }
    
    console.log(`Arquivo ${file.name} carregado com sucesso. URL: ${publicUrlData.publicUrl}`);
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

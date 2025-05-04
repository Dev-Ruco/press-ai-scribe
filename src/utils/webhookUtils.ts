
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export const N8N_WEBHOOK_URL = "https://felisberto.app.n8n.cloud/webhook-test/new-article";

/**
 * Verifica se o usuário tem permissões adequadas para o storage
 */
export async function checkStoragePermissions() {
  try {
    // Verificar se o usuário está autenticado
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return {
        hasAccess: false,
        isAuthenticated: false,
        bucketExists: false,
        message: "Usuário não autenticado. Faça login para verificar permissões."
      };
    }

    // Verificar se o bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError);
      return {
        hasAccess: false,
        isAuthenticated: true,
        bucketExists: false,
        message: `Erro ao verificar buckets: ${bucketsError.message}`
      };
    }

    const mediaBucket = buckets?.find(bucket => bucket.name === 'media-files');
    
    if (!mediaBucket) {
      return {
        hasAccess: false,
        isAuthenticated: true,
        bucketExists: false,
        message: "Bucket 'media-files' não existe. É necessário criar o bucket."
      };
    }

    // Testar permissões
    try {
      // Tentar listar arquivos para verificar permissões
      const { error: listError } = await supabase.storage.from('media-files').list();
      
      if (listError) {
        return {
          hasAccess: false,
          isAuthenticated: true,
          bucketExists: true,
          message: `Sem permissão para acessar o bucket: ${listError.message}`
        };
      }

      return {
        hasAccess: true,
        isAuthenticated: true,
        bucketExists: true,
        message: "Permissões de armazenamento verificadas com sucesso."
      };
    } catch (error) {
      return {
        hasAccess: false,
        isAuthenticated: true, 
        bucketExists: true,
        message: `Erro ao verificar permissões: ${error.message}`
      };
    }
  } catch (error) {
    console.error("Erro ao verificar permissões de storage:", error);
    return {
      hasAccess: false,
      isAuthenticated: false,
      bucketExists: false,
      message: `Erro ao verificar permissões: ${error.message}`
    };
  }
}

/**
 * Garante que o bucket de armazenamento existe, criando-o se necessário
 */
export async function ensureStorageBucketExists() {
  try {
    // Verificar se o usuário está autenticado
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return {
        success: false,
        error: "Usuário não autenticado",
        created: false
      };
    }

    // Verificar se o bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError);
      return {
        success: false,
        error: bucketsError.message,
        created: false
      };
    }

    const mediaBucket = buckets?.find(bucket => bucket.name === 'media-files');
    
    // Se o bucket não existe, criar
    if (!mediaBucket) {
      console.log("Bucket 'media-files' não encontrado. Tentando criar...");
      
      const { data, error } = await supabase.storage.createBucket('media-files', {
        public: true,
        fileSizeLimit: 52428800 // 50MB em bytes
      });
      
      if (error) {
        console.error("Erro ao criar bucket:", error);
        return {
          success: false,
          error: error.message,
          created: false
        };
      }
      
      console.log("Bucket 'media-files' criado com sucesso:", data);
      return {
        success: true,
        created: true
      };
    }
    
    return {
      success: true,
      created: false
    };
  } catch (error) {
    console.error("Erro ao verificar/criar bucket:", error);
    return {
      success: false,
      error: error.message,
      created: false
    };
  }
}

/**
 * Faz upload de um arquivo para o Supabase Storage e retorna a URL pública
 */
export async function uploadFileAndGetUrl(file: File) {
  try {
    // Verificar se o bucket existe
    await ensureStorageBucketExists();
    
    // Gerar um nome único para o arquivo
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `uploads/${fileName}`;
    
    // Upload do arquivo
    const { error: uploadError } = await supabase.storage
      .from('media-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error("Erro no upload:", uploadError);
      throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
    }
    
    // Obter URL pública
    const { data } = supabase.storage
      .from('media-files')
      .getPublicUrl(filePath);
    
    if (!data.publicUrl) {
      throw new Error("Não foi possível obter URL pública");
    }
    
    console.log("Arquivo enviado com sucesso:", data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error("Erro no processo de upload:", error);
    throw error;
  }
}

/**
 * Envia artigo para o webhook N8N com URLs dos arquivos
 */
export async function sendArticleToN8N(
  content: string,
  articleType: string,
  files: File[],
  links: any[] = []
) {
  try {
    console.log("Iniciando envio para N8N com", files.length, "arquivos");
    
    // Separar arquivos por tipo
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const documentFiles = files.filter(
      file => !file.type.startsWith('audio/') && !file.type.startsWith('image/')
    );
    
    // Upload de todos os arquivos para Supabase e obter URLs
    const uploadAudios = Promise.all(
      audioFiles.map(async (file) => {
        const url = await uploadFileAndGetUrl(file);
        return {
          url,
          mimeType: file.type,
          nome: file.name,
          tamanho: file.size
        };
      })
    );
    
    const uploadImages = Promise.all(
      imageFiles.map(async (file) => {
        const url = await uploadFileAndGetUrl(file);
        return {
          url,
          mimeType: file.type,
          nome: file.name,
          tamanho: file.size
        };
      })
    );
    
    const uploadDocuments = Promise.all(
      documentFiles.map(async (file) => {
        const url = await uploadFileAndGetUrl(file);
        return {
          url,
          mimeType: file.type,
          nome: file.name,
          tamanho: file.size
        };
      })
    );
    
    // Aguardar todos os uploads
    const [audios, images, documents] = await Promise.all([
      uploadAudios,
      uploadImages,
      uploadDocuments
    ]);
    
    // Preparar payload para o webhook
    const payload = {
      audios,
      images,
      documents,
      links: links.map(link => link.url || link),
      text: content,
      articleType
    };
    
    console.log("Enviando payload para N8N:", payload);
    
    // Enviar para o webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'lovable-app'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }
    
    console.log("Conteúdo enviado com sucesso para N8N");
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar para N8N:", error);
    return { 
      success: false,
      error: error.message 
    };
  }
}

/**
 * Função genérica para acionar o webhook N8N
 */
export async function triggerN8NWebhook(
  payload: any, 
  onProgress?: (progress: number) => void
) {
  try {
    // Simular progresso de upload se callback fornecido
    if (onProgress) {
      onProgress(10);
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress(30);
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress(60);
    }
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'lovable-app'
      },
      body: JSON.stringify(payload)
    });
    
    if (onProgress) {
      onProgress(90);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }
    
    if (onProgress) {
      onProgress(100);
    }
    
    return {
      success: true,
      message: "Webhook acionado com sucesso"
    };
  } catch (error) {
    console.error("Erro ao acionar webhook:", error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Função para checar chunks do arquivo e dividi-lo se necessário
 */
export async function chunkedUpload(
  file: File,
  fileId: string,
  onProgress?: (progress: number) => void
) {
  // Por enquanto, simplesmente usar o uploadFileAndGetUrl
  try {
    if (onProgress) onProgress(10);
    const url = await uploadFileAndGetUrl(file);
    if (onProgress) onProgress(100);
    return { success: true, fileId, url };
  } catch (error) {
    console.error("Erro no upload em chunks:", error);
    throw error;
  }
}

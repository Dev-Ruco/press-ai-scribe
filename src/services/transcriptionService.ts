
import { supabase } from "@/integrations/supabase/client";
import { sendTranscriptionToN8N } from "@/utils/webhookUtils";

export interface TranscriptionData {
  id?: string;
  name: string;
  user_id?: string;
  file_path?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  content?: string;
  source_type?: string;
  duration?: string;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
}

export interface TranscriptionFile {
  url: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

/**
 * Busca todas as transcrições do usuário atual
 */
export async function getTranscriptions() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
      .from("transcriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar transcrições:", error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Busca uma transcrição pelo ID
 */
export async function getTranscriptionById(id: string) {
  try {
    const { data, error } = await supabase
      .from("transcriptions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error(`Erro ao buscar transcrição ${id}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Cria uma nova transcrição e envia para processamento
 */
export async function createTranscription(transcriptionData: TranscriptionData, file: TranscriptionFile) {
  try {
    console.log("Iniciando criação de transcrição:", transcriptionData.name);
    console.log("Arquivo:", file.fileName, file.url, file.mimeType);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("Falha na criação de transcrição: Usuário não autenticado");
      throw new Error("Usuário não autenticado");
    }

    // Criar registro da transcrição no banco de dados
    console.log("Criando registro da transcrição no banco de dados...");
    const { data: transcription, error } = await supabase
      .from("transcriptions")
      .insert([
        {
          name: transcriptionData.name,
          status: 'pending',
          user_id: session.user.id,
          file_path: file.url,
          source_type: file.mimeType
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao inserir transcrição no banco:", error);
      throw error;
    }
    
    console.log("Transcrição criada com sucesso. ID:", transcription.id);

    // Enviar para o webhook N8N
    console.log("Enviando para webhook N8N...");
    const sendResult = await sendTranscriptionToN8N(file, transcription.id);
    
    if (!sendResult.success) {
      console.error("Falha ao enviar para N8N:", sendResult.error);
      // Atualizar status para falha caso o envio para N8N falhe
      await supabase
        .from("transcriptions")
        .update({ status: 'failed' })
        .eq("id", transcription.id);
        
      throw new Error(sendResult.error || "Falha ao enviar para processamento");
    }

    console.log("Transcrição enviada para processamento com sucesso");
    
    // Atualizar status para processando
    await supabase
      .from("transcriptions")
      .update({ status: 'processing' })
      .eq("id", transcription.id);

    return { success: true, data: transcription };
  } catch (error) {
    console.error("Erro ao criar transcrição:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Exclui uma transcrição pelo ID
 */
export async function deleteTranscription(id: string) {
  try {
    const { error } = await supabase
      .from("transcriptions")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Erro ao excluir transcrição ${id}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Busca atualizações de uma transcrição em tempo real
 */
export function subscribeToTranscriptionUpdates(transcriptionId: string, callback: (payload: any) => void) {
  const channel = supabase
    .channel('transcription-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'transcriptions',
        filter: `id=eq.${transcriptionId}`
      },
      payload => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

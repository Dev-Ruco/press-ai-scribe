
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, ChatHistoryService } from "@/types/assistant";
import { MessageType } from "@/components/article/assistant/types";

export const chatHistoryService: ChatHistoryService = {
  loadMessages: async (sessionId: string) => {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('chat_session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading chat history:', error);
      return [];
    }

    // Map the database response to our ChatMessage type
    return (data || []).map(item => ({
      id: item.id,
      content: item.content,
      is_ai: item.is_ai,
      chat_session_id: item.chat_session_id,
      type: (item.type || 'agent') as MessageType,
      user_id: item.user_id,
      created_at: item.created_at
    }));
  },

  saveMessage: async (message) => {
    const { error } = await supabase
      .from('chat_history')
      .insert(message);

    if (error) {
      console.error('Error saving message:', error);
    }
  }
};

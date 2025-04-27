
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, ChatHistoryService } from "@/types/assistant";

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

    return data || [];
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

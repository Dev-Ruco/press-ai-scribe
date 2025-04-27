
import { MessageType } from "@/components/article/assistant/types";

export interface ChatMessage {
  id: string;
  content: string;
  is_ai: boolean;
  chat_session_id: string;
  type: MessageType;
  user_id: string;
  created_at: string;
}

export interface ChatHistoryService {
  loadMessages: (sessionId: string) => Promise<ChatMessage[]>;
  saveMessage: (message: Omit<ChatMessage, 'id' | 'created_at'>) => Promise<void>;
}

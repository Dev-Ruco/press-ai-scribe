
import { useState, useEffect } from "react";
import { Message, MessageType } from "@/components/article/assistant/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export function useAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatSessionId] = useState(() => uuidv4());
  const { toast } = useToast();

  // Load initial messages from database
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('chat_session_id', chatSessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading chat history:', error);
        return;
      }

      if (data?.length === 0) {
        // Add welcome message if no messages exist
        const welcomeMessage: Message = {
          id: "welcome",
          content: "Olá! Sou seu assistente de criação de artigos. Como posso ajudar hoje?",
          isUser: false,
          timestamp: new Date(),
          type: "agent"
        };
        setMessages([welcomeMessage]);
      } else {
        setMessages(data.map(msg => ({
          id: msg.id,
          content: msg.content,
          isUser: !msg.is_ai,
          timestamp: new Date(msg.created_at),
          type: msg.type || "agent"
        })));
      }
    };

    loadMessages();
  }, [chatSessionId]);

  const clearChat = async () => {
    // Clear local messages
    const welcomeMessage: Message = {
      id: "welcome",
      content: "Chat limpo. Como posso ajudar?",
      isUser: false,
      timestamp: new Date(),
      type: "agent"
    };
    
    setMessages([welcomeMessage]);
    
    toast({
      title: "Chat limpo",
      description: "Iniciando nova conversa"
    });
  };

  const handleSendMessage = async (content: string, type: MessageType) => {
    if (!content.trim() || isAiTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
      type
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Save user message to database
    const { error } = await supabase
      .from('chat_history')
      .insert({
        content,
        is_ai: false,
        chat_session_id: chatSessionId,
        type,
        user_id: 'current_user' // This will need to be replaced with actual user ID
      });

    if (error) {
      console.error('Error saving message:', error);
    }

    simulateAiResponse(type);
  };

  const simulateAiResponse = async (type: MessageType) => {
    setIsAiTyping(true);
    
    let responseContent = "Estou processando sua solicitação...";
    switch (type) {
      case "agent":
        responseContent = "Entendi sua instrução. Vou executar essa tarefa agora.";
        break;
      case "question":
        responseContent = "Boa pergunta. Deixe-me analisar e responder adequadamente.";
        break;
      case "suggestion":
        responseContent = "Baseado no contexto, aqui estão algumas sugestões relevantes.";
        break;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: responseContent,
      isUser: false,
      timestamp: new Date(),
      type: "agent"
    };

    setMessages(prev => [...prev, aiMessage]);

    // Save AI response to database
    const { error } = await supabase
      .from('chat_history')
      .insert({
        content: responseContent,
        is_ai: true,
        chat_session_id: chatSessionId,
        type: "agent",
        user_id: 'current_user' // This will need to be replaced with actual user ID
      });

    if (error) {
      console.error('Error saving AI response:', error);
    }
    
    setIsAiTyping(false);
  };

  return {
    messages,
    isAiTyping,
    clearChat,
    handleSendMessage
  };
}

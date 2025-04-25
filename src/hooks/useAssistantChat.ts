
import { useState } from "react";
import { Message, MessageType } from "@/components/article/assistant/types";
import { useToast } from "@/hooks/use-toast";

export function useAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    content: "Olá! Sou seu assistente de criação de artigos. Como posso ajudar hoje?",
    isUser: false,
    timestamp: new Date(),
    type: "agent"
  }]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const { toast } = useToast();

  const clearChat = () => {
    setMessages([{
      id: "welcome",
      content: "Chat limpo. Como posso ajudar?",
      isUser: false,
      timestamp: new Date(),
      type: "agent"
    }]);
    
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
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: responseContent,
      isUser: false,
      timestamp: new Date(),
      type: "agent"
    }]);
    
    setIsAiTyping(false);
  };

  return {
    messages,
    isAiTyping,
    clearChat,
    handleSendMessage
  };
}

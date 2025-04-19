
import { useState } from "react";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

export function useChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá! Como posso ajudar com seu artigo hoje?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponseOptions = [
        "Entendi! Posso ajudar você a refinar esse ponto.",
        "Vou sugerir algumas abordagens para esse tópico.",
        "Você gostaria de ideias para tornar esse conteúdo mais envolvente?",
        "Posso oferecer contexto adicional sobre esse assunto.",
        "Deseja que eu sugira algumas fontes confiáveis sobre isso?"
      ];
      
      const randomResponse = aiResponseOptions[Math.floor(Math.random() * aiResponseOptions.length)];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return {
    message,
    messages,
    setMessage,
    handleSendMessage
  };
}

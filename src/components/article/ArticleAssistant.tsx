
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

export function ArticleAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    content: "Olá! Como posso ajudar com seu artigo hoje?",
    isUser: false,
    timestamp: new Date()
  }]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
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
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 pr-4 mb-4">
        <div className="space-y-4">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[85%] rounded-lg p-3 text-sm
                  ${msg.isUser 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-muted/50 text-foreground/90'
                  }
                `}
              >
                <p className="leading-relaxed">{msg.content}</p>
                <p className="text-[10px] mt-1 opacity-50">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2 pt-2 border-t border-border/30">
        <Input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-background/50 border-muted/30 focus-visible:ring-1"
          onKeyDown={e => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button 
          size="icon" 
          disabled={!message}
          onClick={handleSendMessage}
          variant="ghost"
          className="hover:bg-primary/10 text-primary"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

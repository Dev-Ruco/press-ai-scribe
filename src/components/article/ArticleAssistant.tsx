
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

export function ArticleAssistant() {
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

    // Simular resposta da IA
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

  return (
    <Card className="flex flex-col h-[600px] bg-card border-border">
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-medium">Assistente IA</span>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.isUser ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  msg.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!message}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

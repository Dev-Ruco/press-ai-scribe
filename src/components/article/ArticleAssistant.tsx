
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CircleDot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
};

export function ArticleAssistant() {
  const [message, setMessage] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    content: "Olá! Sou seu assistente de criação de artigos. Como posso ajudar hoje?",
    isUser: false,
    timestamp: new Date()
  }]);

  const simulateTyping = async (content: string) => {
    setIsAiTyping(true);
    const tempId = Date.now().toString();
    
    setMessages(prev => [...prev, {
      id: tempId,
      content: "●●●",
      isUser: false,
      timestamp: new Date(),
      isTyping: true
    }]);

    // Simulate typing delay based on message length
    await new Promise(resolve => setTimeout(resolve, Math.min(content.length * 30, 2000)));

    setMessages(prev => prev.filter(m => m.id !== tempId));
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content,
      isUser: false,
      timestamp: new Date()
    }]);
    
    setIsAiTyping(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isAiTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");

    // AI response options with more natural and helpful responses
    const aiResponseOptions = [
      {
        trigger: ["ajuda", "ajudar", "como"],
        response: "Posso ajudar você a estruturar seu artigo, sugerir tópicos relevantes ou revisar o conteúdo. O que você prefere?"
      },
      {
        trigger: ["estrutura", "formato"],
        response: "Para uma boa estrutura de artigo, sugiro começarmos com uma introdução impactante, seguida de 3-4 seções principais. Quer que eu detalhe cada parte?"
      },
      {
        trigger: ["ideia", "sugestão", "tema"],
        response: "Baseado no seu histórico de artigos, posso sugerir alguns temas interessantes. Gostaria de explorar alguma área específica?"
      },
      {
        trigger: ["revisar", "revisão", "melhorar"],
        response: "Posso ajudar a revisar seu texto, verificando clareza, coerência e estilo. Que aspecto você gostaria que eu focasse primeiro?"
      }
    ];

    // Find matching response or use default
    const matchingResponse = aiResponseOptions.find(option =>
      option.trigger.some(t => message.toLowerCase().includes(t))
    );

    const responseText = matchingResponse?.response || 
      "Entendi sua mensagem. Poderia me contar mais sobre o que você precisa para o artigo?";

    await simulateTyping(responseText);
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 pr-2 mb-3">
        <div className="space-y-2.5">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[90%] rounded-lg p-2 
                  ${msg.isTyping ? 'animate-pulse' : ''}
                  ${msg.isUser 
                    ? 'bg-primary/5 text-foreground/90' 
                    : msg.isTyping
                      ? 'bg-muted/20 text-foreground/60'
                      : 'bg-muted/30 text-foreground/80'
                  }
                `}
              >
                {!msg.isTyping && msg.isUser && 
                  <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                    <CircleDot className="w-2.5 h-2.5" />
                    Você
                  </div>
                }
                {!msg.isTyping && !msg.isUser && 
                  <div className="flex items-center gap-1 mb-1 text-xs text-primary/70">
                    <CircleDot className="w-2.5 h-2.5" />
                    Assistente IA
                  </div>
                }
                <p className="leading-relaxed text-sm">{msg.content}</p>
                {!msg.isTyping && (
                  <p className="text-[10px] mt-1 opacity-40">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2 pt-2 border-t border-border/20">
        <Input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={isAiTyping}
          className="flex-1 text-sm h-8 bg-card border-border/30 focus-visible:ring-0 focus-visible:border-border/50 disabled:opacity-50"
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          size="icon"
          disabled={!message || isAiTyping}
          onClick={handleSendMessage}
          variant="ghost"
          className="h-8 w-8 hover:bg-primary/5 text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CircleDot, Paperclip, Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssistantNavigation } from "./AssistantNavigation";
import { MessageTypeSelector } from "./MessageTypeSelector";

type MessageType = "agent" | "question" | "suggestion";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
  type?: MessageType;
  needsAction?: boolean;
}

export function ArticleAssistant() {
  const [message, setMessage] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [messageType, setMessageType] = useState<MessageType>("question");
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    content: "Olá! Sou seu assistente de criação de artigos. Como posso ajudar hoje?",
    isUser: false,
    timestamp: new Date(),
    type: "agent"
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
      timestamp: new Date(),
      type: messageType
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");

    // Simulated AI response with action buttons
    const aiResponse = {
      type: "suggestion",
      content: "Aqui está uma sugestão para melhorar seu artigo. Gostaria de aplicar estas mudanças?",
      needsAction: true
    };

    await simulateTyping(aiResponse.content);
  };

  const handleAction = (messageId: string, accept: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, needsAction: false } : msg
    ));
  };

  return (
    <div className="h-full flex flex-col">
      <AssistantNavigation />
      
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
                {!msg.isTyping && (
                  <div className={`flex items-center gap-1 mb-1 text-xs ${
                    msg.isUser ? 'text-muted-foreground' : 'text-primary/70'
                  }`}>
                    <CircleDot className="w-2.5 h-2.5" />
                    {msg.isUser ? 'Você' : 'Assistente IA'}
                  </div>
                )}
                <p className="leading-relaxed text-sm">{msg.content}</p>
                
                {msg.needsAction && !msg.isUser && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-border/10">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-7 px-2.5 gap-1.5 text-xs hover:bg-success/10 hover:text-success"
                      onClick={() => handleAction(msg.id, true)}
                    >
                      <Check className="h-3.5 w-3.5" />
                      Aceitar
                    </Button>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2.5 gap-1.5 text-xs hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleAction(msg.id, false)}
                    >
                      <X className="h-3.5 w-3.5" />
                      Rejeitar
                    </Button>
                  </div>
                )}
                
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

      <div className="flex flex-col gap-2">
        <MessageTypeSelector selected={messageType} onSelect={setMessageType} />
        
        <div className="flex gap-2 pt-2 border-t border-border/20">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-primary/5 text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
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
    </div>
  );
}


import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageTypeSelector } from "../../MessageTypeSelector";
import { useToast } from "@/hooks/use-toast";
import { Message, MessageType } from "../types";

interface AssistantChatTabProps {
  messages: Message[];
  onSendMessage: (content: string, type: MessageType) => void;
  isAiTyping: boolean;
  onConfirmProcessing?: () => void; // New prop to confirm processing
  workflowState?: any; // Optional workflow state
}

export function AssistantChatTab({ 
  messages, 
  onSendMessage, 
  isAiTyping, 
  onConfirmProcessing,
  workflowState 
}: AssistantChatTabProps) {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("question");
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim() || isAiTyping) return;
    onSendMessage(message, messageType);
    setMessage("");

    // In a real implementation, you might want to analyze the message
    // to detect if the user is confirming processing
    if (message.toLowerCase().includes("processar") || 
        message.toLowerCase().includes("confirmar") || 
        message.toLowerCase().includes("continuar")) {
      if (onConfirmProcessing) {
        onConfirmProcessing();
      }
    }
  };

  const handleFileAttach = () => {
    toast({
      title: "Anexo",
      description: "Funcionalidade de anexo de arquivo demonstrativa"
    });
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-3" ref={scrollAreaRef}>
        <div className="space-y-2.5 py-3">
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
                    : msg.type === 'agent'
                      ? 'bg-blue-500/10 text-foreground/90'
                      : msg.type === 'question'
                        ? 'bg-green-500/10 text-foreground/90'
                        : 'bg-purple-500/10 text-foreground/90'
                  }
                `}
              >
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

          {/* Show workflow status as system message if processing */}
          {workflowState?.isProcessing && (
            <div className="flex justify-center my-3">
              <div className="bg-muted/30 text-muted-foreground rounded-md px-3 py-1.5 text-xs">
                {workflowState.processingStatus === 'processing_with_agent' && 
                  'O agente está processando seu conteúdo...'}
                {workflowState.processingStatus === 'agent_processed' && 
                  'Conteúdo processado! Avançando para a próxima etapa...'}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="px-3 pb-3">
        <MessageTypeSelector selected={messageType} onSelect={setMessageType} />
        
        <div className="flex gap-2 mt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-primary/5"
                onClick={handleFileAttach}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Anexar arquivo</TooltipContent>
          </Tooltip>

          <Input
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isAiTyping}
            className="flex-1 text-sm h-8"
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon"
                disabled={!message || isAiTyping}
                onClick={handleSendMessage}
                variant="ghost"
                className="h-8 w-8 hover:bg-primary/5"
              >
                <Send className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enviar mensagem</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

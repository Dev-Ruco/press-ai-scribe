import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Clock, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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

  // Sample recent news data
  const recentNews = [{
    id: "1",
    title: "Nova política econômica anunciada pelo governo",
    time: "2h atrás"
  }, {
    id: "2",
    title: "Avanços na pesquisa sobre energias renováveis",
    time: "3h atrás"
  }, {
    id: "3",
    title: "Descoberta arqueológica importante no norte do país",
    time: "4h atrás"
  }];
  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
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
      const aiResponseOptions = ["Entendi! Posso ajudar você a refinar esse ponto.", "Vou sugerir algumas abordagens para esse tópico.", "Você gostaria de ideias para tornar esse conteúdo mais envolvente?", "Posso oferecer contexto adicional sobre esse assunto.", "Deseja que eu sugira algumas fontes confiáveis sobre isso?"];
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
  return <div className="space-y-6 my-0">
      <Card className="my-[104px] mx-[23px]">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Assistente IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <ScrollArea className="h-[320px] border rounded-lg p-4">
              <div className="space-y-4">
                {messages.map(msg => <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                      </p>
                    </div>
                  </div>)}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1" onKeyDown={e => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }} />
              <Button size="icon" disabled={!message} onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      
    </div>;
}
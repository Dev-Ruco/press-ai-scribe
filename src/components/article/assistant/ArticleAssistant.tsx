
import { useState, useEffect } from "react";
import { MessageSquare, FolderOpen, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssistantNavigation } from "../AssistantNavigation";
import { AssistantChatTab } from "./tabs/AssistantChatTab";
import { AssistantMaterialTab } from "./tabs/AssistantMaterialTab";
import { AssistantContextTab } from "./tabs/AssistantContextTab";
import { useToast } from "@/hooks/use-toast";
import { Message, MessageType, TranscriptionBlock, ContextSuggestion } from "./types";

// Mock data moved to constants
import { mockTranscriptionBlocks, mockContextSuggestions } from "./constants";

interface ArticleAssistantProps {
  workflowState?: {
    step?: string;
    files?: any[];
    content?: string;
    articleType?: any;
    title?: string;
    isProcessing?: boolean;
  };
  onWorkflowUpdate?: (updates: any) => void;
}

export function ArticleAssistant({ workflowState = {}, onWorkflowUpdate = () => {} }: ArticleAssistantProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    content: "Olá! Sou seu assistente de criação de artigos. Como posso ajudar hoje?",
    isUser: false,
    timestamp: new Date(),
    type: "agent"
  }]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const { toast } = useToast();

  const handleSendMessage = async (content: string, type: MessageType) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
      type
    };
    
    setMessages(prev => [...prev, userMessage]);
    simulateAiResponse();
  };

  const simulateAiResponse = async () => {
    setIsAiTyping(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: "Compreendi sua solicitação. Vou processar isso e atualizar o conteúdo do artigo em instantes.",
      isUser: false,
      timestamp: new Date(),
      type: "agent"
    }]);
    
    setIsAiTyping(false);
  };

  const handleUseCitation = (text: string, source: string) => {
    toast({
      title: "Citação adicionada",
      description: `"${text}" - ${source}`
    });
  };

  const handleUseSuggestion = (suggestion: ContextSuggestion) => {
    toast({
      title: "Sugestão aplicada",
      description: "A informação foi adicionada ao seu artigo."
    });
  };

  const handleShowMore = () => {
    toast({
      title: "Carregando mais transcrições",
      description: "Buscando transcrições adicionais..."
    });
  };

  return (
    <div className="h-full flex flex-col">
      <AssistantNavigation />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full justify-start rounded-none border-b px-1 flex-shrink-0">
          <TabsTrigger value="chat" className="text-xs flex gap-1 items-center">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="organization" className="text-xs flex gap-1 items-center">
            <FolderOpen className="h-3.5 w-3.5" />
            <span>Material</span>
          </TabsTrigger>
          <TabsTrigger value="context" className="text-xs flex gap-1 items-center">
            <FileText className="h-3.5 w-3.5" />
            <span>Contexto</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 min-h-0 relative">
          <TabsContent 
            value="chat" 
            className="absolute inset-0 m-0 data-[state=active]:flex flex-col"
          >
            <AssistantChatTab
              messages={messages}
              onSendMessage={handleSendMessage}
              isAiTyping={isAiTyping}
            />
          </TabsContent>
          
          <TabsContent 
            value="organization" 
            className="absolute inset-0 m-0 data-[state=active]:flex flex-col"
          >
            <AssistantMaterialTab
              transcriptionBlocks={mockTranscriptionBlocks}
              onUseCitation={handleUseCitation}
              onShowMore={handleShowMore}
            />
          </TabsContent>
          
          <TabsContent 
            value="context" 
            className="absolute inset-0 m-0 data-[state=active]:flex flex-col"
          >
            <AssistantContextTab
              suggestions={mockContextSuggestions}
              onUseSuggestion={handleUseSuggestion}
              onUseCitation={handleUseCitation}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

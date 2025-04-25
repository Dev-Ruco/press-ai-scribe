
import { useState } from "react";
import { MessageSquare, FolderOpen, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssistantHeader } from "./AssistantHeader";
import { AssistantChatTab } from "./tabs/AssistantChatTab";
import { AssistantMaterialTab } from "./tabs/AssistantMaterialTab";
import { AssistantContextTab } from "./tabs/AssistantContextTab";
import { useAssistantChat } from "@/hooks/useAssistantChat";
import { ContextSuggestion, TranscriptionBlock } from "./types";
import { useToast } from "@/hooks/use-toast";

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

// Mock data for transcription blocks
const mockTranscriptionBlocks: TranscriptionBlock[] = [
  {
    id: "1",
    type: "speaker",
    title: "Ministro de Energia",
    items: [
      { text: "Nosso objetivo é alcançar 60% de energia renovável na matriz energética até 2030.", time: "02:15" },
      { text: "Investimentos em energia solar cresceram 45% no último ano.", time: "03:42" }
    ]
  },
  {
    id: "2",
    type: "source",
    title: "Relatório Anual do Setor Energético",
    items: [
      { text: "37% das comunidades rurais ainda não têm acesso à eletricidade.", page: "Pág. 23" },
      { text: "Disparidade de acesso entre áreas urbanas (65%) e rurais (22%).", page: "Pág. 24" }
    ]
  }
];

// Mock data for context suggestions
const mockContextSuggestions: ContextSuggestion[] = [
  {
    title: "Notícia Relacionada",
    excerpt: "Financiamento de €120 milhões anunciado para expansão da rede elétrica em áreas rurais de Moçambique.",
    source: "Jornal de Negócios, 22/04/2025"
  },
  {
    title: "Estatística Relevante",
    excerpt: "Moçambique possui potencial para produzir 23 GW de energia solar, segundo dados da Agência Internacional de Energia.",
    source: "Relatório IEA, 2024"
  }
];

export function ArticleAssistant({ workflowState = {}, onWorkflowUpdate = () => {} }: ArticleAssistantProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const { messages, isAiTyping, clearChat, handleSendMessage } = useAssistantChat();
  const { toast } = useToast();

  const handleUseCitation = (text: string, source: string) => {
    toast({
      title: "Citação adicionada",
      description: `"${text}" - ${source}`
    });
    
    // Notify parent component if needed
    if (workflowState?.step === 'content-editing' && onWorkflowUpdate) {
      // For now we just show the toast
    }
  };

  const handleShowMoreTranscriptions = () => {
    toast({
      title: "Carregando mais transcrições",
      description: "Buscando transcrições adicionais..."
    });
    
    // Simulate loading more transcriptions
    setTimeout(() => {
      toast({
        title: "Transcrições carregadas",
        description: "Todas as transcrições disponíveis já foram carregadas."
      });
    }, 1500);
  };

  const handleUseSuggestion = (suggestion: ContextSuggestion) => {
    toast({
      title: "Sugestão aplicada",
      description: "A informação foi adicionada ao seu artigo."
    });
    
    // In a real implementation, we would update the article content through onWorkflowUpdate
    if (onWorkflowUpdate) {
      // This is just a simulation - in reality you'd modify the content in a more structured way
      onWorkflowUpdate({
        content: (workflowState?.content || '') + `\n\n${suggestion.excerpt} (${suggestion.source})`
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <AssistantHeader onNewChat={clearChat} />
      
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
              onShowMore={handleShowMoreTranscriptions}
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

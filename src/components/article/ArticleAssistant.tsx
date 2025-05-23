import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, CircleDot, Paperclip, Check, X, Mic, Link2, FileText, 
  FolderOpen, ListOrdered, Copy, Plus, MessageSquare, Play
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssistantNavigation } from "./AssistantNavigation";
import { MessageTypeSelector } from "./MessageTypeSelector";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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

// Define the ArticleType interface to match our object structure
interface ArticleTypeObject {
  id: string;
  label: string;
  structure: string[];
}

interface ArticleAssistantProps {
  workflowState?: {
    step?: string;
    files?: any[];
    content?: string;
    articleType?: ArticleTypeObject | string; // Updated to accept both object and string
    title?: string;
    isProcessing?: boolean;
  };
  onWorkflowUpdate?: (updates: any) => void;
}

// Mock data for transcription blocks
const mockTranscriptionBlocks = [
  {
    type: "speaker",
    title: "Ministro de Energia",
    items: [
      { text: "Nosso objetivo é alcançar 60% de energia renovável na matriz energética até 2030.", time: "02:15" },
      { text: "Investimentos em energia solar cresceram 45% no último ano.", time: "03:42" }
    ]
  },
  {
    type: "source",
    title: "Relatório Anual do Setor Energético",
    items: [
      { text: "37% das comunidades rurais ainda não têm acesso à eletricidade.", page: "Pág. 23" },
      { text: "Disparidade de acesso entre áreas urbanas (65%) e rurais (22%).", page: "Pág. 24" }
    ]
  },
  {
    type: "topic",
    title: "Desafios Identificados",
    items: [
      { text: "Infraestrutura de distribuição deficiente" },
      { text: "Capacitação técnica insuficiente" },
      { text: "Financiamento limitado para projetos de grande escala" }
    ]
  }
];

// Mock data for context suggestions
const mockContextSuggestions = [
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
  const [activeTab, setActiveTab] = useState("chat");
  const [activeTranscriptionTab, setActiveTranscriptionTab] = useState("all");
  const [searchTranscription, setSearchTranscription] = useState("");

  const { toast } = useToast();

  // Add system messages based on workflow state changes
  useEffect(() => {
    if (workflowState?.step === "type-selection" && !workflowState?.isProcessing) {
      addSystemMessage("Analisei o conteúdo enviado. Que tipo de artigo você gostaria de criar?");
    } else if (workflowState?.step === "title-selection" && !workflowState?.isProcessing) {
      addSystemMessage(`Ótimo! Vamos criar um artigo do tipo ${getArticleTypeName(workflowState?.articleType || '')}. Gerei algumas sugestões de título para você.`);
    } else if (workflowState?.step === "content-editing" && !workflowState?.isProcessing) {
      addSystemMessage("Gerei um rascunho inicial com base no título selecionado. Você pode editar diretamente o conteúdo ou solicitar ajustes específicos.");
      
      // Switch to Organization tab to show transcriptions
      setActiveTab("organization");
    }
  }, [workflowState?.step, workflowState?.isProcessing]);

  // Update the getArticleTypeName function to handle both string and object types
  const getArticleTypeName = (typeId: string | ArticleTypeObject): string => {
    if (typeof typeId === 'object' && typeId !== null) {
      return typeId.label || typeId.id;
    }
    
    const types: Record<string, string> = {
      "news": "Notícia",
      "report": "Reportagem",
      "opinion": "Opinião",
      "chronicle": "Crónica",
      "press-release": "Comunicado",
      "editorial": "Editorial",
      "event-report": "Relatório de Evento"
    };
    return types[typeId as string] || typeId as string;
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

    // Simulated AI response
    let responseContent = "Estou analisando sua solicitação...";
    
    if (message.toLowerCase().includes("título")) {
      responseContent = "Posso ajudar a criar um título mais impactante. Você prefere um título mais direto ou mais criativo?";
    } else if (message.toLowerCase().includes("imagem") || message.toLowerCase().includes("foto")) {
      responseContent = "Posso sugerir algumas imagens para ilustrar o artigo. Qual o tema principal que você gostaria de destacar?";
    } else {
      responseContent = "Compreendi sua solicitação. Vou processar isso e atualizar o conteúdo do artigo em instantes.";
    }

    await simulateTyping(responseContent);
  };

  const addSystemMessage = async (content: string) => {
    await simulateTyping(content);
  };

  const handleFileAttach = () => {
    toast({
      title: "Anexo",
      description: "Funcionalidade de anexo de arquivo demonstrativa"
    });
  };

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

  const handleAction = (messageId: string, accept: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, needsAction: false } : msg
    ));
    
    toast({
      title: accept ? "Sugestão aceita" : "Sugestão rejeitada",
      description: accept ? "A sugestão foi aplicada ao seu artigo." : "A sugestão foi desconsiderada.",
    });
  };

  const handleUseSuggestion = (suggestion: any) => {
    toast({
      title: "Sugestão aplicada",
      description: "A informação foi adicionada ao seu artigo."
    });
    
    // In a real implementation, we would update the article content through onWorkflowUpdate
    if (onWorkflowUpdate && typeof onWorkflowUpdate === 'function') {
      // This is just a simulation - in reality you'd modify the content in a more structured way
      onWorkflowUpdate({
        content: (workflowState?.content || '') + `\n\n${suggestion.excerpt} (${suggestion.source})`
      });
    }
  };

  const handleUseCitation = (text: string, source: string) => {
    toast({
      title: "Citação adicionada",
      description: "A citação foi inserida no artigo"
    });
    
    // Notify parent component that we want to add this citation to the article
    if (workflowState?.step === 'content-editing' && onWorkflowUpdate && typeof onWorkflowUpdate === 'function') {
      // This should be implemented in the ArticleWorkspace component
      // For now we just show a toast notification
      toast({
        title: "Citação adicionada",
        description: `"${text}" - ${source}`
      });
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
  
  const filteredTranscriptionBlocks = () => {
    if (!searchTranscription) return mockTranscriptionBlocks;
    
    const searchLower = searchTranscription.toLowerCase();
    
    return mockTranscriptionBlocks
      .map(block => {
        // Filter items within each block that match the search
        const filteredItems = block.items.filter(item => 
          item.text.toLowerCase().includes(searchLower)
        );
        
        // Only return blocks that have matching items
        if (filteredItems.length > 0) {
          return { ...block, items: filteredItems };
        }
        return null;
      })
      .filter(Boolean); // Remove null blocks
  };

  const renderTranscriptionBlocks = () => {
    const blocks = filteredTranscriptionBlocks();
    const filteredBlocks = activeTranscriptionTab === "all" 
      ? blocks
      : blocks.filter(block => {
          if (activeTranscriptionTab === "speakers") return block.type === "speaker";
          if (activeTranscriptionTab === "sources") return block.type === "source";
          if (activeTranscriptionTab === "topics") return block.type === "topic";
          return true;
        });

    if (filteredBlocks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mb-2 opacity-30" />
          <p>Nenhuma transcrição encontrada</p>
          {searchTranscription && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2"
              onClick={() => setSearchTranscription("")}
            >
              Limpar pesquisa
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4 pt-1">
        {filteredBlocks.map((block, blockIndex) => (
          <div key={blockIndex} className="border rounded-md overflow-hidden bg-card">
            <div className="bg-muted/30 p-2 border-b flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">{block.title}</h3>
                <div className="text-xs text-muted-foreground">
                  {block.type === "speaker" && "Transcrição de Fala"}
                  {block.type === "source" && "Documento Fonte"}
                  {block.type === "topic" && "Tópico Identificado"}
                </div>
              </div>
              {block.type === "speaker" && (
                <Badge variant="outline" className="text-xs">Audio</Badge>
              )}
              {block.type === "source" && (
                <Badge variant="outline" className="text-xs">PDF</Badge>
              )}
            </div>
            <div className="divide-y">
              {block.items.map((item, itemIndex) => (
                <div key={itemIndex} className="p-2.5 hover:bg-muted/20 group transition-colors">
                  <div className="text-sm py-1 flex justify-between items-start">
                    <div className="flex-1">
                      {searchTranscription ? (
                        <div dangerouslySetInnerHTML={{ 
                          __html: item.text.replace(
                            new RegExp(searchTranscription, 'gi'), 
                            match => `<mark class="bg-yellow-200 text-yellow-900">${match}</mark>`
                          ) 
                        }} />
                      ) : (
                        item.text
                      )}
                    </div>
                    {(item.time || item.page) && (
                      <div className="text-xs text-muted-foreground ml-2 mt-1 flex-shrink-0">
                        {item.time || item.page}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-1 mt-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-7 px-2.5 gap-1.5 text-xs hover:bg-primary/10 hover:text-primary"
                      onClick={() => handleUseCitation(item.text, block.title)}
                    >
                      <Check className="h-3.5 w-3.5" />
                      Usar como citação
                    </Button>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2.5 gap-1.5 text-xs hover:bg-primary/10 hover:text-primary"
                      onClick={() => handleUseCitation(item.text, block.title)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copiar texto
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 text-sm"
          onClick={handleShowMoreTranscriptions}
        >
          Mostrar mais transcrições
        </Button>
      </div>
    );
  };

  const renderContextSuggestions = () => {
    return (
      <div className="space-y-4">
        {mockContextSuggestions.map((suggestion, index) => (
          <div key={index} className="border rounded-md overflow-hidden bg-card hover:border-primary/30 transition-colors">
            <div className="bg-muted/30 p-2 border-b">
              <h3 className="font-medium text-sm">{suggestion.title}</h3>
              <div className="text-xs text-muted-foreground">{suggestion.source}</div>
            </div>
            <div className="p-3">
              <p className="text-sm mb-2">{suggestion.excerpt}</p>
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => handleUseCitation(suggestion.excerpt, suggestion.source)}
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Citar
                </Button>
                <Button 
                  size="sm" 
                  variant="default"
                  className="text-xs h-7"
                  onClick={() => handleUseSuggestion(suggestion)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Usar no Artigo
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const handleNewChat = () => {
    // Limpar mensagens
    setMessages([{
      id: Date.now().toString(),
      content: "Nova conversa iniciada. Como posso ajudar?",
      isUser: false,
      timestamp: new Date(),
      type: "agent"
    }]);
    
    toast({
      title: "Nova conversa",
      description: "Uma nova conversa foi iniciada"
    });
  };
  
  const handleHistory = () => {
    // Em uma implementação real, isso carregaria conversar anteriores
    toast({
      title: "Histórico de conversas",
      description: "Funcionalidade de histórico em desenvolvimento"
    });
  };
  
  const handleSettings = () => {
    // Em uma implementação real, isso abriria configurações
    toast({
      title: "Configurações do assistente",
      description: "Funcionalidade de configurações em desenvolvimento"
    });
  };

  return (
    <div className="h-full flex flex-col">
      <AssistantNavigation 
        onNewChat={handleNewChat}
        onHistory={handleHistory}
        onSettings={handleSettings}
      />
      
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
            <ScrollArea className="flex-1">
              <div className="space-y-2.5 p-3">
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

            <div className="flex flex-col gap-2 p-3 border-t mt-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <MessageTypeSelector selected={messageType} onSelect={setMessageType} />
              
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:bg-primary/5 text-muted-foreground hover:text-foreground"
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
                  className="flex-1 text-sm h-8 bg-card border-border/30 focus-visible:ring-0 focus-visible:border-border/50 disabled:opacity-50"
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
                      className="h-8 w-8 hover:bg-primary/5 text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Enviar mensagem</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent 
            value="organization" 
            className="absolute inset-0 m-0 data-[state=active]:flex flex-col"
          >
            <div className="flex-shrink-0 p-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <Input 
                placeholder="Pesquisar nas transcrições..." 
                value={searchTranscription}
                onChange={e => setSearchTranscription(e.target.value)}
                className="mb-2"
              />
              
              <Tabs value={activeTranscriptionTab} onValueChange={setActiveTranscriptionTab}>
                <TabsList className="w-full border-b rounded-none justify-start px-0">
                  <TabsTrigger value="all" className="text-xs">Tudo</TabsTrigger>
                  <TabsTrigger value="speakers" className="text-xs">Oradores</TabsTrigger>
                  <TabsTrigger value="sources" className="text-xs">Fontes</TabsTrigger>
                  <TabsTrigger value="topics" className="text-xs">Tópicos</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-3">
                {filteredTranscriptionBlocks().map((block, blockIndex) => (
                  <div key={blockIndex} className="border rounded-md overflow-hidden bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
                    <div className="bg-muted/20 p-2 border-b flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-sm">{block.title}</h3>
                        <div className="text-xs text-muted-foreground">
                          {block.type === "speaker" && "Transcrição de Fala"}
                          {block.type === "source" && "Documento Fonte"}
                          {block.type === "topic" && "Tópico Identificado"}
                        </div>
                      </div>
                      {block.type === "speaker" && (
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                            onClick={() => alert('Play audio')}
                          >
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                          <Badge variant="outline" className="text-xs">Audio</Badge>
                        </div>
                      )}
                      {block.type === "source" && (
                        <Badge variant="outline" className="text-xs">PDF</Badge>
                      )}
                    </div>
                    <div className="divide-y divide-border/5">
                      {block.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-2.5 hover:bg-muted/10 group transition-colors">
                          <div className="text-sm py-1 flex justify-between items-start">
                            <div className="flex-1">
                              {searchTranscription ? (
                                <div dangerouslySetInnerHTML={{ 
                                  __html: item.text.replace(
                                    new RegExp(searchTranscription, 'gi'), 
                                    match => `<mark class="bg-yellow-200 text-yellow-900">${match}</mark>`
                                  ) 
                                }} />
                              ) : (
                                item.text
                              )}
                            </div>
                            {(item.time || item.page) && (
                              <div className="text-xs text-muted-foreground ml-2 mt-1 flex-shrink-0">
                                {item.time || item.page}
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end gap-1 mt-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-7 px-2.5 gap-1.5 text-xs hover:bg-primary/10 hover:text-primary"
                              onClick={() => handleUseCitation(item.text, block.title)}
                            >
                              <Check className="h-3.5 w-3.5" />
                              Usar como citação
                            </Button>
                            <Button 
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2.5 gap-1.5 text-xs hover:bg-primary/10 hover:text-primary"
                              onClick={() => handleUseCitation(item.text, block.title)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                              Copiar texto
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4 text-sm"
                  onClick={handleShowMoreTranscriptions}
                >
                  Mostrar mais transcrições
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent 
            value="context" 
            className="absolute inset-0 m-0 data-[state=active]:flex flex-col"
          >
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-3">
                {mockContextSuggestions.map((suggestion, index) => (
                  <div key={index} className="border rounded-md overflow-hidden bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 hover:border-primary/30 transition-colors">
                    <div className="bg-muted/20 p-2 border-b">
                      <h3 className="font-medium text-sm">{suggestion.title}</h3>
                      <div className="text-xs text-muted-foreground">{suggestion.source}</div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm mb-2">{suggestion.excerpt}</p>
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => handleUseCitation(suggestion.excerpt, suggestion.source)}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Citar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="default"
                          className="text-xs h-7"
                          onClick={() => handleUseSuggestion(suggestion)}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
                          Usar no Artigo
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

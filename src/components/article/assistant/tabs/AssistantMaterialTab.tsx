
import { useState } from "react";
import { Copy, Check, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TranscriptionBlock } from "../types";

interface AssistantMaterialTabProps {
  transcriptionBlocks: TranscriptionBlock[];
  onUseCitation: (text: string, source: string) => void;
  onShowMore: () => void;
}

export function AssistantMaterialTab({ 
  transcriptionBlocks,
  onUseCitation,
  onShowMore
}: AssistantMaterialTabProps) {
  const [searchTranscription, setSearchTranscription] = useState("");
  const [activeTranscriptionTab, setActiveTranscriptionTab] = useState("all");
  const { toast } = useToast();

  const filteredBlocks = transcriptionBlocks.filter(block => {
    if (!searchTranscription) return true;
    
    const searchLower = searchTranscription.toLowerCase();
    return block.items.some(item => 
      item.text.toLowerCase().includes(searchLower)
    );
  }).filter(block => {
    if (activeTranscriptionTab === "all") return true;
    if (activeTranscriptionTab === "speakers") return block.type === "speaker";
    if (activeTranscriptionTab === "sources") return block.type === "source";
    if (activeTranscriptionTab === "topics") return block.type === "topic";
    return true;
  });

  const handlePlayAudio = (blockId: string) => {
    toast({
      title: "Reproduzindo áudio",
      description: "Funcionalidade de reprodução de áudio demonstrativa"
    });
  };

  return (
    <div className="flex flex-col h-full">
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
          {filteredBlocks.map((block, blockIndex) => (
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
                      onClick={() => handlePlayAudio(block.id)}
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
                        onClick={() => onUseCitation(item.text, block.title)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Usar como citação
                      </Button>
                      <Button 
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2.5 gap-1.5 text-xs hover:bg-primary/10 hover:text-primary"
                        onClick={() => onUseCitation(item.text, block.title)}
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
            onClick={onShowMore}
          >
            Mostrar mais transcrições
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}

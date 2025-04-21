
import { MainLayout } from "@/components/layout/MainLayout";
import { useState } from "react";
import { Mic, Upload, Globe, Headphones, Search, MoreHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function CreateArticlePage() {
  const [inputValue, setInputValue] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    
    setIsProcessing(true);
    // Simulating AI response
    setTimeout(() => {
      setAiResponse(`AI generated content based on: "${inputValue}"`);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Input Area */}
          <div className="max-w-2xl mx-auto w-full mb-6">
            <div className="mb-4">
              <Textarea 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escreva algo..."
                className="resize-none min-h-[60px] bg-[#111111]/20 border-border/30 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full bg-muted/20 hover:bg-muted/30 border border-border/30">
                  <Upload size={18} />
                  <span className="sr-only">Upload</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full bg-muted/20 hover:bg-muted/30 border border-border/30">
                  <Globe size={18} />
                  <span className="sr-only">Links</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full bg-muted/20 hover:bg-muted/30 border border-border/30">
                  <Headphones size={18} />
                  <span className="sr-only">Audio</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full bg-muted/20 hover:bg-muted/30 border border-border/30">
                  <Search size={18} />
                  <span className="sr-only">Deep Research</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full bg-muted/20 hover:bg-muted/30 border border-border/30">
                  <MoreHorizontal size={18} />
                  <span className="sr-only">More options</span>
                </Button>
              </div>
              
              <Button 
                onClick={handleSubmit}
                className="rounded-full bg-primary hover:bg-primary-dark"
                disabled={isProcessing}
              >
                <Mic size={18} className="mr-2" />
                {isProcessing ? "Processando..." : "Gerar"}
              </Button>
            </div>
          </div>
          
          {/* Composition Area */}
          <div 
            className={cn(
              "min-h-[200px] border border-border/30 rounded-lg p-4 bg-[#111111]/20 transition-all duration-300 mb-6",
              aiResponse ? "opacity-100" : "opacity-70"
            )}
          >
            {aiResponse ? (
              <div className="prose prose-invert max-w-none">
                <p>{aiResponse}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>O conteúdo gerado pela IA aparecerá aqui</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="w-full md:w-[30%] flex flex-col">
          <div className="border border-border/30 rounded-lg bg-[#111111]/20 h-[calc(100vh-12rem)]">
            <Tabs defaultValue="transcription" className="h-full flex flex-col">
              <TabsList className="justify-start rounded-none border-b border-border/20 p-0 h-12">
                <TabsTrigger value="transcription" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-white h-full">
                  Transcrição
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-white h-full">
                  Sugestões
                </TabsTrigger>
                <TabsTrigger value="sources" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-white h-full">
                  Fontes
                </TabsTrigger>
                <TabsTrigger value="info" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-white h-full">
                  Info
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-1">
                <TabsContent value="transcription" className="p-4 m-0 h-full">
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      A transcrição em tempo real aparecerá aqui quando você gravar áudio ou carregar arquivos.
                    </p>
                    {/* Example time-marked transcripts */}
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-muted-foreground">00:00</div>
                        <div className="text-sm">Amostra de transcrição de áudio.</div>
                      </div>
                      <Separator className="bg-border/20" />
                      <div>
                        <div className="text-xs text-muted-foreground">00:15</div>
                        <div className="text-sm">Continue a transcrição aqui com timestamp.</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="suggestions" className="p-4 m-0 h-full">
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Sugestões da IA para melhorar seu conteúdo.
                    </p>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Títulos Sugeridos</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="bg-muted/10 p-2 rounded">"Título sugestivo principal"</li>
                        <li className="bg-muted/10 p-2 rounded">"Alternativa de título impactante"</li>
                      </ul>
                    </div>
                    <Separator className="bg-border/20" />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Estrutura Narrativa</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>Sugestões para organização do conteúdo em seções.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sources" className="p-4 m-0 h-full">
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Fontes e arquivos utilizados neste projeto.
                    </p>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Arquivos</h3>
                      <div className="text-sm">Nenhum arquivo carregado</div>
                    </div>
                    <Separator className="bg-border/20" />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Links</h3>
                      <div className="text-sm">Nenhum link adicionado</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="info" className="p-4 m-0 h-full">
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Informações complementares e estatísticas.
                    </p>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Estatísticas</h3>
                      <ul className="space-y-1 text-sm">
                        <li>Palavras: 0</li>
                        <li>Tempo estimado de leitura: 0 min</li>
                      </ul>
                    </div>
                    <Separator className="bg-border/20" />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Análise de Sentimento</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>Disponível após a geração do conteúdo</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

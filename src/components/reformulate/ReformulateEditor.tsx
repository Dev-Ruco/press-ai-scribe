
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { EditorActionButtons } from "./editor/EditorActionButtons";
import { EditorContent } from "./editor/EditorContent";
import { EditorFooter } from "./editor/EditorFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticlePreview } from "./preview/ArticlePreview";
import { useToast } from "@/hooks/use-toast";
import { cleanMarkers } from "@/lib/textUtils";

interface ReformulateEditorProps {
  onSave?: (data: {
    title: string;
    content: string;
    status: 'Rascunho' | 'Pendente' | 'Publicado';
    type?: string;
  }) => Promise<any>;
  onGenerateTest?: () => Promise<any>;
  isSaving?: boolean;
}

export function ReformulateEditor({ onSave, onGenerateTest, isSaving = false }: ReformulateEditorProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasLineNumbers, setHasLineNumbers] = useState(true);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const { user } = useAuth();
  const { toast } = useToast();

  const handleReformulate = async () => {
    if (!content.trim()) {
      toast({
        title: "Conteúdo vazio",
        description: "Digite ou cole algum conteúdo para reformular."
      });
      return;
    }
    
    setIsGenerating(true);
    toast({
      title: "Reformulando conteúdo",
      description: "Aguarde enquanto processamos seu texto..."
    });
    
    // Simular processamento de IA com limpeza robusta de marcadores
    const originalContent = cleanMarkers(content);
    setContent("Processando conteúdo...");
    
    setTimeout(() => {
      // Lógica de reformulação mais sofisticada com melhor tratamento de parágrafos
      const paragraphs = originalContent.split("\n\n").filter(p => p.trim());
      const reformulatedParagraphs = paragraphs.map((paragraph) => {
        // Lógica de reformulação mais sofisticada
        return paragraph
          .replace(/muito/g, "extremamente")
          .replace(/bom/g, "excelente")
          .replace(/ruim/g, "inadequado")
          .replace(/grande/g, "substancial")
          .replace(/pequeno/g, "reduzido")
          .replace(/importante/g, "fundamental")
          .replace(/difícil/g, "desafiador")
          .replace(/problema/g, "questão")
          .replace(/fazer/g, "realizar")
          .replace(/mudança/g, "transformação");
      });
      
      const reformulatedContent = reformulatedParagraphs.join("\n\n");
      setContent(reformulatedContent);
      setIsGenerating(false);
      
      toast({
        title: "Reformulação concluída",
        description: "Seu conteúdo foi reformulado com sucesso."
      });
    }, 2000);
  };

  const handleSaveArticle = async (status: 'Rascunho' | 'Pendente' | 'Publicado') => {
    if (!onSave) return;
    
    // Limpar o conteúdo antes de salvar usando a função utilitária
    const cleanedContent = cleanMarkers(content);
    
    if (!cleanedContent) {
      toast({
        title: "Conteúdo vazio",
        description: "Adicione conteúdo antes de salvar.",
        variant: "destructive"
      });
      return;
    }
    
    let finalTitle = title.trim();
    if (!finalTitle) {
      const firstLine = cleanedContent.split('\n')[0];
      finalTitle = firstLine.length > 50 ? 
        firstLine.substring(0, 50) + '...' : 
        firstLine;
    }
    
    try {
      await onSave({
        title: finalTitle,
        content: cleanedContent,
        status
      });
      
      toast({
        title: "Artigo salvo",
        description: status === 'Publicado' 
          ? "Seu artigo foi publicado com sucesso!" 
          : `Artigo salvo como ${status.toLowerCase()}.`
      });
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o artigo.",
        variant: "destructive"
      });
    }
  };

  const contentStats = {
    lines: content.split('\n').length,
    characters: content.length
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do artigo (opcional)"
              className="text-lg font-semibold font-playfair bg-transparent border-0 border-b border-transparent focus:border-border/30 rounded-none px-0 focus-visible:ring-0 w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "edit" | "preview")}>
              <TabsList>
                <TabsTrigger value="edit">Editar</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <EditorActionButtons
              onReformulate={handleReformulate}
              onSave={handleSaveArticle}
              onGenerateTest={onGenerateTest}
              isGenerating={isGenerating}
              isSaving={isSaving}
              hasContent={!!content.trim()}
              showUserActions={!!user}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 relative overflow-auto">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="edit" className="h-full m-0">
            <EditorContent
              content={content}
              onChange={setContent}
              isExpanded={isExpanded}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => {
                if (!content) {
                  setIsExpanded(false);
                }
              }}
              hasLineNumbers={hasLineNumbers}
            />
          </TabsContent>
          
          <TabsContent value="preview" className="h-full m-0 bg-white overflow-auto">
            <ArticlePreview 
              content={content}
              title={title} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="p-0">
        <EditorFooter
          hasLineNumbers={hasLineNumbers}
          onToggleLineNumbers={() => setHasLineNumbers(!hasLineNumbers)}
          contentStats={contentStats}
        />
      </CardFooter>
    </Card>
  );
}

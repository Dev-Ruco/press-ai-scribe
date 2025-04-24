
import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { EditorActionButtons } from "./editor/EditorActionButtons";
import { EditorContent } from "./editor/EditorContent";
import { EditorFooter } from "./editor/EditorFooter";

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
  const { user } = useAuth();

  const handleReformulate = async () => {
    if (!content.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing
    const originalContent = content;
    setContent("Processando conteúdo...");
    
    setTimeout(() => {
      // Simulate reformulated content without $2 markers
      const lines = originalContent.split("\n");
      const reformulatedContent = lines.map((line) => {
        // Simple reformulation for demo purposes, without adding $2 markers
        return line
          .replace(/\$2/g, "") // Remove any existing $2 markers
          .replace(/muito/g, "extremamente")
          .replace(/bom/g, "excelente")
          .replace(/ruim/g, "inadequado")
          .replace(/grande/g, "substancial");
      }).join("\n");
      
      setContent(reformulatedContent);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSaveArticle = async (status: 'Rascunho' | 'Pendente' | 'Publicado') => {
    if (!onSave) return;
    
    // Clean up any $2 markers before saving
    const cleanContent = content.replace(/\$2/g, "");
    
    if (!title.trim()) {
      const generatedTitle = cleanContent.trim().split('\n')[0].slice(0, 50) + 
        (cleanContent.trim().split('\n')[0].length > 50 ? '...' : '');
      await onSave({
        title: generatedTitle,
        content: cleanContent,
        status
      });
    } else {
      await onSave({
        title,
        content: cleanContent,
        status
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
              className="text-lg font-semibold bg-transparent border-0 border-b border-transparent focus:border-border/30 rounded-none px-0 focus-visible:ring-0 w-full"
            />
          </div>
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
      </CardHeader>
      <CardContent className="flex-1 p-0 relative overflow-auto">
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

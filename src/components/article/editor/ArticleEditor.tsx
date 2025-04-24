import { useRef, useEffect, useState } from "react";
import { calculateReadingTime } from "@/lib/textUtils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Send, Save, FileEdit, MessageSquare, Eye } from "lucide-react";

interface ArticleEditorProps {
  content: string;
  onChange: (content: string) => void;
  showLineNumbers: boolean;
  articleType: {
    id: string;
    label: string;
    structure: string[];
  };
}

export function ArticleEditor({
  content,
  onChange,
  showLineNumbers,
  articleType
}: ArticleEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sections, setSections] = useState<{ name: string; line: number; }[]>([]);
  const [focusedLine, setFocusedLine] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<{ line: number; text: string } | null>(null);
  
  // Detect structure sections in content
  useEffect(() => {
    if (!content) return;
    
    const lines = content.split('\n');
    const detectedSections = [];
    
    lines.forEach((line, index) => {
      // Detect headers (# and ##)
      if (line.startsWith('# ')) {
        detectedSections.push({ name: 'Título', line: index + 1 });
      } else if (line.startsWith('## ')) {
        const sectionName = line.substring(3);
        detectedSections.push({ name: sectionName, line: index + 1 });
      }
    });
    
    setSections(detectedSections);
  }, [content]);
  
  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(500, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);
  
  // Word count and statistics
  const contentStats = {
    characters: content.length,
    words: content.split(/\s+/).filter(w => w.trim() !== '').length,
    lines: content.split('\n').length
  };
  
  const readingTime = calculateReadingTime(contentStats.words.toString());
  
  // Function to determine section badge color based on section name
  const getSectionColor = (sectionName: string) => {
    const lowerName = sectionName.toLowerCase();
    if (lowerName === 'título') return 'bg-blue-100 text-blue-800';
    if (lowerName.includes('conclus')) return 'bg-purple-100 text-purple-800';
    if (lowerName.includes('contexto') || lowerName.includes('introdução')) return 'bg-green-100 text-green-800';
    if (lowerName.includes('argumen')) return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-800';
  };
  
  // Handle content change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  
  // Track cursor position to determine the current line
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    const cursorPosition = textarea.selectionStart;
    
    // Calculate line number based on cursor position
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const currentLine = (textBeforeCursor.match(/\n/g) || []).length + 1;
    setFocusedLine(currentLine);
    
    // Clear suggestions after a delay (simulates AI assistant interaction)
    if (suggestions) {
      setTimeout(() => setSuggestions(null), 5000);
    }
  };
  
  // Simulate assistant providing suggestions (this would be connected to the real assistant)
  useEffect(() => {
    if (focusedLine && focusedLine > 3 && Math.random() > 0.7) {
      // Simulate assistant making a suggestion about the current section
      const nearestSection = sections
        .filter(s => s.line <= focusedLine)
        .sort((a, b) => b.line - a.line)[0];
      
      if (nearestSection) {
        const suggestionTexts = [
          `Considere adicionar mais detalhes nesta seção de ${nearestSection.name}.`,
          `Esta parte poderia se beneficiar de uma citação ou estatística.`,
          `O tom está adequado para um artigo do tipo ${articleType.label}.`
        ];
        
        setTimeout(() => {
          setSuggestions({
            line: focusedLine,
            text: suggestionTexts[Math.floor(Math.random() * suggestionTexts.length)]
          });
        }, 2000);
      }
    }
  }, [focusedLine, sections, articleType]);
  
  // Calculate line heights for proper line number alignment
  const lineHeights = content ? 
    content
      .split('\n')
      .map((line) => Math.ceil((line.length / (textareaRef.current?.clientWidth || 80) * 16) / 24) || 1) 
    : [];
  
  return (
    <div className="relative border rounded-md bg-white overflow-hidden min-h-[500px] flex flex-col">
      {/* Stats Header */}
      <div className="p-3 bg-slate-50 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-primary/5 font-medium font-sans text-sm">
            {articleType.label}
          </Badge>
          
          <div className="flex gap-3 text-xs text-muted-foreground font-sans">
            <span className="flex items-center gap-1">
              <span className="font-medium">{contentStats.words}</span> palavras
            </span>
            <span className="flex items-center gap-1">
              <span className="font-medium">{contentStats.characters}</span> caracteres
            </span>
            <span className="flex items-center gap-1">
              <span className="font-medium">{readingTime}</span> min leitura
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {showLineNumbers && (
          <div className="bg-slate-50/50 text-slate-400 text-right pt-4 pb-4 border-r select-none min-w-[48px] font-sans">
            {content.split('\n').map((_, index) => {
              const lineNumber = index + 1;
              const section = sections.find(s => s.line === lineNumber);
              
              return (
                <div 
                  key={index} 
                  className={`px-2 flex items-center justify-end h-6 ${
                    focusedLine === lineNumber ? 'bg-primary/5 text-primary' : ''
                  }`}
                >
                  <div className="flex items-center">
                    {section && (
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        getSectionColor(section.name).split(' ')[0].replace('bg-', 'bg-')
                      }`} />
                    )}
                    <span className="text-xs tabular-nums">{lineNumber}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onSelect={handleSelect}
          onFocus={handleSelect}
          className="flex-1 p-6 resize-none outline-none border-0 font-playfair text-lg leading-relaxed selection:bg-primary/10"
          style={{
            fontFamily: "'Playfair Display', serif",
            lineHeight: "1.8",
            fontSize: "18px",
            color: "#1a1a1a"
          }}
        />
      </div>
    </div>
  );
}


import { useRef, useEffect, useState } from "react";
import { calculateReadingTime } from "@/lib/textUtils";
import { Badge } from "@/components/ui/badge";

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
      <div className="p-2 bg-muted/30 border-b flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="px-2 py-0.5 bg-primary/10 rounded-full flex items-center gap-1">
          <span className="font-medium">{contentStats.words}</span> palavras
        </span>
        <span className="px-2 py-0.5 bg-primary/10 rounded-full flex items-center gap-1">
          <span className="font-medium">{contentStats.characters}</span> caracteres
        </span>
        <span className="px-2 py-0.5 bg-primary/10 rounded-full flex items-center gap-1">
          <span className="font-medium">{contentStats.lines}</span> linhas
        </span>
        <span className="px-2 py-0.5 bg-primary/10 rounded-full flex items-center gap-1">
          <span className="font-medium">~{readingTime}</span> min leitura
        </span>
        
        {articleType.id === 'news' && (
          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full ml-auto">
            Ideal: 300-500 palavras
          </span>
        )}
        {articleType.id === 'report' && (
          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full ml-auto">
            Ideal: 800-1500 palavras
          </span>
        )}
        {articleType.id === 'opinion' && (
          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full ml-auto">
            Ideal: 600-800 palavras
          </span>
        )}
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {showLineNumbers && (
          <div className="bg-slate-50 text-slate-500 text-right pt-4 pb-4 border-r select-none min-w-[48px]">
            {content.split('\n').map((_, index) => {
              const lineNumber = index + 1;
              const section = sections.find(s => s.line === lineNumber);
              
              return (
                <div 
                  key={index} 
                  className={`px-2 flex items-center justify-end h-6 ${focusedLine === lineNumber ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <div className="flex items-center">
                    {section && (
                      <div className={`w-2 h-2 rounded-full mr-1 ${getSectionColor(section.name).split(' ')[0].replace('bg-', 'bg-')}`} />
                    )}
                    <span className="text-xs">{lineNumber}</span>
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
          className="flex-1 p-4 resize-none outline-none border-0 font-playfair text-base leading-normal"
          style={{
            fontFamily: "'Playfair Display', serif",
            lineHeight: 1.6
          }}
        />
        
        {/* Section markers */}
        {showLineNumbers && sections.length > 0 && (
          <div className="absolute left-12 top-12 opacity-60 pointer-events-none flex flex-col gap-1">
            {sections.map((section, index) => (
              <Badge
                key={index}
                className={`${getSectionColor(section.name)} transition-opacity duration-300 whitespace-nowrap text-xs translate-y-${(section.line - 1) * 6}`}
                style={{ 
                  position: 'absolute', 
                  top: `${(section.line - 1) * 24}px`,
                  opacity: focusedLine && Math.abs(focusedLine - section.line) < 3 ? 1 : 0.4
                }}
              >
                {section.name}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Assistant suggestions */}
        {suggestions && (
          <div 
            className="absolute right-4 animate-fade-in bg-blue-50 border border-blue-200 p-3 rounded-lg shadow-sm max-w-[300px]"
            style={{ top: `${(suggestions.line * 24) + 80}px` }}
          >
            <div className="text-xs text-blue-600 font-semibold mb-1">Sugestão do assistente:</div>
            <p className="text-sm text-blue-800">{suggestions.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}


import { useRef, useEffect, useState } from "react";
import { calculateReadingTime } from "@/lib/textUtils";
import { EditorHeader } from "./components/EditorHeader";
import { LineNumbers } from "./components/LineNumbers";
import "./styles.css";

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
  
  const contentStats = {
    characters: content.length,
    words: content.split(/\s+/).filter(w => w.trim() !== '').length,
    lines: content.split('\n').length
  };
  
  // Fix: Convert the number to string before passing to calculateReadingTime
  const readingTime = calculateReadingTime(contentStats.words.toString());
  
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

  return (
    <div className="article-editor">
      <EditorHeader 
        articleType={articleType}
        stats={contentStats}
        readingTime={readingTime}
      />

      <div className="flex flex-1 overflow-hidden">
        {showLineNumbers && (
          <LineNumbers
            content={content}
            focusedLine={focusedLine}
            sections={sections}
            getSectionColor={getSectionColor}
          />
        )}
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onSelect={handleSelect}
          onFocus={handleSelect}
          className="editor-content"
        />
      </div>
    </div>
  );
}

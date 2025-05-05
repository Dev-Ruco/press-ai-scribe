
import { useState, useRef, useEffect } from "react";

interface ArticleTextAreaProps {
  content: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ArticleTextArea({ content, onChange, disabled }: ArticleTextAreaProps) {
  const [expandedInput, setExpandedInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (!textareaRef.current) return;

    // Reset height first to get the correct scrollHeight
    textareaRef.current.style.height = "auto";
    
    // Get window height and calculate max height (70% of viewport)
    const windowHeight = window.innerHeight;
    const maxHeight = Math.round(windowHeight * 0.7);
    
    // Set new height based on content
    const scrollHeight = textareaRef.current.scrollHeight;
    const newHeight = Math.min(Math.max(80, scrollHeight), maxHeight);
    
    textareaRef.current.style.height = `${newHeight}px`;
    
    // Add scrollbar if content exceeds max height
    if (scrollHeight > maxHeight) {
      textareaRef.current.style.overflowY = "auto";
    } else {
      textareaRef.current.style.overflowY = "hidden";
    }
  }, [content, expandedInput]);

  // Respond to window resize
  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current && content) {
        // Recalculate height on window resize
        const windowHeight = window.innerHeight;
        const maxHeight = Math.round(windowHeight * 0.7);
        const scrollHeight = textareaRef.current.scrollHeight;
        const newHeight = Math.min(Math.max(80, scrollHeight), maxHeight);
        
        textareaRef.current.style.height = `${newHeight}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [content]);
  
  // Handle A4-like proportions (optionally)
  const handlePaste = (e: React.ClipboardEvent) => {
    // If pasting a large amount of text, automatically expand
    if (e.clipboardData.getData('text').length > 100) {
      setExpandedInput(true);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <textarea
        ref={textareaRef}
        className="flex-1 w-full px-4 py-4 bg-transparent border-none text-base placeholder:text-muted-foreground focus:outline-none resize-none transition-all duration-300"
        placeholder="Escreva algo ou use os comandos abaixo..."
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setExpandedInput(true)}
        onBlur={() => {
          if (!content) setExpandedInput(false);
        }}
        onPaste={handlePaste}
        disabled={disabled}
        style={{
          minHeight: '80px',
          transition: 'height 0.2s ease'
        }}
      />
      
      {/* Character count display when expanded */}
      {expandedInput && content && (
        <div className="absolute bottom-2 right-4 text-xs text-muted-foreground">
          {content.length} caracteres | {content.split(/\s+/).filter(Boolean).length} palavras
        </div>
      )}
    </div>
  );
}

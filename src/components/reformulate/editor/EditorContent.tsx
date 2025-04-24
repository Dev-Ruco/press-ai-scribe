
import { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface EditorContentProps {
  content: string;
  onChange: (value: string) => void;
  isExpanded: boolean;
  onFocus: () => void;
  onBlur: () => void;
  hasLineNumbers: boolean;
}

export function EditorContent({
  content,
  onChange,
  isExpanded,
  onFocus,
  onBlur,
  hasLineNumbers
}: EditorContentProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Detect paragraphs and enhance formatting on content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight = window.innerHeight * 0.7;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [content, isExpanded]);
  
  // Cleanup markers and format text on input
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Clean all $2 markers for display and storage
    const cleanedContent = value.replace(/\$2\s*/g, "");
    
    // Format paragraphs with proper spacing
    onChange(cleanedContent);
  };

  return (
    <div className="relative">
      {hasLineNumbers && (
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/20 border-r border-border/20">
          <div className="absolute left-0 top-0 pr-3 text-right text-xs text-muted-foreground select-none">
            {content.split('\n').map((_, i) => (
              <div key={i} className="h-6">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        placeholder="Cole ou digite o conteúdo que deseja reformular..."
        className={`h-full min-h-[500px] rounded-none border-0 resize-none focus-visible:ring-0 transition-all pr-4 font-serif ${hasLineNumbers ? 'pl-12' : 'pl-4'}`}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          height: isExpanded ? `${Math.min(textareaRef.current?.scrollHeight || 500, window.innerHeight * 0.7)}px` : '500px',
          lineHeight: "1.6"
        }}
      />
    </div>
  );
}


import { useState, useRef, useEffect } from "react";

interface ArticleTextAreaProps {
  content: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ArticleTextArea({ content, onChange, disabled }: ArticleTextAreaProps) {
  const [expandedInput, setExpandedInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(
        textareaRef.current.scrollHeight,
        window.innerHeight * 0.7
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [content, expandedInput]);

  return (
    <textarea
      ref={textareaRef}
      className="flex-1 px-4 py-4 bg-transparent border-none text-base placeholder:text-muted-foreground focus:outline-none resize-none transition-all duration-300"
      placeholder="Escreva algo ou use os comandos abaixo..."
      value={content}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setExpandedInput(true)}
      onBlur={() => {
        if (!content) setExpandedInput(false);
      }}
      style={{ height: expandedInput ? textareaRef.current?.scrollHeight + "px" : "auto" }}
      disabled={disabled}
    />
  );
}

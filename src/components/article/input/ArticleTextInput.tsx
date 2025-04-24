
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ArticleInputControls } from "./ArticleInputControls";

interface ArticleTextInputProps {
  content: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  expandedInput: boolean;
  setExpandedInput: (expanded: boolean) => void;
  isProcessing: boolean;
  files: File[];
  onFileUpload: (files: FileList) => void;
  setFiles: (updateFn: (prevFiles: File[]) => File[]) => void;
  onLinkSubmit: (url: string) => void;
  onGenerateTest: () => void;
}

export function ArticleTextInput({
  content,
  onChange,
  onSubmit,
  expandedInput,
  setExpandedInput,
  isProcessing,
  files,
  onFileUpload,
  setFiles,
  onLinkSubmit,
  onGenerateTest
}: ArticleTextInputProps) {
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
    <div className="relative flex flex-col border border-border/40 rounded-2xl shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/30">
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
        style={{
          height: expandedInput ? textareaRef.current?.scrollHeight + "px" : "auto"
        }}
        disabled={isProcessing}
      />
      
      <div className="flex items-center justify-between p-2 border-t border-border/40">
        <ArticleInputControls
          onFileUpload={onFileUpload}
          onRecordingComplete={(file) => setFiles(prev => [...prev, file])}
          onLinkSubmit={onLinkSubmit}
          onGenerateTest={onGenerateTest}
          isProcessing={isProcessing}
        />

        <Button
          variant="default"
          onClick={onSubmit}
          disabled={(!content && files.length === 0) || isProcessing}
          className="h-9 px-4 rounded-full bg-primary hover:bg-primary/90"
        >
          {isProcessing ? (
            <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Enviar
        </Button>
      </div>
    </div>
  );
}


import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileUploadButton } from "./file-upload/FileUploadButton";
import { VoiceRecordButton } from "./voice/VoiceRecordButton";
import { LinkInputButton } from "./link/LinkInputButton";
import { FilePreview } from "./file-upload/FilePreview";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file
const ALLOWED_FILE_TYPES = [
  'text/plain',
  'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
  'text/html',
  'text/rtf',
  'application/rtf',
  'audio/wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/webm',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  '.doc',
  '.docx',
  '.pdf',
  '.txt',
  '.md',
  '.rtf',
  '.wav',
  '.mp3'
];

export function CreateArticleInput({ onWorkflowUpdate }) {
  const [content, setContent] = useState("");
  const [expandedInput, setExpandedInput] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(
        textareaRef.current.scrollHeight,
        window.innerHeight * 0.7
      );
      textareaRef.current.style.height = newHeight + "px";
      setTextareaHeight(newHeight + "px");
    }
  }, [content, expandedInput]);

  const handleFileUpload = (uploadedFiles: FileList) => {
    const newFiles = Array.from(uploadedFiles).filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 50MB.`
        });
        return false;
      }
      
      if (!ALLOWED_FILE_TYPES.some(type => 
        file.type.includes(type) || type.includes(file.type)
      )) {
        toast({
          variant: "destructive",
          title: "Tipo de arquivo não suportado",
          description: `${file.name} não é um tipo de arquivo suportado.`
        });
        return false;
      }
      
      return true;
    });

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      
      toast({
        title: "Arquivos adicionados",
        description: `${newFiles.length} arquivo(s) adicionado(s) com sucesso.`
      });
    }
  };

  const handleLinkSubmit = (url: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Link processado",
        description: "Conteúdo do link sendo analisado..."
      });
      
      setContent(prev => {
        const linkAddition = `Analisando conteúdo do link: ${url}\n\nProcessando...`;
        return prev ? prev + '\n\n' + linkAddition : linkAddition;
      });
      
      setShowPreview(true);
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!content && files.length === 0) {
      toast({
        variant: "destructive",
        title: "Entrada necessária",
        description: "Por favor, digite algo ou anexe arquivos."
      });
      return;
    }

    setIsProcessing(true);
    
    setContent(prev => {
      const processingMessage = `${prev ? prev + '\n\n' : ''}Processando conteúdo...
      
${files.map(file => `Analisando "${file.name}"...
- Tipo: ${file.type}
- Tamanho: ${(file.size / 1024).toFixed(1)}KB
`).join('\n')}

Gerando insights...`;
      return processingMessage;
    });
    
    setTimeout(() => {
      setIsProcessing(false);
      onWorkflowUpdate({ 
        step: "type-selection", 
        isProcessing: true,
        files: files,
        content: content
      });
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {showPreview && files.length > 0 && (
        <FilePreview 
          files={files} 
          onRemove={(index) => {
            setFiles(prev => {
              const newFiles = [...prev];
              newFiles.splice(index, 1);
              return newFiles;
            });
          }} 
        />
      )}

      <div className="relative">
        <div className="relative flex flex-col border border-border/40 rounded-2xl shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/30 transition-all hover:border-border/60">
          <textarea
            ref={textareaRef}
            className={`flex-1 px-4 py-4 bg-transparent border-none text-base placeholder:text-muted-foreground focus:outline-none resize-none min-h-[100px] transition-all duration-300 ${expandedInput ? 'h-auto max-h-[70vh]' : ''}`}
            placeholder="Escreva algo ou use os comandos abaixo..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (e.target.value) setShowPreview(true);
            }}
            onFocus={() => {
              setShowPreview(true);
              setExpandedInput(true);
            }}
            onBlur={() => {
              if (!content) {
                setExpandedInput(false);
              }
            }}
            style={{ height: expandedInput ? textareaHeight : 'auto' }}
          />
          
          <div className="flex items-center justify-between p-2 border-t border-border/40">
            <div className="flex items-center gap-1 px-2">
              <FileUploadButton 
                onFileUpload={handleFileUpload}
                allowedFileTypes={ALLOWED_FILE_TYPES}
              />
              <VoiceRecordButton 
                onRecordingComplete={(file) => setFiles(prev => [...prev, file])}
                onError={(message) => {
                  toast({
                    variant: "destructive",
                    title: "Erro na gravação",
                    description: message
                  });
                }}
              />
              <LinkInputButton onLinkSubmit={handleLinkSubmit} />
            </div>

            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={isProcessing}
              className="h-9 px-4 rounded-full bg-primary hover:bg-primary/90 transition-colors"
            >
              {isProcessing ? (
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

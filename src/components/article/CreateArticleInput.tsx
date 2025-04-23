
import { useState, useRef, useEffect } from "react";
import { Paperclip, Send, Upload, Mic, Link2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
  const [showPreview, setShowPreview] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const [isLinkActive, setIsLinkActive] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkProcessing, setIsLinkProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      setTextareaHeight(textareaRef.current.scrollHeight + "px");
    }
  }, [content]);

  // Timer for recording
  useEffect(() => {
    let interval: number | undefined;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return;
    }

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
      setShowPreview(true);
      
      toast({
        title: "Arquivos adicionados",
        description: `${newFiles.length} arquivo(s) adicionado(s) com sucesso.`
      });

      // Simulate processing for demo
      simulateProcessing();
    }
    
    // Reset the file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    
    if (files.length <= 1 && !content && !linkUrl) {
      setShowPreview(false);
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
          setFiles(prev => [...prev, audioFile]);
          setShowPreview(true);
          
          toast({
            title: "Gravação concluída",
            description: `Áudio de ${recordingTime} segundos adicionado.`
          });

          // Simulate processing for demo
          simulateProcessing();
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
        
        toast({
          title: "Gravando áudio",
          description: "Clique novamente para parar a gravação."
        });
      } else {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gravar",
        description: "Não foi possível acessar o microfone."
      });
    }
  };

  const handleLinkToggle = () => {
    setIsLinkActive(true);
    setTimeout(() => {
      const linkInput = document.getElementById("link-input");
      if (linkInput) (linkInput as HTMLInputElement).focus();
    }, 100);
  };

  const handleLinkSubmit = () => {
    if (!linkUrl.trim()) return;
    
    setIsLinkProcessing(true);
    
    // Simulação de processamento
    setTimeout(() => {
      setIsLinkProcessing(false);
      toast({
        title: "Link processado",
        description: "Conteúdo do link sendo analisado..."
      });
      
      // Para demo, vamos apenas fingir que o link foi processado
      setShowPreview(true);
      
      // Simulate processing for demo
      simulateProcessing(linkUrl);
    }, 1500);
  };

  const handleCancelLink = () => {
    setIsLinkActive(false);
    setLinkUrl("");
  };

  const simulateProcessing = (processedLink = "") => {
    if (content || files.length > 0 || processedLink) {
      setContent(prev => {
        const simulatedContent = `${prev ? prev + '\n\n' : ''}Processando conteúdo...
        
${files.map(file => `Analisando "${file.name}"...
- Tipo: ${file.type}
- Tamanho: ${(file.size / 1024).toFixed(1)}KB
`).join('\n')}

${processedLink ? `Analisando conteúdo do link: ${processedLink}\n` : ''}

Gerando insights...`;
        return simulatedContent;
      });
    }
  };

  const handleSubmit = () => {
    if (!content && files.length === 0 && !linkUrl) {
      toast({
        variant: "destructive",
        title: "Entrada necessária",
        description: "Por favor, digite algo ou anexe arquivos."
      });
      return;
    }

    // Start workflow by moving to type-selection step
    onWorkflowUpdate({ 
      step: "type-selection", 
      isProcessing: true,
      files: files,
      content: content
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {showPreview && (
        <div className="mb-4 animate-fade-in">
          <div className="min-h-[200px] p-6 bg-background/50 border border-border/40 rounded-xl shadow-sm">
            {files.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Arquivos anexados:</h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-sm p-3 bg-muted/20 rounded-lg group"
                    >
                      <Paperclip className="h-4 w-4 text-primary" />
                      <span className="flex-1 truncate">{file.name}</span>
                      <span className="text-muted-foreground mr-2">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {content && (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm">{content}</pre>
              </div>
            )}
            {!content && !files.length && (
              <p className="text-muted-foreground text-sm">
                O conteúdo gerado aparecerá aqui...
              </p>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <div className="relative flex flex-col border border-border/40 rounded-2xl shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/30 transition-all hover:border-border/60">
          {isLinkActive && (
            <div className="p-3 border-b border-border/40 bg-muted/20">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary flex-shrink-0" />
                <input
                  id="link-input"
                  type="url"
                  className="flex-1 px-3 py-2 text-sm bg-background/50 border border-border/40 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Cole o link do YouTube, TikTok, site de notícias, etc..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLinkSubmit();
                    }
                  }}
                  disabled={isLinkProcessing}
                />
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 px-2 text-xs"
                    onClick={handleCancelLink}
                    disabled={isLinkProcessing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 flex items-center gap-1.5"
                    onClick={handleLinkSubmit}
                    disabled={!linkUrl.trim() || isLinkProcessing}
                  >
                    {isLinkProcessing ? (
                      <div className="h-3.5 w-3.5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    <span>Processar</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <textarea
            ref={textareaRef}
            className="flex-1 px-4 py-4 bg-transparent border-none text-base placeholder:text-muted-foreground focus:outline-none resize-none min-h-[100px]"
            placeholder="Escreva algo ou use os comandos abaixo..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (e.target.value) setShowPreview(true);
            }}
            onFocus={() => setShowPreview(true)}
            style={{ height: textareaHeight }}
          />
          
          <div className="flex items-center justify-between p-2 border-t border-border/40">
            <div className="flex items-center gap-1 px-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileUpload}
                accept={ALLOWED_FILE_TYPES.join(',')}
              />
              
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                onClick={handleUploadButtonClick}
                title="Carregar arquivos"
              >
                <Upload className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-full transition-colors ${
                  isRecording 
                    ? "text-red-500 hover:text-red-600 hover:bg-red-50 animate-pulse" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                onClick={toggleRecording}
                title={isRecording ? "Parar gravação" : "Gravar áudio"}
              >
                <Mic className="h-4 w-4" />
                {isRecording && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1">
                    {recordingTime}s
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                onClick={handleLinkToggle}
                title="Importar por link"
                disabled={isLinkActive}
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="default"
              onClick={handleSubmit}
              className="h-9 px-4 rounded-full bg-primary hover:bg-primary/90 transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

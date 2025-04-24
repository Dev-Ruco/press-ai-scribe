
import { useState, useRef, useEffect } from "react";
import { 
  Paperclip, Send, Upload, Mic, Link2, X, Check, 
  FileText, File, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const [isLinkActive, setIsLinkActive] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkProcessing, setIsLinkProcessing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Adjust textarea height based on content
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
      
      toast({
        title: "Arquivos adicionados",
        description: `${newFiles.length} arquivo(s) adicionado(s) com sucesso.`
      });
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
          
          toast({
            title: "Gravação concluída",
            description: `Áudio de ${recordingTime} segundos adicionado.`
          });
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
    
    // Check if URL is valid
    try {
      new URL(linkUrl);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "URL inválido",
        description: "Por favor, digite um URL válido."
      });
      setIsLinkProcessing(false);
      return;
    }
    
    // Process the URL
    setTimeout(() => {
      setIsLinkProcessing(false);
      toast({
        title: "Link processado",
        description: "Conteúdo do link sendo analisado..."
      });
      
      // For demo, we'll just add the link to the content
      setContent(prev => {
        const linkAddition = `Analisando conteúdo do link: ${linkUrl}\n\nProcessando...`;
        return prev ? prev + '\n\n' + linkAddition : linkAddition;
      });
      
      setShowPreview(true);
      setIsLinkActive(false);
    }, 1500);
  };

  const handleCancelLink = () => {
    setIsLinkActive(false);
    setLinkUrl("");
  };

  const handleSubmit = async () => {
    if (!content && files.length === 0 && !linkUrl) {
      toast({
        variant: "destructive",
        title: "Entrada necessária",
        description: "Por favor, digite algo ou anexe arquivos."
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setContent(prev => {
      const processingMessage = `${prev ? prev + '\n\n' : ''}Processando conteúdo...
      
${files.map(file => `Analisando "${file.name}"...
- Tipo: ${file.type}
- Tamanho: ${(file.size / 1024).toFixed(1)}KB
`).join('\n')}

Gerando insights...`;
      return processingMessage;
    });
    
    // Simulate a delay before updating workflow
    setTimeout(() => {
      setIsProcessing(false);
      
      // Start workflow by moving to type-selection step
      onWorkflowUpdate({ 
        step: "type-selection", 
        isProcessing: true,
        files: files,
        content: content
      });
    }, 2000);
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('audio')) {
      return <Mic className="h-4 w-4 text-primary" />;
    } else if (file.type.includes('pdf')) {
      return <FileText className="h-4 w-4 text-primary" />;
    } else if (file.type.includes('image')) {
      return <FileText className="h-4 w-4 text-primary" />;
    } else if (file.type.includes('video')) {
      return <FileText className="h-4 w-4 text-primary" />;
    } else {
      return <File className="h-4 w-4 text-primary" />;
    }
  };

  // Get file thumbnail for preview
  const getFileThumbnail = (file: File) => {
    if (file.type.includes('image')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="max-w-3xl mx-auto">
      {showPreview && files.length > 0 && (
        <div className="mb-4 animate-fade-in">
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file, index) => {
              const thumbnail = getFileThumbnail(file);
              return (
                <div 
                  key={index}
                  className="relative group border border-border/40 rounded-md overflow-hidden bg-muted/20"
                >
                  {thumbnail ? (
                    <div className="relative h-20 w-20">
                      <img 
                        src={thumbnail} 
                        alt={file.name} 
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-6 w-6 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2 pr-8 h-10 w-32">
                      {getFileIcon(file)}
                      <span className="text-xs truncate flex-1">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
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
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileUpload}
                accept={ALLOWED_FILE_TYPES.join(',')}
              />
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                      onClick={handleUploadButtonClick}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Carregar arquivos</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 rounded-full transition-colors ${
                        isRecording 
                          ? "text-red-500 hover:text-red-600 hover:bg-red-50 animate-pulse" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      }`}
                      onClick={toggleRecording}
                    >
                      <Mic className="h-4 w-4" />
                      {isRecording && (
                        <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1">
                          {recordingTime}s
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isRecording ? "Parar gravação" : "Gravar áudio"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                      onClick={handleLinkToggle}
                      disabled={isLinkActive}
                    >
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Importar por link</TooltipContent>
                </Tooltip>
              </TooltipProvider>
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

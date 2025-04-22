
import { useState, useRef, useEffect } from "react";
import { Paperclip, Send, Upload, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function CreateArticleInput() {
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

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
    console.log("Files selected:", uploadedFiles);
    
    if (!uploadedFiles || uploadedFiles.length === 0) {
      console.log("No files were selected");
      return;
    }

    const newFiles = Array.from(uploadedFiles).filter(file => {
      console.log("Processing file:", file.name, file.type, file.size);
      
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
      console.log("Adding files:", newFiles);
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

  const handleUploadButtonClick = () => {
    // This ensures the file input is clicked when the button is clicked
    if (fileInputRef.current) {
      console.log("Upload button clicked, triggering file input");
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

  const simulateProcessing = () => {
    if (content || files.length > 0) {
      setContent(prev => {
        const simulatedContent = `${prev ? prev + '\n\n' : ''}Processando conteúdo...
        
${files.map(file => `Analisando "${file.name}"...
- Tipo: ${file.type}
- Tamanho: ${(file.size / 1024).toFixed(1)}KB
`).join('\n')}

Gerando insights...`;
        return simulatedContent;
      });
    }
  };

  const handleSubmit = () => {
    if (!content && files.length === 0) {
      toast({
        variant: "destructive",
        title: "Entrada necessária",
        description: "Por favor, digite algo ou anexe arquivos."
      });
      return;
    }

    // Simulate processing
    simulateProcessing();
    
    console.log("Submitting:", { content, files });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {showPreview && (
        <div className="mb-4 animate-fade-in">
          <div className="min-h-[200px] p-4 bg-background/50 border border-border/40 rounded-xl">
            {files.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Arquivos anexados:</h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-sm p-2 bg-muted/20 rounded-lg"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span className="flex-1 truncate">{file.name}</span>
                      <span className="text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {content && (
              <div className="prose prose-sm max-w-none prose-invert">
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
        <div className="relative flex items-center gap-2 p-2 bg-background/50 border border-border/40 rounded-2xl shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/30">
          <input
            className="flex-1 px-4 py-3 bg-transparent border-none text-base placeholder:text-muted-foreground focus:outline-none"
            placeholder="Escreva algo ou use os comandos abaixo..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (e.target.value) setShowPreview(true);
            }}
            onFocus={() => setShowPreview(true)}
          />
          
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
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
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
                  ? "text-red-500 hover:text-red-600 animate-pulse" 
                  : "text-muted-foreground hover:text-foreground"
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

            <div className="w-[1px] h-6 mx-2 bg-border/40" />
            
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
              onClick={handleSubmit}
              title="Enviar"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

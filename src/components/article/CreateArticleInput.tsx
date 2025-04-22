
import { useState, useRef } from "react";
import { Paperclip, Send, Upload } from "lucide-react";
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
  '.doc',
  '.docx',
  '.pdf',
  '.txt',
  '.md',
  '.rtf'
];

export function CreateArticleInput() {
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

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
    // Handle submission logic here
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
            />
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>

            <div className="w-[1px] h-6 mx-2 bg-border/40" />
            
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

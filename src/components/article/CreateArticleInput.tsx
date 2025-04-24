
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileUploadButton } from "./file-upload/FileUploadButton";
import { VoiceRecordButton } from "./voice/VoiceRecordButton";
import { LinkInputButton } from "./link/LinkInputButton";
import { FilePreview } from "./file-upload/FilePreview";
import { ArticleChatArea } from "./chat/ArticleChatArea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuthForAction } from "@/hooks/useRequireAuthForAction";
import { AuthPrompt } from "@/components/auth/AuthPrompt";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export function CreateArticleInput({ onWorkflowUpdate }) {
  const [content, setContent] = useState("");
  const [expandedInput, setExpandedInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showArticleOptions, setShowArticleOptions] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { gate, promptOpen, setPromptOpen } = useRequireAuthForAction();

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

  const handleFileUpload = (uploadedFiles: FileList) => {
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
      
      addMessage(`Analisando conteúdo do link: ${url}`, true);
      
      // Simulate processing
      const typingId = addMessage("Processando link...", false, true);
      
      setTimeout(() => {
        // Remove typing message
        setMessages(prev => prev.filter(m => m.id !== typingId));
        
        // Add response message
        addMessage(`O link ${url} foi analisado com sucesso. O conteúdo será incorporado ao seu artigo.`, false);
      }, 2000);
    }, 1500);
  };

  const addMessage = (content: string, isUser: boolean, isTyping = false) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
      isTyping
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const handleGenerateTest = () => {
    gate(async () => {
      setIsProcessing(true);
      const typingId = addMessage("Gerando artigo de teste...", false, true);

      try {
        const { data, error } = await supabase.rpc('simulate_article', {
          for_user_id: user.id
        });

        if (error) throw error;

        setMessages(prev => prev.filter(m => m.id !== typingId));
        addMessage("Artigo de teste gerado com sucesso! Você pode encontrá-lo na seção 'Meus Artigos'.", false);
        
        toast({
          title: "Sucesso",
          description: "Artigo de teste gerado e salvo como rascunho"
        });
      } catch (error) {
        console.error("Error generating test article:", error);
        setMessages(prev => prev.filter(m => m.id !== typingId));
        addMessage("Desculpe, não foi possível gerar o artigo de teste.", false);
        
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível gerar o artigo de teste"
        });
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleSave = async (status: 'Rascunho' | 'Pendente' | 'Publicado') => {
    gate(async () => {
      if (!content && messages.length === 0) {
        toast({
          variant: "destructive",
          title: "Conteúdo necessário",
          description: "Digite algo antes de salvar."
        });
        return;
      }

      setIsProcessing(true);
      
      try {
        // Compile content from messages
        const compiledContent = messages
          .filter(m => !m.isTyping && m.isUser)
          .map(m => m.content)
          .join("\n\n");
        
        // Generate title from first line of content
        const title = compiledContent.split('\n')[0].substring(0, 100) || 
                     content.split('\n')[0].substring(0, 100) || 
                     "Novo artigo";
        
        const { data, error } = await supabase
          .from('articles')
          .insert([
            {
              user_id: user.id,
              title,
              content: compiledContent || content,
              status
            }
          ])
          .select();

        if (error) {
          console.error("Error details:", error);
          throw error;
        }

        toast({
          title: "Artigo salvo",
          description: `Artigo salvo como "${status}"`
        });
        
        // Add confirmation message
        addMessage(`Artigo salvo com sucesso como "${status}"`, false);
        
        // Reset content if saved successfully
        if (status === 'Publicado') {
          setContent("");
          setFiles([]);
          setShowArticleOptions(false);
        }
        
      } catch (error: any) {
        console.error("Error saving article:", error);
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: error.message || "Não foi possível salvar o artigo"
        });
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleSubmit = async () => {
    if (!content && files.length === 0) {
      toast({
        variant: "destructive",
        title: "Entrada necessária",
        description: "Digite algo ou anexe arquivos."
      });
      return;
    }

    setIsProcessing(true);
    addMessage(content, true);
    const typingId = addMessage("Analisando sua solicitação...", false, true);

    // Simulate processing delay
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== typingId));
      addMessage("Compreendi sua solicitação. Como posso ajudar a desenvolver este tópico?", false);
      setIsProcessing(false);
      setContent("");
      
      // Mostrar opções de artigo após a resposta inicial
      if (messages.length > 0) {
        setShowArticleOptions(true);
      }
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <AuthPrompt isOpen={promptOpen} onClose={() => setPromptOpen(false)} />
      
      <ArticleChatArea 
        messages={messages} 
        className="flex-1 min-h-[200px] max-h-[60vh]"
      />

      {files.length > 0 && (
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
        <div className="relative flex flex-col border border-border/40 rounded-2xl shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/30">
          <textarea
            ref={textareaRef}
            className="flex-1 px-4 py-4 bg-transparent border-none text-base placeholder:text-muted-foreground focus:outline-none resize-none transition-all duration-300"
            placeholder="Escreva algo ou use os comandos abaixo..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setExpandedInput(true)}
            onBlur={() => {
              if (!content) setExpandedInput(false);
            }}
            style={{ height: expandedInput ? textareaRef.current?.scrollHeight + "px" : "auto" }}
            disabled={isProcessing}
          />
          
          <div className="flex items-center justify-between p-2 border-t border-border/40">
            <div className="flex items-center gap-1 px-2">
              <FileUploadButton 
                onFileUpload={handleFileUpload}
                allowedFileTypes={[
                  'text/*',
                  'image/*',
                  'video/*',
                  'audio/*',
                  'application/pdf',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ]}
                isDisabled={isProcessing}
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
              
              <div className="ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateTest}
                  disabled={isProcessing}
                  className="text-xs"
                >
                  Gerar artigo de teste
                </Button>
              </div>
            </div>

            <Button
              variant="default"
              onClick={handleSubmit}
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
      </div>
      
      {/* Opções de artigo exibidas apenas após geração de conteúdo */}
      {showArticleOptions && messages.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-end mt-4 border-t pt-4">
          <Button
            variant="outline" 
            size="sm"
            onClick={() => handleSave('Rascunho')}
            disabled={isProcessing}
            className="text-sm"
          >
            Salvar como rascunho
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave('Pendente')}
            disabled={isProcessing}
            className="text-sm"
          >
            Marcar como pendente
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => handleSave('Publicado')}
            disabled={isProcessing}
            className="text-sm"
          >
            Publicar
          </Button>
        </div>
      )}
    </div>
  );
}

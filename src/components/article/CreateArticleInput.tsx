import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { FilePreview } from "./file-upload/FilePreview";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ArticleTextArea } from "./input/ArticleTextArea";
import { InputActionButtons } from "./input/InputActionButtons";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useArticleSubmission } from "@/hooks/useArticleSubmission";

interface SavedLink {
  url: string;
  id: string;
}

export function CreateArticleInput({ onWorkflowUpdate }) {
  const [content, setContent] = useState("");
  const [savedLinks, setSavedLinks] = useState<SavedLink[]>([]);
  const { files, handleFileUpload, removeFile } = useFileUpload();
  const { submitArticle, isSubmitting } = useArticleSubmission();
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    authDialogOpen, 
    setAuthDialogOpen, 
    requireAuth 
  } = useProgressiveAuth();
  
  const handleFileUploadWrapper = (uploadedFiles: FileList | File[]) => {
    const fileArray = Array.isArray(uploadedFiles) 
      ? uploadedFiles 
      : Array.from(uploadedFiles);
    
    handleFileUpload(fileArray);
  };

  const handleLinkSubmit = async (url: string) => {
    // Apenas guarda o link sem processar
    const newLink: SavedLink = {
      url,
      id: crypto.randomUUID()
    };
    
    setSavedLinks(prev => [...prev, newLink]);
    
    toast({
      title: "Link guardado",
      description: "O link será processado quando você enviar o artigo."
    });
  };

  const handleSubmit = () => {
    if (!content && files.length === 0 && savedLinks.length === 0) {
      toast({
        variant: "destructive",
        title: "Entrada necessária",
        description: "Digite algo, anexe arquivos ou adicione links."
      });
      return;
    }

    requireAuth(async () => {
      // Agora processa tudo junto: conteúdo, arquivos e links
      await submitArticle(content, files);
      if (onWorkflowUpdate) {
        onWorkflowUpdate({ 
          step: "type-selection", 
          isProcessing: true,
          files: files,
          content: content,
          links: savedLinks
        });
      }
      setContent("");
      setSavedLinks([]);
    });
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      {files.length > 0 && (
        <FilePreview 
          files={files} 
          onRemove={removeFile}
        />
      )}

      <div className="relative">
        <div className="relative flex flex-col border border-border/40 rounded-2xl shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/30">
          <ArticleTextArea
            content={content}
            onChange={setContent}
            disabled={isSubmitting}
          />
          
          <InputActionButtons
            onFileUpload={handleFileUploadWrapper}
            onLinkSubmit={handleLinkSubmit}
            onRecordingComplete={(file) => handleFileUploadWrapper([file])}
            onRecordingError={(message) => {
              toast({
                variant: "destructive",
                title: "Erro na gravação",
                description: message
              });
            }}
            onSubmit={handleSubmit}
            isProcessing={isSubmitting}
            showGenerateTest={false}
            disabled={!content && files.length === 0}
            onGenerateTest={() => {}} // Adding an empty function to satisfy the type requirement
          />
        </div>
      </div>
      
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
      />
    </div>
  );
}

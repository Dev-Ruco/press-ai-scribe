
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { FilePreview } from "./file-upload/FilePreview";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ArticleTextArea } from "./input/ArticleTextArea";
import { InputActionButtons } from "./input/InputActionButtons";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { AuthDialog } from "@/components/auth/AuthDialog";

export function CreateArticleInput({ onWorkflowUpdate }) {
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { files, handleFileUpload, removeFile } = useFileUpload();
  
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

  const handleLinkSubmit = (url: string) => {
    requireAuth(() => {
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
      }, 1500);
    });
  };

  const handleSubmit = () => {
    if (!content && files.length === 0) {
      toast({
        variant: "destructive",
        title: "Entrada necessária",
        description: "Digite algo ou anexe arquivos."
      });
      return;
    }

    requireAuth(() => {
      setIsProcessing(true);

      setTimeout(() => {
        setIsProcessing(false);
        
        onWorkflowUpdate({ 
          step: "type-selection", 
          isProcessing: true,
          files: files,
          content: content
        });
        
        setContent("");
      }, 2000);
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
            disabled={isProcessing}
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
            isProcessing={isProcessing}
            showGenerateTest={false}
            disabled={!content && files.length === 0}
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


import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { FilePreview } from "./file-upload/FilePreview";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ArticleTextArea } from "./input/ArticleTextArea";
import { InputActionButtons } from "./input/InputActionButtons";
import { supabase } from "@/integrations/supabase/client";
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
    // Ensure conversion to array if FileList
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

  const handleGenerateTest = async () => {
    requireAuth(async () => {
      setIsProcessing(true);

      try {
        const { data, error } = await supabase.rpc('simulate_article', {
          for_user_id: user.id
        });

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Artigo de teste gerado e salvo como rascunho"
        });
      } catch (error) {
        console.error("Error generating test article:", error);
        
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
            onGenerateTest={handleGenerateTest}
            onSubmit={handleSubmit}
            isProcessing={isProcessing}
            showGenerateTest={true}
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

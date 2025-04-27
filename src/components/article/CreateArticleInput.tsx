import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { FilePreview } from "./file-upload/FilePreview";
import { LinkPreview } from "./link/LinkPreview";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { files, handleFileUpload, removeFile } = useFileUpload();
  const { submitArticle } = useArticleSubmission();
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    authDialogOpen, 
    setAuthDialogOpen, 
    requireAuth 
  } = useProgressiveAuth();

  const handleFileUploadWrapper = (uploadedFiles: FileList | File[]) => {
    console.log("File upload triggered:", uploadedFiles);
    const fileArray = Array.isArray(uploadedFiles) 
      ? uploadedFiles 
      : Array.from(uploadedFiles);
    
    console.log("Processing files:", fileArray.map(f => ({ name: f.name, type: f.type, size: f.size })));
    handleFileUpload(fileArray);
  };

  const handleLinkSubmit = async (url: string) => {
    console.log("Link submitted:", url);
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

  const removeLink = (id: string) => {
    console.log("Removing link with ID:", id);
    setSavedLinks(prev => prev.filter(link => link.id !== id));
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

    console.log("Submitting article with:", { 
      contentLength: content.length, 
      filesCount: files.length, 
      linksCount: savedLinks.length 
    });

    requireAuth(async () => {
      console.log("User authenticated, proceeding with submission");
      setIsSubmitting(true);
      
      try {
        await submitArticle(content, files, savedLinks);
        
        console.log("Article submitted, now updating workflow state");
        if (onWorkflowUpdate) {
          onWorkflowUpdate({ 
            isProcessing: true,
            files: files,
            content: content,
            links: savedLinks,
            agentConfirmed: false // Will be set to true after webhook response
          });
        }
        
        // We'll keep the content in the input until we confirm the agent has processed it
        // This gives us a better UX as the user can see their content is being processed
      } catch (error) {
        console.error("Error submitting article:", error);
        toast({
          variant: "destructive",
          title: "Erro ao enviar",
          description: "Ocorreu um erro ao processar seu artigo. Por favor, tente novamente."
        });
        setIsSubmitting(false);
      }
    });
  };

  const hasValidContent = content.trim().length > 0 || files.length > 0 || savedLinks.length > 0;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      {(files.length > 0 || savedLinks.length > 0) && (
        <div className="flex flex-col gap-2">
          <FilePreview 
            files={files} 
            onRemove={removeFile}
          />
          <LinkPreview
            links={savedLinks}
            onRemove={removeLink}
          />
        </div>
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
            onRecordingComplete={(file) => {
              console.log("Recording completed:", file.name, file.type, file.size);
              handleFileUploadWrapper([file]);
            }}
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
            disabled={!hasValidContent}
            onGenerateTest={() => {}} 
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

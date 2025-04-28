
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
import { ProcessingOverlay } from "./processing/ProcessingOverlay";
import { ArticleTypeSelect } from "./input/ArticleTypeSelect";
import { ArticleTypeObject } from "@/types/article";

interface SavedLink {
  url: string;
  id: string;
}

const defaultArticleType: ArticleTypeObject = {
  id: "article",
  label: "Artigo",
  structure: ["Introdução", "Desenvolvimento", "Conclusão"]
};

export function CreateArticleInput({ onWorkflowUpdate }) {
  const [content, setContent] = useState("");
  const [savedLinks, setSavedLinks] = useState<SavedLink[]>([]);
  const [articleType, setArticleType] = useState<ArticleTypeObject>(defaultArticleType);
  const { files, handleFileUpload, removeFile } = useFileUpload();
  const { 
    isSubmitting, 
    processingStatus, 
    submitArticle, 
    cancelProcessing 
  } = useArticleSubmission();
  
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

    requireAuth(async () => {
      try {
        onWorkflowUpdate({ 
          isProcessing: true,
          files: files,
          content: content,
          links: savedLinks,
          articleType: articleType,
          agentConfirmed: false,
          processingStage: "uploading",
          processingProgress: 0,
          processingMessage: "Iniciando processamento..."
        });

        const result = await submitArticle(
          content, 
          files, 
          savedLinks,
          () => {
            onWorkflowUpdate({ 
              step: "title-selection",
              files: files,
              content: content,
              links: savedLinks,
              articleType: articleType,
              agentConfirmed: true,
              isProcessing: false,
              processingStage: "completed",
              processingProgress: 100,
              processingMessage: "Processamento concluído!"
            });
          }
        );
        
        if (!result.success) {
          onWorkflowUpdate({ 
            isProcessing: false,
            error: result.status.error,
            processingStage: "error",
            processingProgress: 0,
            processingMessage: "Erro no processamento."
          });
        }
      } catch (error) {
        onWorkflowUpdate({ 
          isProcessing: false,
          error: error.message,
          processingStage: "error",
          processingProgress: 0,
          processingMessage: "Erro durante o envio."
        });
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
          <div className="px-4 pt-4">
            <ArticleTypeSelect
              value={articleType}
              onValueChange={setArticleType}
              disabled={isSubmitting}
            />
          </div>
          
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
            disabled={!hasValidContent}
            onGenerateTest={() => {}} 
          />
        </div>
      </div>
      
      <ProcessingOverlay 
        isVisible={isSubmitting}
        currentStage={processingStatus.stage}
        progress={processingStatus.progress}
        statusMessage={processingStatus.message}
        error={processingStatus.error}
        onCancel={cancelProcessing}
      />
      
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
      />
    </div>
  );
}

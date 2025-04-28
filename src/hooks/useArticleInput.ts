
import { useState } from "react";
import { ArticleTypeObject } from "@/types/article";
import { useToast } from "@/hooks/use-toast";
import { useUploadQueue } from "@/hooks/useUploadQueue";
import { useAuth } from "@/contexts/AuthContext";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { useArticleSubmission } from "@/hooks/useArticleSubmission";

interface SavedLink {
  url: string;
  id: string;
}

const defaultArticleType: ArticleTypeObject = {
  id: "article",
  label: "Artigo",
  structure: ["Introdução", "Desenvolvimento", "Conclusão"]
};

export function useArticleInput({ onWorkflowUpdate }) {
  const [content, setContent] = useState("");
  const [savedLinks, setSavedLinks] = useState<SavedLink[]>([]);
  const [articleType, setArticleType] = useState<ArticleTypeObject>(defaultArticleType);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    authDialogOpen, 
    setAuthDialogOpen, 
    requireAuth 
  } = useProgressiveAuth();

  const { queue, addToQueue, removeFromQueue, isProcessing: isUploading } = useUploadQueue();
  const { 
    isSubmitting, 
    processingStatus, 
    submitArticle, 
    cancelProcessing 
  } = useArticleSubmission();

  const handleFileUpload = (uploadedFiles: FileList | File[]) => {
    console.log("File upload triggered:", uploadedFiles);
    const fileArray = Array.isArray(uploadedFiles) 
      ? uploadedFiles 
      : Array.from(uploadedFiles);
    
    addToQueue(fileArray);
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
    if (!content && queue.length === 0 && savedLinks.length === 0) {
      toast({
        variant: "destructive",
        title: "Entrada necessária",
        description: "Digite algo, anexe arquivos ou adicione links."
      });
      return;
    }

    const completedFiles = queue
      .filter(item => item.status === 'completed')
      .map(item => item.file);

    requireAuth(async () => {
      try {
        onWorkflowUpdate({ 
          isProcessing: true,
          files: completedFiles,
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
          completedFiles, 
          savedLinks,
          () => {
            onWorkflowUpdate({ 
              step: "title-selection",
              files: completedFiles,
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

  const hasValidContent = content.trim().length > 0 || queue.length > 0 || savedLinks.length > 0;
  const hasUploadsInProgress = queue.some(item => item.status === 'uploading');

  return {
    content,
    setContent,
    savedLinks,
    articleType,
    setArticleType,
    queue,
    removeFromQueue,
    handleFileUpload,
    handleLinkSubmit,
    removeLink,
    handleSubmit,
    isSubmitting,
    isUploading,
    processingStatus,
    cancelProcessing,
    authDialogOpen,
    setAuthDialogOpen,
    hasValidContent,
    hasUploadsInProgress
  };
}

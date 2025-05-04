
import { useState } from "react";
import { ProcessingOverlay } from "../processing/ProcessingOverlay";
import { useToast } from "@/hooks/use-toast";
import { submitArticleToN8N, UploadedFile } from "@/utils/articleSubmissionUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";

interface ArticleSubmissionHandlerProps {
  content: string;
  articleType: {
    label: string;
    id: string;
    structure?: string[];
  };
  uploadedFiles: UploadedFile[];
  savedLinks: Array<{ url: string; id: string }>;
  onWorkflowUpdate: (data: any) => void;
  onNextStep: () => void;
  children: (props: { handleSubmit: () => void; isProcessing: boolean }) => React.ReactNode;
}

export function ArticleSubmissionHandler({
  content,
  articleType,
  uploadedFiles,
  savedLinks,
  onWorkflowUpdate,
  onNextStep,
  children
}: ArticleSubmissionHandlerProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<{
    stage: 'uploading' | 'analyzing' | 'completed' | 'error';
    progress: number;
    message: string;
    error?: string;
  }>({
    stage: 'uploading',
    progress: 0,
    message: ''
  });
  
  const { user } = useAuth();
  const { requireAuth } = useProgressiveAuth();

  // Update processing status
  const updateProcessingStatus = (
    stage: 'uploading' | 'analyzing' | 'completed' | 'error',
    progress: number,
    message: string,
    error?: string
  ) => {
    setProcessingStatus({
      stage,
      progress,
      message,
      error
    });
    
    // If completed or error occurred, update isProcessing state
    if (stage === 'completed' || stage === 'error') {
      setTimeout(() => setIsProcessing(false), 1500);
    }
  };

  const handleSubmit = () => {
    const hasContent = content.trim().length > 0;
    const hasFiles = uploadedFiles.length > 0;
    const hasLinks = savedLinks.length > 0;
    
    if (!hasContent && !hasFiles && !hasLinks) {
      toast({
        variant: "destructive",
        title: "Conteúdo vazio",
        description: "Por favor, adicione texto, arquivos ou links antes de enviar."
      });
      return;
    }
    
    // Check for incomplete uploads
    const incompleteUploads = uploadedFiles.filter(file => file.status !== 'completed');
    if (incompleteUploads.length > 0) {
      toast({
        variant: "destructive",
        title: "Uploads em andamento",
        description: `Aguarde a conclusão de ${incompleteUploads.length} upload(s) antes de enviar.`
      });
      return;
    }

    requireAuth(async () => {
      try {
        setIsProcessing(true);
        updateProcessingStatus('uploading', 0, 'Iniciando envio...');
        
        const result = await submitArticleToN8N(
          content,
          articleType.label || "Artigo",
          uploadedFiles,
          savedLinks.map(link => link.url),
          updateProcessingStatus,
          () => {
            // Success callback
            onWorkflowUpdate({
              step: "title-selection",
              content: content,
              links: savedLinks.map(link => link.url),
              files: uploadedFiles,
              articleType: articleType,
              agentConfirmed: true
            });
            
            // Move to next step
            setTimeout(() => {
              onNextStep();
            }, 1500);
          }
        );
        
        if (!result.success) {
          throw new Error(result.status.error || "Falha no envio");
        }
        
      } catch (error) {
        console.error('Error submitting content:', error);
        toast({
          title: "Erro",
          description: error.message || "Ocorreu um erro ao processar sua solicitação",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    });
  };

  return (
    <>
      {children({ 
        handleSubmit, 
        isProcessing 
      })}
      
      {/* Processing overlay */}
      {isProcessing && (
        <ProcessingOverlay
          isVisible={isProcessing}
          currentStage={processingStatus.stage}
          progress={processingStatus.progress}
          statusMessage={processingStatus.message}
          error={processingStatus.error}
          onCancel={() => setIsProcessing(false)}
        />
      )}
    </>
  );
}

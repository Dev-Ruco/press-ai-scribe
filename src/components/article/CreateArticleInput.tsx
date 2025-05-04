
import { ProcessingOverlay } from "./processing/ProcessingOverlay";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ArticleInputContainer } from "./input/ArticleInputContainer";
import { useArticleSession } from "@/hooks/useArticleSession";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { useToast } from "@/hooks/use-toast";
import { N8N_WEBHOOK_URL } from "@/utils/webhook/types";
import { submitArticleToN8N } from '@/utils/articleSubmissionUtils';
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function CreateArticleInput({ onWorkflowUpdate, onNextStep }) {
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
  const [savedLinks, setSavedLinks] = useState<Array<{ url: string; id: string; }>>([]);
  const { user } = useAuth();
  
  const {
    content,
    setContent,
    articleType,
    setArticleType
  } = useArticleSession({ onWorkflowUpdate });

  const { 
    authDialogOpen, 
    setAuthDialogOpen, 
    requireAuth 
  } = useProgressiveAuth();

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
    
    if (!hasContent) {
      toast({
        variant: "destructive",
        title: "Conteúdo vazio",
        description: "Por favor, adicione texto ou arquivos antes de enviar."
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
          [],
          savedLinks.map(link => link.url),
          updateProcessingStatus,
          () => {
            // Success callback
            onWorkflowUpdate({
              step: "title-selection",
              content: content,
              links: savedLinks.map(link => link.url),
              articleType: articleType,
              agentConfirmed: true
            });
            
            // Move to next step
            if (onNextStep) {
              setTimeout(() => {
                onNextStep();
              }, 1500);
            }
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

  // Handler for adding link
  const handleLinkSubmit = (url: string) => {
    const linkId = crypto.randomUUID();
    setSavedLinks(prev => [...prev, { url, id: linkId }]);
  };

  // Handler for removing link
  const handleRemoveLink = (linkId: string) => {
    setSavedLinks(prev => prev.filter(link => link.id !== linkId));
  };

  // Handler for file upload
  const handleFileUpload = (files: FileList | File[]) => {
    console.log("File upload received in CreateArticleInput:", files);
    toast({
      title: "Arquivos recebidos",
      description: `${files.length} arquivo(s) recebido(s). Implementando envio direto para webhook.`
    });
    // Files will be directly handled by webhook instead of uploading to storage
  };

  // Handler for recording completion
  const handleRecordingComplete = (file: File) => {
    // Note: File recording handling logic remains but without upload to storage
    console.log("Recording complete:", file.name);
    toast({
      title: "Gravação finalizada",
      description: "Gravação de áudio concluída."
    });
  };

  return (
    <>
      <div className="space-y-4">
        <ArticleInputContainer
          articleType={articleType}
          onArticleTypeChange={setArticleType}
          content={content}
          onContentChange={setContent}
          onLinkSubmit={handleLinkSubmit}
          onFileUpload={handleFileUpload}
          onSubmit={handleSubmit}
          isProcessing={isProcessing}
          disabled={isProcessing}
          onRecordingComplete={handleRecordingComplete}
          onRecordingError={(msg) => toast({ variant: "destructive", title: "Erro na gravação", description: msg })}
          onNextStep={onNextStep}
        />
        
        {/* Links list */}
        {savedLinks.length > 0 && (
          <div className="mt-4 p-4 border rounded-lg bg-background/50">
            <h3 className="text-lg font-medium mb-2">Links anexados</h3>
            <ul className="space-y-2">
              {savedLinks.map(link => (
                <li key={link.id} className="flex items-center justify-between text-sm border p-2 rounded">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {link.url}
                  </a>
                  <button 
                    onClick={() => handleRemoveLink(link.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
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
      
      {/* Auth dialog */}
      <AuthDialog
        isOpen={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        onSuccess={() => setAuthDialogOpen(false)}
      />
    </>
  );
}

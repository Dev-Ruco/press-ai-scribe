
import { ProcessingOverlay } from "./processing/ProcessingOverlay";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { UploadedContentPreview } from "./input/UploadedContentPreview";
import { ArticleInputContainer } from "./input/ArticleInputContainer";
import { useArticleSession } from "@/hooks/useArticleSession";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { useToast } from "@/hooks/use-toast";
import { N8N_WEBHOOK_URL } from "@/utils/webhookUtils";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Link2 } from "lucide-react";

export function CreateArticleInput({ onWorkflowUpdate }) {
  const { toast } = useToast();
  const [webhookStatus, setWebhookStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  const {
    content,
    setContent,
    articleType,
    setArticleType,
    sessionState,
    addFilesToQueue,
    removeFileFromQueue,
    addLink,
    removeLink,
    processQueue,
    cancelProcessing,
    isProcessing,
    hasValidContent,
    hasUploadsInProgress,
    estimatedTimeRemaining
  } = useArticleSession({ onWorkflowUpdate });

  const { 
    authDialogOpen, 
    setAuthDialogOpen, 
    requireAuth 
  } = useProgressiveAuth();

  // Check webhook connectivity on component mount
  useEffect(() => {
    const checkWebhookStatus = async () => {
      try {
        // Send a simple ping request to check if webhook is accessible
        const response = await fetch(N8N_WEBHOOK_URL, { 
          method: 'HEAD',
          mode: 'no-cors' // This will prevent CORS errors but won't give us status
        });
        
        // If we get here without an error, we assume it's online
        setWebhookStatus('online');
        console.log(`Webhook ${N8N_WEBHOOK_URL} appears to be online`);
      } catch (error) {
        console.warn(`Error checking webhook ${N8N_WEBHOOK_URL} status:`, error);
        // We still set it to online because the no-cors mode might cause the fetch to fail
        // even if the webhook is up (this is just a best-effort check)
        setWebhookStatus('online');
      }
    };
    
    checkWebhookStatus();
  }, []);

  const handleSubmit = () => {
    if (!hasValidContent) {
      return;
    }

    requireAuth(() => {
      try {
        console.log(`Submitting content to webhook: ${N8N_WEBHOOK_URL}`);
        processQueue();
        
        toast({
          title: "Processando",
          description: `Enviando conteúdo para ${N8N_WEBHOOK_URL}...`,
        });
      } catch (error) {
        console.error('Error submitting content:', error);
        toast({
          title: "Error",
          description: `Failed to submit content to the webhook ${N8N_WEBHOOK_URL}. Please try again.`,
          variant: "destructive",
        });
      }
    });
  };

  const formatTimeRemaining = (ms?: number) => {
    if (!ms) return '';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Criar Novo Artigo</h2>
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <Badge variant={webhookStatus === 'online' ? "outline" : "destructive"} className="text-xs">
            {webhookStatus === 'checking' && "Verificando webhook..."}
            {webhookStatus === 'online' && "Webhook conectado"}
            {webhookStatus === 'offline' && "Webhook offline"}
          </Badge>
        </div>
      </div>

      <UploadedContentPreview
        queue={sessionState.files}
        onQueueItemRemove={(file) => removeFileFromQueue(file.id)}
        savedLinks={sessionState.links}
        onLinkRemove={removeLink}
        estimatedTimeRemaining={formatTimeRemaining(estimatedTimeRemaining)}
      />

      <div className="relative">
        <ArticleInputContainer
          articleType={articleType}
          onArticleTypeChange={setArticleType}
          content={content}
          onContentChange={setContent}
          onFileUpload={(files) => {
            // Convert FileList to File array
            const fileArray = Array.isArray(files) 
              ? files 
              : Array.from(files);
            addFilesToQueue(fileArray);
          }}
          onLinkSubmit={addLink}
          onSubmit={handleSubmit}
          isProcessing={isProcessing}
          disabled={!hasValidContent || hasUploadsInProgress}
          onRecordingComplete={(file) => addFilesToQueue([file])}
          onRecordingError={(message) => {
            console.error("Recording error:", message);
          }}
        />
      </div>
      
      <ProcessingOverlay 
        isVisible={isProcessing}
        currentStage={sessionState.processingStage}
        progress={sessionState.processingProgress}
        statusMessage={sessionState.processingMessage}
        error={sessionState.error}
        onCancel={cancelProcessing}
        estimatedTimeRemaining={estimatedTimeRemaining}
        webhookUrl={N8N_WEBHOOK_URL}
      />
      
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
      />
    </div>
  );
}

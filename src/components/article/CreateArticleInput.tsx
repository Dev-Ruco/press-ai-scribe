
import { ProcessingOverlay } from "./processing/ProcessingOverlay";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { UploadedContentPreview } from "./input/UploadedContentPreview";
import { ArticleInputContainer } from "./input/ArticleInputContainer";
import { useArticleSession } from "@/hooks/useArticleSession";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { useToast } from "@/hooks/use-toast";
import { N8N_WEBHOOK_URL } from "@/utils/webhook/types";
import { sendArticleToN8N, uploadFileAndGetUrl } from "@/utils/webhookUtils";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Link2, Upload, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function CreateArticleInput({ onWorkflowUpdate, onNextStep }) {
  const { toast } = useToast();
  const [webhookStatus, setWebhookStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [lastUploadedFile, setLastUploadedFile] = useState<string | null>(null);
  
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

  // Check Supabase connection and authentication on mount
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // Attempt to get the session to check authentication
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error checking Supabase session:", sessionError);
          setSupabaseStatus('error');
          return;
        }
        
        if (!session) {
          console.log("No Supabase session found - user not authenticated");
          setSupabaseStatus('connected'); // Still mark as connected, just not authenticated
        } else {
          console.log("Supabase session found - user is authenticated", session.user.id);
          setSupabaseStatus('connected');
        }
      } catch (error) {
        console.error("Error connecting to Supabase:", error);
        setSupabaseStatus('error');
      }
    };
    
    checkSupabaseConnection();
  }, []);

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

    requireAuth(async () => {
      try {
        console.log(`Submitting content to Supabase and webhook: ${N8N_WEBHOOK_URL}`);
        
        // Marcar como processando
        onWorkflowUpdate({ 
          isProcessing: true,
          processingStage: "uploading",
          processingProgress: 0,
          processingMessage: "Iniciando envio..."
        });
        
        // Preparar os arquivos
        const completedFiles = sessionState.files
          .filter(item => item.status === 'completed')
          .map(item => item.file);
        
        // Primeiro faz upload para Supabase, depois envia para o webhook
        await sendArticleToN8N(
          content, 
          completedFiles, 
          sessionState.links,
          (stage, progress, message, error) => {
            // Atualizar o status de processamento
            onWorkflowUpdate({
              isProcessing: stage !== 'completed' && stage !== 'error',
              processingStage: stage,
              processingProgress: progress,
              processingMessage: message,
              error: error
            });
          },
          () => {
            // Callback de sucesso
            onWorkflowUpdate({ 
              step: "title-selection",
              files: completedFiles,
              content: content,
              links: sessionState.links,
              articleType: articleType,
              agentConfirmed: true,
              isProcessing: false,
              processingStage: "completed",
              processingProgress: 100,
              processingMessage: "Processamento concluído!"
            });
            
            // Avançar para a próxima etapa após sucesso
            if (onNextStep) {
              setTimeout(() => {
                onNextStep();
              }, 1500);
            }
          }
        );
        
        toast({
          title: "Sucesso",
          description: `Conteúdo enviado com sucesso!`,
        });
        
      } catch (error) {
        console.error('Error submitting content:', error);
        
        onWorkflowUpdate({ 
          isProcessing: false,
          error: error.message,
          processingStage: "error",
          processingProgress: 0,
          processingMessage: "Erro no processamento."
        });
        
        toast({
          title: "Erro",
          description: `${error.message}`,
          variant: "destructive",
        });
      }
    });
  };

  // Handle file upload directly to Supabase first
  const handleFileUpload = async (files) => {
    // Convert FileList to File array
    const fileArray = Array.isArray(files) 
      ? files 
      : Array.from(files);
    
    // First check authentication
    requireAuth(async () => {
      try {
        // For the first file, try to upload directly to Supabase as test
        if (fileArray.length > 0) {
          const testFile = fileArray[0];
          
          // Show upload status
          toast({
            title: "Enviando arquivo para Supabase",
            description: `Testando upload com ${testFile.name}...`,
          });
          
          try {
            // Try to upload to Supabase directly first as test
            const url = await uploadFileAndGetUrl(testFile);
            setLastUploadedFile(url);
            
            toast({
              title: "Upload bem-sucedido",
              description: `Arquivo ${testFile.name} enviado para Supabase com sucesso!`,
            });
            
            // After successful test upload, add all files to queue
            addFilesToQueue(fileArray);
          } catch (uploadError) {
            console.error("Error uploading test file to Supabase:", uploadError);
            
            toast({
              title: "Erro no upload",
              description: uploadError.message,
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error("Error in handleFileUpload:", error);
        
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
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
          <div className="flex items-center gap-1 mr-2">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <Badge 
              variant={supabaseStatus === 'connected' ? "outline" : "destructive"} 
              className="text-xs"
            >
              {supabaseStatus === 'checking' && "Verificando Supabase..."}
              {supabaseStatus === 'connected' && "Supabase conectado"}
              {supabaseStatus === 'error' && "Erro na conexão Supabase"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Link2 className="h-4 w-4 text-muted-foreground" />
            <Badge 
              variant={webhookStatus === 'online' ? "outline" : "destructive"} 
              className="text-xs"
            >
              {webhookStatus === 'checking' && "Verificando webhook..."}
              {webhookStatus === 'online' && "Webhook conectado"}
              {webhookStatus === 'offline' && "Webhook offline"}
            </Badge>
          </div>
        </div>
      </div>

      {lastUploadedFile && (
        <div className="bg-green-50 border border-green-200 rounded-md p-2 text-sm flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">
            <div className="bg-green-100 p-1 rounded-full">
              <Upload className="h-3 w-3 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-green-800 font-medium">Último arquivo enviado com sucesso</p>
            <p className="text-green-600 text-xs break-all">{lastUploadedFile}</p>
          </div>
        </div>
      )}

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
          onFileUpload={handleFileUpload}
          onLinkSubmit={addLink}
          onSubmit={handleSubmit}
          isProcessing={isProcessing}
          disabled={!hasValidContent || hasUploadsInProgress}
          onRecordingComplete={(file) => addFilesToQueue([file])}
          onRecordingError={(message) => {
            console.error("Recording error:", message);
          }}
          onNextStep={onNextStep}
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

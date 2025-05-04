
import { ProcessingOverlay } from "./processing/ProcessingOverlay";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ArticleInputContainer } from "./input/ArticleInputContainer";
import { useArticleSession } from "@/hooks/useArticleSession";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { useToast } from "@/hooks/use-toast";
import { N8N_WEBHOOK_URL } from "@/utils/webhook/types";
import { submitArticleToN8N } from '@/utils/articleSubmissionUtils';
import { useState } from "react";
import { FileUploadWithStorage } from "./file-upload/FileUploadWithStorage";
import { UploadedFile } from "@/hooks/useSupabaseStorage";
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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
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

  // Atualizar status de processamento
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
    
    // Se completou ou ocorreu erro, atualizar estado isProcessing
    if (stage === 'completed' || stage === 'error') {
      setTimeout(() => setIsProcessing(false), 1500);
    }
  };

  const handleSubmit = () => {
    const hasContent = content.trim().length > 0 || uploadedFiles.length > 0;
    
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
          uploadedFiles,
          savedLinks.map(link => link.url),
          updateProcessingStatus,
          () => {
            // Callback de sucesso
            onWorkflowUpdate({
              step: "title-selection",
              files: uploadedFiles,
              content: content,
              links: savedLinks.map(link => link.url),
              articleType: articleType,
              agentConfirmed: true
            });
            
            // Avançar para próxima etapa
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

  // Handler para uploads bem-sucedidos
  const handleFileUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  // Handler para remover arquivo
  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Handler para adicionar link
  const handleLinkSubmit = (url: string) => {
    const linkId = crypto.randomUUID();
    setSavedLinks(prev => [...prev, { url, id: linkId }]);
  };

  // Handler para remover link
  const handleRemoveLink = (linkId: string) => {
    setSavedLinks(prev => prev.filter(link => link.id !== linkId));
  };

  // Handler para finalizar gravação
  const handleRecordingComplete = (file: File) => {
    // Com o novo sistema, é necessário fazer upload do arquivo gravado para o Supabase
    requireAuth(async () => {
      try {
        setIsProcessing(true);
        updateProcessingStatus('uploading', 0, `Enviando gravação: ${file.name}...`);
        
        // Simular upload para Supabase (isto seria substituído pelo upload real)
        const newUploadedFile: UploadedFile = {
          id: crypto.randomUUID(),
          url: URL.createObjectURL(file), // Isso seria substituído pela URL real do Supabase
          fileName: file.name,
          mimeType: file.type,
          fileType: 'audio',
          fileSize: file.size,
          status: 'completed',
          progress: 100
        };
        
        setUploadedFiles(prev => [...prev, newUploadedFile]);
        updateProcessingStatus('completed', 100, 'Gravação enviada com sucesso!');
      } catch (error) {
        console.error("Error uploading recording:", error);
        updateProcessingStatus('error', 0, 'Erro ao enviar gravação', error.message);
      } finally {
        setIsProcessing(false);
      }
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
          onFileUpload={() => {}} // Vamos usar nosso novo componente em vez desta função
          onLinkSubmit={handleLinkSubmit}
          onSubmit={handleSubmit}
          isProcessing={isProcessing}
          disabled={isProcessing}
          onRecordingComplete={handleRecordingComplete}
          onRecordingError={(msg) => toast({ variant: "destructive", title: "Erro na gravação", description: msg })}
          onNextStep={onNextStep}
        />
        
        {/* Nova área de upload para Supabase Storage */}
        {user && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Arquivos para o artigo</h3>
            <FileUploadWithStorage 
              onFileUploaded={handleFileUploaded}
              disabled={isProcessing}
            />
          </div>
        )}
        
        {/* Preview de arquivos e links */}
        {(uploadedFiles.length > 0 || savedLinks.length > 0) && (
          <div className="mt-4 p-4 border rounded-lg bg-background/50">
            <h3 className="text-lg font-medium mb-2">Arquivos e links anexados</h3>
            
            {/* Lista de arquivos */}
            {uploadedFiles.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Arquivos</h4>
                <ul className="space-y-2">
                  {uploadedFiles.map(file => (
                    <li key={file.id} className="flex items-center justify-between text-sm border p-2 rounded">
                      <span>{file.fileName} ({(file.fileSize / 1024).toFixed(0)} KB)</span>
                      <button 
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Lista de links */}
            {savedLinks.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Links</h4>
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
        )}
      </div>
      
      {/* Processing overlay */}
      {isProcessing && (
        <ProcessingOverlay
          stage={processingStatus.stage}
          progress={processingStatus.progress}
          message={processingStatus.message}
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

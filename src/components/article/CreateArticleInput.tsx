
import { useState } from "react";
import { useArticleSession } from "@/hooks/useArticleSession";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { useToast } from "@/hooks/use-toast";
import { UploadedFile } from '@/utils/articleSubmissionUtils';
import { useAuth } from "@/contexts/AuthContext";
import { ArticleInputContainer } from "./input/ArticleInputContainer";
import { ArticleSubmissionHandler } from "./submission/ArticleSubmissionHandler";
import { LinksList } from "./links/LinksList";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useSupabaseStorage } from "@/hooks/useSupabaseStorage";

interface CreateArticleInputProps {
  onWorkflowUpdate: (data: any) => void;
  onNextStep: () => void;
}

export function CreateArticleInput({
  onWorkflowUpdate,
  onNextStep
}: CreateArticleInputProps) {
  const { toast } = useToast();
  const [savedLinks, setSavedLinks] = useState<Array<{ url: string; id: string; }>>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
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

  const { uploadFiles } = useSupabaseStorage();

  // Handler for adding link
  const handleLinkSubmit = (url: string) => {
    const linkId = crypto.randomUUID();
    setSavedLinks(prev => [...prev, { url, id: linkId }]);
    
    toast({
      title: "Link adicionado",
      description: "O link será processado junto com seu artigo"
    });
  };

  // Handler for removing link
  const handleRemoveLink = (linkId: string) => {
    setSavedLinks(prev => prev.filter(link => link.id !== linkId));
    
    toast({
      title: "Link removido",
      description: "O link foi removido da sua lista"
    });
  };

  // Handler for file upload
  const handleFileUpload = async (files: FileList | File[]) => {
    requireAuth(async () => {
      try {
        const fileArray = Array.isArray(files) ? files : Array.from(files);
        if (fileArray.length === 0) return;
        
        toast({
          title: "Iniciando upload",
          description: `Enviando ${fileArray.length} arquivo(s) para armazenamento.`
        });
        
        const uploaded = await uploadFiles(fileArray);
        if (uploaded && uploaded.length > 0) {
          setUploadedFiles(prev => [...prev, ...uploaded]);
          toast({
            title: "Upload concluído",
            description: `${uploaded.length} arquivo(s) enviado(s) com sucesso.`
          });
        }
      } catch (error) {
        console.error("Erro no upload:", error);
        toast({
          variant: "destructive",
          title: "Erro no upload",
          description: "Não foi possível fazer o upload dos arquivos."
        });
      }
    });
  };

  // Handler for recording completion
  const handleRecordingComplete = async (audioFile: File) => {
    console.log("Gravação concluída:", audioFile.name);
    toast({
      title: "Gravação finalizada",
      description: "Gravação de áudio será enviada ao armazenamento."
    });
    
    // Handle as a regular file upload
    await handleFileUpload([audioFile]);
  };

  // Handler para remover arquivo
  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    
    toast({
      title: "Arquivo removido",
      description: "O arquivo foi removido da sua lista"
    });
  };

  return (
    <ArticleSubmissionHandler
      content={content}
      articleType={articleType}
      uploadedFiles={uploadedFiles}
      savedLinks={savedLinks}
      onWorkflowUpdate={onWorkflowUpdate}
      onNextStep={onNextStep}
    >
      {({ handleSubmit, isProcessing }) => (
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
              onNextStep={() => { onNextStep(); return Promise.resolve(undefined); }}
              uploadedFiles={uploadedFiles}
              onRemoveFile={handleRemoveFile}
            />
            
            {/* Links list */}
            {savedLinks.length > 0 && (
              <div className="mt-4 p-4 bg-[#111]/50 rounded-xl border border-white/10">
                <LinksList links={savedLinks} onRemove={handleRemoveLink} />
              </div>
            )}
          </div>
          
          {/* Auth dialog */}
          <AuthDialog
            isOpen={authDialogOpen}
            onClose={() => setAuthDialogOpen(false)}
            onSuccess={() => setAuthDialogOpen(false)}
          />
        </>
      )}
    </ArticleSubmissionHandler>
  );
}

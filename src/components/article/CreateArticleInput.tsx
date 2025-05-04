
import { useState } from "react";
import { useArticleSession } from "@/hooks/useArticleSession";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { useToast } from "@/hooks/use-toast";
import { UploadedFile } from '@/utils/articleSubmissionUtils';
import { useAuth } from "@/contexts/AuthContext";
import { FileUploadWithStorage } from "./file-upload/FileUploadWithStorage";
import { ArticleInputContainer } from "./input/ArticleInputContainer";
import { ArticleSubmissionHandler } from "./submission/ArticleSubmissionHandler";
import { LinksList } from "./links/LinksList";
import { AuthDialog } from "@/components/auth/AuthDialog";

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

  // Handler for adding link
  const handleLinkSubmit = (url: string) => {
    const linkId = crypto.randomUUID();
    setSavedLinks(prev => [...prev, { url, id: linkId }]);
  };

  // Handler for removing link
  const handleRemoveLink = (linkId: string) => {
    setSavedLinks(prev => prev.filter(link => link.id !== linkId));
  };

  // Handler for file upload - now updated to use Supabase Storage
  const handleFileUploaded = (files: UploadedFile[]) => {
    console.log("Files uploaded to Supabase Storage:", files);
    setUploadedFiles(files);
  };

  // Handler for recording completion
  const handleRecordingComplete = (audioFile: File) => {
    console.log("Recording complete:", audioFile.name);
    toast({
      title: "Gravação finalizada",
      description: "Gravação de áudio será enviada ao Supabase Storage."
    });
    
    // Handle as a regular file upload
    const files = [audioFile];
    requireAuth(async () => {
      try {
        const { uploadFiles } = await import('@/hooks/useSupabaseStorage');
        if (typeof uploadFiles === 'function') {
          const uploaded = await uploadFiles(files);
          if (uploaded && uploaded.length > 0) {
            setUploadedFiles(prev => [...prev, ...uploaded]);
          }
        } else {
          throw new Error("uploadFiles function not available");
        }
      } catch (error) {
        console.error("Error uploading audio recording:", error);
        toast({
          variant: "destructive",
          title: "Erro no upload",
          description: "Não foi possível fazer upload da gravação de áudio."
        });
      }
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
            <div className="mb-4">
              <FileUploadWithStorage
                onFileUploaded={handleFileUploaded}
                disabled={isProcessing}
              />
            </div>
            
            <ArticleInputContainer
              articleType={articleType}
              onArticleTypeChange={setArticleType}
              content={content}
              onContentChange={setContent}
              onLinkSubmit={handleLinkSubmit}
              onFileUpload={() => {}} // Not used, we're using FileUploadWithStorage component instead
              onSubmit={handleSubmit}
              isProcessing={isProcessing}
              disabled={isProcessing}
              onRecordingComplete={handleRecordingComplete}
              onRecordingError={(msg) => toast({ variant: "destructive", title: "Erro na gravação", description: msg })}
              onNextStep={onNextStep}
            />
            
            {/* Links list */}
            <LinksList links={savedLinks} onRemove={handleRemoveLink} />
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


import { useToast } from "@/hooks/use-toast";
import { ProcessingOverlay } from "./processing/ProcessingOverlay";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useArticleInput } from "@/hooks/useArticleInput";
import { UploadedContentPreview } from "./input/UploadedContentPreview";
import { ArticleInputContainer } from "./input/ArticleInputContainer";

export function CreateArticleInput({ onWorkflowUpdate }) {
  const { toast } = useToast();
  const {
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
  } = useArticleInput({ onWorkflowUpdate });

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <UploadedContentPreview
        queue={queue}
        onQueueItemRemove={(index) => {
          const fileToRemove = queue[index];
          if (fileToRemove) {
            removeFromQueue(fileToRemove.id);
          }
        }}
        savedLinks={savedLinks}
        onLinkRemove={removeLink}
      />

      <div className="relative">
        <ArticleInputContainer
          articleType={articleType}
          onArticleTypeChange={setArticleType}
          content={content}
          onContentChange={setContent}
          onFileUpload={handleFileUpload}
          onLinkSubmit={handleLinkSubmit}
          onSubmit={handleSubmit}
          isProcessing={isSubmitting || isUploading}
          disabled={!hasValidContent || hasUploadsInProgress}
          onRecordingComplete={(file) => handleFileUpload([file])}
          onRecordingError={(message) => {
            toast({
              variant: "destructive",
              title: "Erro na gravação",
              description: message
            });
          }}
        />
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

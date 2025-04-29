
import { ProcessingOverlay } from "./processing/ProcessingOverlay";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { UploadedContentPreview } from "./input/UploadedContentPreview";
import { ArticleInputContainer } from "./input/ArticleInputContainer";
import { useArticleSession } from "@/hooks/useArticleSession";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";

export function CreateArticleInput({ onWorkflowUpdate }) {
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

  const handleSubmit = () => {
    if (!hasValidContent) {
      return;
    }

    requireAuth(() => {
      processQueue();
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
      />
      
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
      />
    </div>
  );
}

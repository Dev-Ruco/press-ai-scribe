
import { ArticleTextArea } from "./ArticleTextArea";
import { InputActionButtons } from "./InputActionButtons";
import { ArticleTypeObject } from "@/types/article";
import { UploadedFile } from '@/utils/articleSubmissionUtils';
import { FilePreviewSection } from "./FilePreviewSection";
import { useSubmitHandler } from "./SubmitHandlerService";

interface ArticleInputContainerProps {
  articleType: ArticleTypeObject;
  onArticleTypeChange: (type: ArticleTypeObject) => void;
  content: string;
  onContentChange: (content: string) => void;
  onFileUpload: (files: FileList | File[]) => void;
  onLinkSubmit: (url: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  disabled: boolean;
  onRecordingComplete: (file: File) => void;
  onRecordingError: (message: string) => void;
  onNextStep?: () => Promise<string | undefined> | void;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
}

export function ArticleInputContainer({
  articleType,
  onArticleTypeChange,
  content,
  onContentChange,
  onFileUpload,
  onLinkSubmit,
  onSubmit,
  isProcessing,
  disabled,
  onRecordingComplete,
  onRecordingError,
  onNextStep,
  uploadedFiles,
  onRemoveFile
}: ArticleInputContainerProps) {
  const { handleSubmitAndAdvance } = useSubmitHandler({
    isProcessing,
    onSubmit,
    onNextStep
  });

  return (
    <div className="relative flex flex-col border border-gray-700 rounded-2xl shadow-md bg-gray-950">
      <ArticleTextArea
        content={content}
        onChange={onContentChange}
        disabled={isProcessing}
      />
      
      <FilePreviewSection 
        uploadedFiles={uploadedFiles} 
        onRemoveFile={onRemoveFile} 
      />
      
      <InputActionButtons
        onFileUpload={onFileUpload}
        onLinkSubmit={onLinkSubmit}
        onRecordingComplete={onRecordingComplete}
        onRecordingError={onRecordingError}
        onSubmit={handleSubmitAndAdvance}
        isProcessing={isProcessing}
        showGenerateTest={false}
        disabled={disabled}
        onGenerateTest={() => {}}
        articleType={articleType}
        onArticleTypeChange={onArticleTypeChange}
      />
    </div>
  );
}

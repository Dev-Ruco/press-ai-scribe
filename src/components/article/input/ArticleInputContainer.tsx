
import { ArticleTypeSelect } from "./ArticleTypeSelect";
import { ArticleTextArea } from "./ArticleTextArea";
import { InputActionButtons } from "./InputActionButtons";
import { ArticleTypeObject } from "@/types/article";

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
  onRecordingError
}: ArticleInputContainerProps) {
  return (
    <div className="relative flex flex-col border border-border/40 rounded-2xl shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/30">
      <div className="px-4 pt-4">
        <ArticleTypeSelect
          value={articleType}
          onValueChange={onArticleTypeChange}
          disabled={isProcessing}
        />
      </div>
      
      <ArticleTextArea
        content={content}
        onChange={onContentChange}
        disabled={isProcessing}
      />
      
      <InputActionButtons
        onFileUpload={onFileUpload}
        onLinkSubmit={onLinkSubmit}
        onRecordingComplete={onRecordingComplete}
        onRecordingError={onRecordingError}
        onSubmit={onSubmit}
        isProcessing={isProcessing}
        showGenerateTest={false}
        disabled={disabled}
        onGenerateTest={() => {}} 
      />
    </div>
  );
}

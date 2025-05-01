
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
  onNextStep?: () => Promise<string | undefined>;
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
  onNextStep
}: ArticleInputContainerProps) {
  // Função para tratar o envio e avançar para a próxima etapa se possível
  const handleSubmitAndAdvance = () => {
    onSubmit();
    
    // Se o processamento foi bem-sucedido e temos uma função para avançar
    if (!isProcessing && onNextStep) {
      // Aguardar 1.5 segundos para garantir que o processamento foi concluído
      setTimeout(async () => {
        if (!isProcessing) {
          await onNextStep();
        }
      }, 1500);
    }
  };

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
        onSubmit={handleSubmitAndAdvance}
        isProcessing={isProcessing}
        showGenerateTest={false}
        disabled={disabled}
        onGenerateTest={() => {}} 
      />
    </div>
  );
}

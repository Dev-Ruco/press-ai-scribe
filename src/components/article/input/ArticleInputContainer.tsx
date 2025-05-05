
import { ArticleTextArea } from "./ArticleTextArea";
import { InputActionButtons } from "./InputActionButtons";
import { ArticleTypeObject } from "@/types/article";
import { UploadedFile } from '@/utils/articleSubmissionUtils';
import { FilePreview } from "../file-upload/FilePreview";

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
  // Função para tratar o envio e avançar para a próxima etapa se possível
  const handleSubmitAndAdvance = () => {
    onSubmit();
    
    // Se o processamento foi bem-sucedido e temos uma função para avançar
    if (!isProcessing && onNextStep) {
      // Aguardar 1.5 segundos para garantir que o processamento foi concluído
      setTimeout(async () => {
        if (!isProcessing && onNextStep) {
          await onNextStep();
        }
      }, 1500);
    }
  };

  return (
    <div className="relative flex flex-col border border-gray-700 rounded-2xl shadow-md bg-gray-950">
      <ArticleTextArea
        content={content}
        onChange={onContentChange}
        disabled={isProcessing}
      />
      
      {/* Exibição dos arquivos carregados */}
      {uploadedFiles.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-700/50 bg-gray-900">
          <div className="text-sm font-medium text-gray-300 mb-2">
            Arquivos anexados ({uploadedFiles.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {uploadedFiles.map((file) => (
              <FilePreview
                key={file.id}
                files={[{
                  file: new File([], file.fileName, { type: file.mimeType }), // File dummy apenas para visualização
                  id: file.id || '',
                  progress: 100,
                  status: file.status || 'completed',
                  error: file.error
                }]}
                onRemove={(fileObj) => onRemoveFile(fileObj.id)}
              />
            ))}
          </div>
        </div>
      )}
      
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

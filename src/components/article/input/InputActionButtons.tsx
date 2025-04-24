
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { FileUploadButton } from "../file-upload/FileUploadButton";
import { VoiceRecordButton } from "../voice/VoiceRecordButton";
import { LinkInputButton } from "../link/LinkInputButton";

interface InputActionButtonsProps {
  onFileUpload: (files: FileList | File[]) => void;
  onLinkSubmit: (url: string) => void;
  onRecordingComplete: (file: File) => void;
  onRecordingError: (message: string) => void;
  onGenerateTest: () => void;
  onSubmit: () => void;
  isProcessing: boolean;
  showGenerateTest: boolean;
  disabled: boolean;
}

export function InputActionButtons({
  onFileUpload,
  onLinkSubmit,
  onRecordingComplete,
  onRecordingError,
  onGenerateTest,
  onSubmit,
  isProcessing,
  showGenerateTest,
  disabled
}: InputActionButtonsProps) {
  return (
    <div className="flex items-center justify-between p-2 border-t border-border/40">
      <div className="flex items-center gap-1 px-2">
        <FileUploadButton 
          onFileUpload={onFileUpload}
          allowedFileTypes={[
            'text/*',
            'image/*',
            'video/*',
            'audio/*',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]}
        />
        <VoiceRecordButton 
          onRecordingComplete={onRecordingComplete}
          onError={onRecordingError}
        />
        <LinkInputButton onLinkSubmit={onLinkSubmit} />
        {showGenerateTest && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onGenerateTest}
            disabled={isProcessing}
            className="ml-2"
          >
            Gerar teste
          </Button>
        )}
      </div>

      <Button
        variant="default"
        onClick={onSubmit}
        disabled={disabled || isProcessing}
        className="h-9 px-4 rounded-full bg-primary hover:bg-primary/90"
      >
        {isProcessing ? (
          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        Enviar
      </Button>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { FileUploadButton } from "../file-upload/FileUploadButton";
import { VoiceRecordButton } from "../voice/VoiceRecordButton";
import { LinkInputButton } from "../link/LinkInputButton";
import { N8N_WEBHOOK_URL } from "@/utils/webhookUtils";

interface InputActionButtonsProps {
  onFileUpload: (files: FileList | File[]) => void;
  onLinkSubmit: (url: string) => void;
  onRecordingComplete: (file: File) => void;
  onRecordingError: (message: string) => void;
  onGenerateTest?: () => void;
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
        {showGenerateTest && onGenerateTest && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onGenerateTest}
            disabled={isProcessing}
            className="ml-2 h-9 px-3 text-muted-foreground hover:text-foreground"
          >
            Gerar teste
          </Button>
        )}
      </div>

      <Button
        size="sm"
        onClick={onSubmit}
        disabled={disabled || isProcessing}
        className="h-9 px-4 gap-2 bg-primary hover:bg-primary/90"
        title={`Enviar para ${N8N_WEBHOOK_URL}`}
      >
        {isProcessing ? (
          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Enviar
      </Button>
    </div>
  );
}

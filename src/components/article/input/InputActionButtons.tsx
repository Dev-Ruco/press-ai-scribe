
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { FileUploadButton } from "../file-upload/FileUploadButton";
import { VoiceRecordButton } from "../voice/VoiceRecordButton";
import { LinkInputButton } from "../link/LinkInputButton";
import { N8N_WEBHOOK_URL } from "@/utils/webhook/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="flex items-center justify-between p-4 border-t border-white/10">
      <div className="flex items-center gap-2">
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
            className="ml-2 h-9 px-3 text-gray-400 hover:text-white"
          >
            Gerar teste
          </Button>
        )}
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              onClick={onSubmit}
              disabled={disabled || isProcessing}
              className="h-9 px-4 gap-2 bg-black hover:bg-gray-800 text-white"
            >
              {isProcessing ? (
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Enviar
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Enviar para: {N8N_WEBHOOK_URL}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

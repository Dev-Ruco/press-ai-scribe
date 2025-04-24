
import { FileUploadButton } from "../file-upload/FileUploadButton";
import { VoiceRecordButton } from "../voice/VoiceRecordButton";
import { LinkInputButton } from "../link/LinkInputButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ArticleInputControlsProps {
  onFileUpload: (files: FileList) => void;
  onRecordingComplete: (file: File) => void;
  onLinkSubmit: (url: string) => void;
  onGenerateTest: () => void;
  isProcessing: boolean;
}

export function ArticleInputControls({
  onFileUpload,
  onRecordingComplete,
  onLinkSubmit,
  onGenerateTest,
  isProcessing
}: ArticleInputControlsProps) {
  const { toast } = useToast();

  return (
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
        isDisabled={isProcessing}
      />
      <VoiceRecordButton 
        onRecordingComplete={onRecordingComplete}
        onError={(message) => {
          toast({
            variant: "destructive",
            title: "Erro na gravação",
            description: message
          });
        }}
      />
      <LinkInputButton onLinkSubmit={onLinkSubmit} />
      
      <div className="ml-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onGenerateTest}
          disabled={isProcessing}
          className="text-xs"
        >
          Gerar artigo de teste
        </Button>
      </div>
    </div>
  );
}

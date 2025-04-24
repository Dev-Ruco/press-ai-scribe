
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UploadTriggerButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
  supportedTypes?: string[];
}

export function UploadTriggerButton({ onClick, isDisabled, supportedTypes }: UploadTriggerButtonProps) {
  const getFileTypesText = () => {
    if (!supportedTypes?.length) return "Carregar arquivos";
    
    const typeGroups = {
      images: supportedTypes.filter(t => t.includes('image')),
      documents: supportedTypes.filter(t => t.includes('text') || t.includes('pdf') || t.includes('doc')),
      audio: supportedTypes.filter(t => t.includes('audio')),
      video: supportedTypes.filter(t => t.includes('video'))
    };

    const parts = [];
    if (typeGroups.images.length) parts.push("imagens");
    if (typeGroups.documents.length) parts.push("documentos");
    if (typeGroups.audio.length) parts.push("áudio");
    if (typeGroups.video.length) parts.push("vídeos");

    return `Carregar ${parts.join(', ')}`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isDisabled}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            onClick={onClick}
          >
            <Upload className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getFileTypesText()}</p>
          {supportedTypes?.length ? (
            <p className="text-xs text-muted-foreground mt-1">
              Formatos suportados: {supportedTypes.join(', ')}
            </p>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


import { Button } from "@/components/ui/button";
import { UploadIcon } from "./UploadIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UploadTriggerButtonProps {
  onClick: () => void;
}

export function UploadTriggerButton({ onClick }: UploadTriggerButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            onClick={onClick}
          >
            <UploadIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[280px] p-3">
          <p className="font-medium mb-1">Carregar arquivos</p>
          <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
            <li>Documentos: PDF, DOC, DOCX, TXT (até 50MB)</li>
            <li>Áudio: MP3, WAV, M4A (até 50MB / ~3h)</li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

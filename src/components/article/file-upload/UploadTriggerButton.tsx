
import { Button } from "@/components/ui/button";
import { Upload, FileText, Image, Video, FileAudio } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UploadTriggerButtonProps {
  onClick: (type: string) => void;
  isDisabled?: boolean;
  supportedTypes?: string[];
}

export function UploadTriggerButton({ onClick, isDisabled, supportedTypes }: UploadTriggerButtonProps) {
  const uploadOptions = [
    { icon: Image, label: 'Imagens', types: ['image/*'] },
    { icon: Video, label: 'Vídeos', types: ['video/*'] },
    { icon: FileAudio, label: 'Áudio', types: ['audio/*'] },
    { icon: FileText, label: 'Documentos', types: ['application/pdf', '.doc,.docx,text/*'] },
  ];

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isDisabled}
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {uploadOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                onClick={() => onClick(option.types[0])}
                className="flex items-center gap-2"
              >
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>
          <p>Carregar arquivos</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

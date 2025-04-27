
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Upload, FileAudio, FileVideo, File } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UploadMenuProps {
  onFileSelect: (type: string) => void;
}

export function UploadMenu({ onFileSelect }: UploadMenuProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-background">
            <DropdownMenuItem onClick={() => onFileSelect("document")}>
              <File className="mr-2 h-4 w-4" />
              <span>Documentos</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFileSelect("audio")}>
              <FileAudio className="mr-2 h-4 w-4" />
              <span>Áudio</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFileSelect("video")}>
              <FileVideo className="mr-2 h-4 w-4" />
              <span>Vídeo</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>Carregar ficheiros</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

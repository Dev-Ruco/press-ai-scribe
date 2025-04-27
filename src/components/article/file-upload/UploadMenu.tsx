
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Upload, FileAudio, File, FileImage, FileVideo } from "lucide-react";
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
      <DropdownMenu>
        <Tooltip>
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
          <TooltipContent side="bottom" className="max-w-[200px] text-center">
            Carregar ficheiros
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="start" className="w-72 p-2">
          <DropdownMenuItem onClick={() => onFileSelect("document")} className="flex flex-col items-start p-2 cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <File className="h-4 w-4" />
              <span className="font-medium">Documentos</span>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              Suporta PDF, DOC, DOCX, TXT até 50MB
            </p>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onFileSelect("image")} className="flex flex-col items-start p-2 cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <FileImage className="h-4 w-4" />
              <span className="font-medium">Imagens</span>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              Suporta JPG, PNG, GIF até 50MB
            </p>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onFileSelect("video")} className="flex flex-col items-start p-2 cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <FileVideo className="h-4 w-4" />
              <span className="font-medium">Vídeos</span>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              Suporta MP4, WebM até 50MB
            </p>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onFileSelect("audio")} className="flex flex-col items-start p-2 cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <FileAudio className="h-4 w-4" />
              <span className="font-medium">Áudio</span>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              Suporta MP3, WAV, M4A até 50MB (aproximadamente 3 horas de áudio)
            </p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}

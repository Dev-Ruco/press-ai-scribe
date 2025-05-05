
import { Upload, FileAudio, FileText, FileImage, FileVideo } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UploadMenuProps {
  onFileSelect: (type?: string) => void;
}

export function UploadMenu({ onFileSelect }: UploadMenuProps) {
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Carregar arquivos</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DropdownMenuContent align="start" className="bg-background border border-border/30 shadow-sm">
        <DropdownMenuItem 
          onClick={() => onFileSelect()}
          className="flex gap-2 text-sm px-3 py-2 hover:bg-muted/30 focus:bg-muted/30 cursor-pointer"
        >
          <Upload className="h-4 w-4 text-muted-foreground" />
          <span>Qualquer arquivo</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onFileSelect('document')}
          className="flex gap-2 text-sm px-3 py-2 hover:bg-muted/30 focus:bg-muted/30 cursor-pointer"
        >
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>Documento</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onFileSelect('image')}
          className="flex gap-2 text-sm px-3 py-2 hover:bg-muted/30 focus:bg-muted/30 cursor-pointer"
        >
          <FileImage className="h-4 w-4 text-muted-foreground" />
          <span>Imagem</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onFileSelect('audio')}
          className="flex gap-2 text-sm px-3 py-2 hover:bg-muted/30 focus:bg-muted/30 cursor-pointer"
        >
          <FileAudio className="h-4 w-4 text-muted-foreground" />
          <span>Áudio</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onFileSelect('video')}
          className="flex gap-2 text-sm px-3 py-2 hover:bg-muted/30 focus:bg-muted/30 cursor-pointer"
        >
          <FileVideo className="h-4 w-4 text-muted-foreground" />
          <span>Vídeo</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

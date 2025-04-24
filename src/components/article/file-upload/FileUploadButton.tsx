
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileUploadButtonProps {
  onFileUpload: (files: FileList) => void;
  allowedFileTypes: string[];
}

export function FileUploadButton({ onFileUpload, allowedFileTypes }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            onFileUpload(e.target.files);
          }
        }}
        accept={allowedFileTypes.join(',')}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              onClick={handleUploadButtonClick}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Carregar arquivos</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

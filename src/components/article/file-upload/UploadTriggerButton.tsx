
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
  isDisabled?: boolean;
}

export function UploadTriggerButton({ onClick, isDisabled }: UploadTriggerButtonProps) {
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
            <UploadIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Carregar arquivos</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

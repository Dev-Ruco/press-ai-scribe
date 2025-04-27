
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LinkInputButtonProps {
  onLinkSubmit: (url: string) => void;
}

export function LinkInputButton({ onLinkSubmit }: LinkInputButtonProps) {
  const [isLinkActive, setIsLinkActive] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const handleLinkSubmit = () => {
    if (!linkUrl.trim()) return;
    onLinkSubmit(linkUrl);
    setIsLinkActive(false);
    setLinkUrl("");
  };

  if (!isLinkActive) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              onClick={() => setIsLinkActive(true)}
            >
              <Link2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Importar por link</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link2 className="h-4 w-4 text-primary flex-shrink-0" />
      <input
        id="link-input"
        type="url"
        className="flex-1 px-3 py-2 text-sm bg-background/50 border border-border/40 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Cole o link do YouTube, TikTok, site de notícias, etc..."
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleLinkSubmit();
          }
        }}
      />
      <Button 
        size="sm" 
        variant="ghost"
        className="h-8 px-2 text-xs"
        onClick={() => {
          setIsLinkActive(false);
          setLinkUrl("");
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, Check, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

interface LinkInputButtonProps {
  onLinkSubmit: (url: string) => void;
}

export function LinkInputButton({ onLinkSubmit }: LinkInputButtonProps) {
  const [isLinkActive, setIsLinkActive] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

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
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
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

  const hasValidUrl = isValidUrl(linkUrl.trim());

  return (
    <div className="flex items-center gap-2 bg-background border border-border/30 rounded-lg shadow-sm px-3 py-1.5">
      <Link2 className="h-4 w-4 text-primary flex-shrink-0" />
      <Input
        id="link-input"
        type="url"
        className="flex-1 px-3 py-1 text-sm bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
        placeholder="Cole o link do YouTube, TikTok, site de notícias, etc..."
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && hasValidUrl) {
            handleLinkSubmit();
          }
        }}
      />
      <Button 
        size="sm" 
        variant={hasValidUrl ? "default" : "ghost"}
        className={`h-7 px-2 text-xs transition-colors ${
          hasValidUrl 
            ? "bg-primary hover:bg-primary/90" 
            : "hover:bg-muted/30 hover:text-foreground"
        }`}
        onClick={() => {
          if (hasValidUrl) {
            handleLinkSubmit();
          } else {
            setIsLinkActive(false);
            setLinkUrl("");
          }
        }}
      >
        {hasValidUrl ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}

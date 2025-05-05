
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, Check, X } from "lucide-react";
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
              className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
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
    <div className="flex items-center gap-2">
      <Link2 className="h-4 w-4 text-white flex-shrink-0" />
      <input
        id="link-input"
        type="url"
        className="flex-1 px-3 py-2 text-sm bg-[#111]/50 border border-white/10 rounded-full text-white focus:outline-none focus:ring-1 focus:ring-white/30"
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
        className={`h-8 px-2 text-xs transition-colors ${
          hasValidUrl 
            ? "bg-black hover:bg-gray-800 text-white" 
            : "hover:bg-white/10 text-gray-400 hover:text-white"
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
        {hasValidUrl ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </Button>
    </div>
  );
}

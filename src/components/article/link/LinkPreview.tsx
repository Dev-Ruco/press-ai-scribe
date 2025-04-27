
import { Button } from "@/components/ui/button";
import { X, Link2 } from "lucide-react";

interface SavedLink {
  url: string;
  id: string;
}

interface LinkPreviewProps {
  links: SavedLink[];
  onRemove: (id: string) => void;
}

export function LinkPreview({ links, onRemove }: LinkPreviewProps) {
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <div
          key={link.id}
          className="relative group border border-border/40 rounded-md overflow-hidden bg-muted/20"
        >
          <div className="flex items-center gap-2 p-2 pr-8 h-10">
            <Link2 className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-xs truncate max-w-[180px]">
              {link.url}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(link.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

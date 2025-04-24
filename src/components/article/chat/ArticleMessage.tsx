
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArticlePreview } from "../preview/ArticlePreview";

interface ArticleMessageProps {
  content: string;
  isTyping?: boolean;
  timestamp?: Date;
  isUser?: boolean;
  className?: string;
}

export function ArticleMessage({ content, isTyping, timestamp, isUser, className }: ArticleMessageProps) {
  return (
    <div className={cn(
      "group relative flex w-full items-start gap-4 px-4",
      isUser && "justify-end",
      className
    )}>
      <div className={cn(
        "flex-1 overflow-hidden",
        isUser ? "bg-primary/5" : "bg-muted/50",
        "max-w-[calc(100%-3rem)]"
      )}>
        {isTyping ? (
          <div className="flex items-center gap-1 animate-pulse p-4">
            <span className="h-2 w-2 rounded-full bg-foreground/50"></span>
            <span className="h-2 w-2 rounded-full bg-foreground/50"></span>
            <span className="h-2 w-2 rounded-full bg-foreground/50"></span>
          </div>
        ) : (
          <ArticlePreview 
            content={content} 
            className="border-0 shadow-none"
          />
        )}
        {timestamp && (
          <time className="block text-[10px] text-muted-foreground p-2">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </time>
        )}
      </div>
    </div>
  );
}

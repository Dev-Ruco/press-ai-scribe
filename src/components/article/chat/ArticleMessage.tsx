
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import { marked } from "marked";

interface ArticleMessageProps {
  content: string;
  isTyping?: boolean;
  timestamp?: Date;
  isUser?: boolean;
  className?: string;
}

export function ArticleMessage({ content, isTyping, timestamp, isUser, className }: ArticleMessageProps) {
  // Convert markdown to HTML if not typing and content exists
  const formattedContent = (!isTyping && content) 
    ? DOMPurify.sanitize(marked.parse(content || '').toString()) 
    : content || '';

  return (
    <div className={cn(
      "group relative flex w-full items-start gap-4 px-4",
      isUser && "justify-end",
      className
    )}>
      <div className={cn(
        "flex-1 space-y-2 overflow-hidden rounded-lg px-4 py-3",
        isUser ? "bg-primary/5" : "bg-muted/50",
        "max-w-[calc(100%-3rem)]"
      )}>
        {isTyping ? (
          <div className="flex items-center gap-1 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-foreground/50"></span>
            <span className="h-2 w-2 rounded-full bg-foreground/50"></span>
            <span className="h-2 w-2 rounded-full bg-foreground/50"></span>
          </div>
        ) : (
          <>
            <div 
              className="prose prose-sm break-words dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
            {timestamp && (
              <time className="text-[10px] text-muted-foreground">
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </time>
            )}
          </>
        )}
      </div>
    </div>
  );
}

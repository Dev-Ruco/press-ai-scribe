
import { Message } from "@/types/chat";
import { ArticleMessage } from "./ArticleMessage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArticleChatAreaProps {
  messages: Message[];
  className?: string;
}

export function ArticleChatArea({ messages, className }: ArticleChatAreaProps) {
  return (
    <ScrollArea className={`p-4 rounded-lg border border-border/30 bg-card/30 backdrop-blur ${className || ''}`}>
      <div className="flex flex-col gap-4 pb-2">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregue arquivos ou digite instruções para gerar um artigo
          </div>
        ) : (
          messages.map((message) => (
            <ArticleMessage key={message.id} message={message} />
          ))
        )}
      </div>
    </ScrollArea>
  );
}

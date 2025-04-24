
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArticleMessage } from "./ArticleMessage";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface ArticleChatAreaProps {
  messages: Message[];
  className?: string;
}

export function ArticleChatArea({ messages, className }: ArticleChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollRef} className={className}>
      <div className="flex flex-col gap-4 py-4 max-w-3xl mx-auto">
        {messages.map((message) => (
          <ArticleMessage
            key={message.id}
            content={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
            isTyping={message.isTyping}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

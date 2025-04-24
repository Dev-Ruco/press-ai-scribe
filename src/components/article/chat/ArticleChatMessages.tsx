
import { Message } from "@/types/chat";
import { ArticleChatArea } from "./ArticleChatArea";

interface ArticleChatMessagesProps {
  messages: Message[];
}

export function ArticleChatMessages({ messages }: ArticleChatMessagesProps) {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <ArticleChatArea 
        messages={messages} 
        className="flex-1 min-h-[200px] max-h-[60vh]"
      />
    </div>
  );
}

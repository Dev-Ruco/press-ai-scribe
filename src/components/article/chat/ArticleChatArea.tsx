
import { Message } from "@/types/chat";

interface ArticleChatAreaProps {
  messages: Message[];
  className?: string;
}

export function ArticleChatArea({ messages, className }: ArticleChatAreaProps) {
  return (
    <div className={`overflow-y-auto p-4 ${className}`}>
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
        >
          <div
            className={`inline-block p-3 rounded-lg ${
              message.isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
}

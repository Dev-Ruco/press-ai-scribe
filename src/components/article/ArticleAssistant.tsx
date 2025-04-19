
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";
import { useChat } from "./chat/useChat";

export function ArticleAssistant() {
  const { message, messages, setMessage, handleSendMessage } = useChat();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Assistente IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <MessageList messages={messages} />
            <MessageInput 
              message={message}
              onChange={setMessage}
              onSend={handleSendMessage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

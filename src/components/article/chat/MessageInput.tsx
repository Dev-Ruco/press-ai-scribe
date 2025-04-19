
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  message: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function MessageInput({ message, onChange, onSend }: MessageInputProps) {
  return (
    <div className="flex gap-2">
      <Input 
        value={message} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="Digite sua mensagem..." 
        className="flex-1"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSend();
          }
        }}
      />
      <Button size="icon" disabled={!message} onClick={onSend}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}


import { MessageSquare, MessageSquarePlus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

type MessageType = "agent" | "question" | "suggestion";

interface MessageTypeSelectorProps {
  selected: MessageType;
  onSelect: (type: MessageType) => void;
}

export function MessageTypeSelector({ selected, onSelect }: MessageTypeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-md">
      <Button
        variant="ghost"
        size="sm"
        className={`h-7 px-2 gap-1.5 ${selected === 'agent' ? 'bg-background shadow-sm' : ''}`}
        onClick={() => onSelect('agent')}
      >
        <Settings className="h-3.5 w-3.5" />
        <span className="text-xs">Agente</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-7 px-2 gap-1.5 ${selected === 'question' ? 'bg-background shadow-sm' : ''}`}
        onClick={() => onSelect('question')}
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <span className="text-xs">Pergunta</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-7 px-2 gap-1.5 ${selected === 'suggestion' ? 'bg-background shadow-sm' : ''}`}
        onClick={() => onSelect('suggestion')}
      >
        <MessageSquarePlus className="h-3.5 w-3.5" />
        <span className="text-xs">Sugestão</span>
      </Button>
    </div>
  );
}

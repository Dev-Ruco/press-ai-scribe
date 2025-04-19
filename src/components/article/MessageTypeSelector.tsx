
import { MessageSquare, MessageSquarePlus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type MessageType = "agent" | "question" | "suggestion";

interface MessageTypeSelectorProps {
  selected: MessageType;
  onSelect: (type: MessageType) => void;
}

export function MessageTypeSelector({ selected, onSelect }: MessageTypeSelectorProps) {
  const handleTypeSelect = (type: MessageType) => {
    onSelect(type);
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-md">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 gap-1.5 ${selected === 'agent' ? 'bg-background shadow-sm' : ''}`}
            onClick={() => handleTypeSelect('agent')}
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="text-xs">Agente</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Mensagens do sistema</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 gap-1.5 ${selected === 'question' ? 'bg-background shadow-sm' : ''}`}
            onClick={() => handleTypeSelect('question')}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-xs">Pergunta</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Fazer uma pergunta</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 gap-1.5 ${selected === 'suggestion' ? 'bg-background shadow-sm' : ''}`}
            onClick={() => handleTypeSelect('suggestion')}
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            <span className="text-xs">Sugestão</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Solicitar sugestões</TooltipContent>
      </Tooltip>
    </div>
  );
}


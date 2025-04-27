
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArticleTypeObject } from "@/types/article";
import { Send, FileText, Newspaper, MessageSquare, Megaphone } from "lucide-react";

interface TypeSelectionStepProps {
  selectedType: ArticleTypeObject;
  onTypeSelect: (type: ArticleTypeObject) => void;
  isProcessing: boolean;
}

const articleTypes: ArticleTypeObject[] = [
  {
    id: "news",
    label: "Notícia",
    structure: ["Manchete", "Lead", "Corpo", "Contextualização", "Conclusão"]
  },
  {
    id: "report",
    label: "Reportagem em Profundidade",
    structure: ["Título", "Lead", "Contexto", "Desenvolvimento", "Fontes", "Conclusão"]
  },
  {
    id: "press-release",
    label: "Comunicado de Imprensa",
    structure: ["Título", "Declaração", "Detalhes", "Contatos"]
  },
  {
    id: "editorial",
    label: "Editorial",
    structure: ["Título", "Posicionamento", "Fundamentação", "Conclusão"]
  },
  {
    id: "analysis",
    label: "Análise",
    structure: ["Título", "Contextualização", "Análise dos Dados", "Implicações", "Conclusão"]
  },
  {
    id: "interview",
    label: "Entrevista",
    structure: ["Título", "Perfil", "Perguntas e Respostas", "Conclusão"]
  },
  {
    id: "chronicle",
    label: "Crônica",
    structure: ["Título", "Narrativa", "Desenvolvimento", "Desfecho"]
  }
];

const getTypeIcon = (typeId: string) => {
  switch (typeId) {
    case "news":
      return <Newspaper className="h-5 w-5" />;
    case "press-release":
      return <Megaphone className="h-5 w-5" />;
    case "interview":
      return <MessageSquare className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export function TypeSelectionStep({ selectedType, onTypeSelect, isProcessing }: TypeSelectionStepProps) {
  return (
    <div className="space-y-6">
      <RadioGroup
        defaultValue={selectedType.id}
        onValueChange={(value) => {
          const type = articleTypes.find((t) => t.id === value);
          if (type) onTypeSelect(type);
        }}
        className="grid gap-4"
      >
        {articleTypes.map((type) => (
          <Card
            key={type.id}
            className={`transition-colors hover:border-primary cursor-pointer ${
              selectedType.id === type.id ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(type.id)}
                    <label
                      htmlFor={type.id}
                      className="text-lg font-medium cursor-pointer"
                    >
                      {type.label}
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {type.structure.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary/20 text-secondary-foreground rounded-md text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>

      <Button
        onClick={() => onTypeSelect(selectedType)}
        disabled={isProcessing || !selectedType}
        className="w-full"
      >
        {isProcessing ? (
          <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        Continuar
      </Button>
    </div>
  );
}

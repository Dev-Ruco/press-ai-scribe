
import { FileText, Newspaper, MessageSquare } from "lucide-react";
import { ArticleTypeObject } from "@/types/article";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Simplificando para apenas três tipos principais
const articleTypes: ArticleTypeObject[] = [
  {
    id: "news",
    label: "Notícia",
    structure: ["Manchete", "Lead", "Corpo", "Contextualização", "Conclusão"]
  },
  {
    id: "report",
    label: "Reportagem",
    structure: ["Título", "Lead", "Contexto", "Desenvolvimento", "Fontes", "Conclusão"]
  },
  {
    id: "interview",
    label: "Entrevista",
    structure: ["Título", "Perfil", "Perguntas e Respostas", "Conclusão"]
  }
];

const getIconForType = (type: string) => {
  switch (type) {
    case "news":
      return <Newspaper className="h-4 w-4" />;
    case "report":
      return <FileText className="h-4 w-4" />;
    case "interview":
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

interface ArticleTypeSelectProps {
  value: ArticleTypeObject;
  onValueChange: (type: ArticleTypeObject) => void;
  disabled?: boolean;
}

export function ArticleTypeSelect({ value, onValueChange, disabled }: ArticleTypeSelectProps) {
  // Make sure value is defined with a fallback to prevent errors
  const safeValue = value || articleTypes[0];
  
  return (
    <ToggleGroup 
      type="single" 
      value={safeValue.id}
      onValueChange={(id) => {
        if (!id) return; // Prevent deselection
        const selectedType = articleTypes.find(type => type.id === id);
        if (selectedType) onValueChange(selectedType);
      }}
      disabled={disabled}
      className="flex items-center gap-1"
      variant="outline"
    >
      {articleTypes.map((type) => (
        <ToggleGroupItem 
          key={type.id} 
          value={type.id}
          className="flex items-center gap-1 py-1 px-2 text-xs h-8 bg-transparent border-border/30 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
          aria-label={type.label}
        >
          {getIconForType(type.id)}
          <span className="hidden sm:inline">{type.label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

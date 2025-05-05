
import { FileEdit, FileText, FileSearch, FileQuestion, FilePlus2 } from "lucide-react";
import { ArticleTypeObject } from "@/types/article";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const articleTypes: ArticleTypeObject[] = [
  {
    id: "news",
    label: "Notícia",
    structure: ["Lead", "Desenvolvimento", "Conclusão"]
  },
  {
    id: "article",
    label: "Artigo",
    structure: ["Introdução", "Desenvolvimento", "Conclusão"]
  },
  {
    id: "analysis",
    label: "Análise",
    structure: ["Contextualização", "Análise", "Conclusão"]
  },
  {
    id: "interview",
    label: "Entrevista",
    structure: ["Introdução", "Perguntas e Respostas", "Conclusão"]
  },
  {
    id: "opinion",
    label: "Opinião",
    structure: ["Tese", "Argumentação", "Conclusão"]
  }
];

interface ArticleTypeSelectProps {
  value: ArticleTypeObject;
  onValueChange: (type: ArticleTypeObject) => void;
  disabled?: boolean;
}

const getIconForType = (type: string) => {
  switch (type) {
    case "news":
      return <FileText className="h-4 w-4" />;
    case "article":
      return <FileEdit className="h-4 w-4" />;
    case "analysis":
      return <FileSearch className="h-4 w-4" />;
    case "interview":
      return <FileQuestion className="h-4 w-4" />;
    default:
      return <FilePlus2 className="h-4 w-4" />;
  }
};

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
          className="flex items-center gap-1 py-1 px-2 text-xs h-8 bg-transparent border-gray-700 data-[state=on]:bg-gray-800"
          aria-label={type.label}
        >
          {getIconForType(type.id)}
          <span>{type.label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

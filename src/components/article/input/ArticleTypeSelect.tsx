
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileEdit, FileText, FileSearch, FileQuestion, FilePlus2 } from "lucide-react";
import { ArticleTypeObject } from "@/types/article";

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
      return <FileText className="mr-2 h-4 w-4" />;
    case "article":
      return <FileEdit className="mr-2 h-4 w-4" />;
    case "analysis":
      return <FileSearch className="mr-2 h-4 w-4" />;
    case "interview":
      return <FileQuestion className="mr-2 h-4 w-4" />;
    default:
      return <FilePlus2 className="mr-2 h-4 w-4" />;
  }
};

export function ArticleTypeSelect({ value, onValueChange, disabled }: ArticleTypeSelectProps) {
  // Make sure value is defined with a fallback to prevent errors
  const safeValue = value || articleTypes[0];
  
  return (
    <div className="w-full max-w-[280px]">
      <Select
        disabled={disabled}
        value={safeValue.id}
        onValueChange={(id) => {
          const selectedType = articleTypes.find(type => type.id === id);
          if (selectedType) onValueChange(selectedType);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center">
              {getIconForType(safeValue.id)}
              {safeValue.label}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {articleTypes.map((type) => (
            <SelectItem 
              key={type.id} 
              value={type.id}
              className="flex items-center"
            >
              <div className="flex items-center">
                {getIconForType(type.id)}
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {type.structure.join(" → ")}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

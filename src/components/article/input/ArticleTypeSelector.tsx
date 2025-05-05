
import { useState } from "react";
import { ArticleTypeObject } from "@/types/article";
import { FileEdit, FileText, FileSearch, FileQuestion, FilePlus2, Mic, FileVideo, Book } from "lucide-react";
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
  },
  {
    id: "chronicle",
    label: "Crónica",
    structure: ["Narrativa", "Desenvolvimento", "Desfecho"]
  },
  {
    id: "report",
    label: "Reportagem",
    structure: ["Contextualização", "Desenvolvimento", "Conclusão"]
  }
];

interface ArticleTypeSelectorProps {
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
      return <Mic className="h-4 w-4" />;
    case "report":
      return <FileVideo className="h-4 w-4" />;
    case "chronicle":
      return <Book className="h-4 w-4" />;
    default:
      return <FilePlus2 className="h-4 w-4" />;
  }
};

export function ArticleTypeSelector({ value, onValueChange, disabled }: ArticleTypeSelectorProps) {
  // Make sure value is defined with a fallback to prevent errors
  const safeValue = value || articleTypes[0];
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  return (
    <div className="w-full">
      <ToggleGroup 
        type="single" 
        value={safeValue.id}
        onValueChange={(id) => {
          const selectedType = articleTypes.find(type => type.id === id);
          if (selectedType) onValueChange(selectedType);
        }}
        className="justify-start flex-wrap"
        disabled={disabled}
      >
        {articleTypes.map((type) => (
          <div key={type.id} className="relative">
            <ToggleGroupItem 
              value={type.id} 
              aria-label={type.label}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                safeValue.id === type.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              onMouseEnter={() => setShowTooltip(type.id)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              {getIconForType(type.id)}
              <span>{type.label}</span>
            </ToggleGroupItem>
            
            {showTooltip === type.id && (
              <div className="absolute z-50 -bottom-12 left-0 bg-[#111] border border-white/10 rounded-md p-2 text-xs">
                <p className="text-white">{type.structure.join(" → ")}</p>
              </div>
            )}
          </div>
        ))}
      </ToggleGroup>
    </div>
  );
}

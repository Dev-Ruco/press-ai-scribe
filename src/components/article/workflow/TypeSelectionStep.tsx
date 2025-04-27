
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArticleTypeObject } from "@/types/article";
import { Send } from "lucide-react";

interface TypeSelectionStepProps {
  selectedType: ArticleTypeObject;
  onTypeSelect: (type: ArticleTypeObject) => void;
  isProcessing: boolean;
}

const articleTypes: ArticleTypeObject[] = [
  {
    id: "news",
    label: "Notícia",
    structure: ["Título", "Lead", "Desenvolvimento", "Conclusão"]
  },
  {
    id: "article",
    label: "Artigo",
    structure: ["Introdução", "Desenvolvimento", "Conclusão"]
  },
  {
    id: "opinion",
    label: "Opinião",
    structure: ["Contexto", "Argumentação", "Posicionamento"]
  }
];

export function TypeSelectionStep({ selectedType, onTypeSelect, isProcessing }: TypeSelectionStepProps) {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
        <h3 className="text-lg font-medium">Selecione o Tipo do Artigo</h3>
        <p className="text-sm text-muted-foreground">Escolha o formato que melhor se adequa ao seu conteúdo</p>
      </div>

      <div className="grid gap-4">
        {articleTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-colors hover:border-primary ${
              selectedType.id === type.id ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => onTypeSelect(type)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium mb-2">{type.label}</h4>
                  <ul className="text-sm text-muted-foreground list-disc pl-4">
                    {type.structure.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <Button 
                  size="sm" 
                  variant={selectedType.id === type.id ? "default" : "outline"}
                  onClick={() => onTypeSelect(type)}
                  disabled={isProcessing}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {selectedType.id === type.id ? 'Selecionado' : 'Selecionar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

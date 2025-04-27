
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Edit } from "lucide-react";
import { useState } from "react";

interface TitleSelectionStepProps {
  suggestedTitles: string[];
  onTitleSelect: (title: string) => void;
  isProcessing: boolean;
}

export function TitleSelectionStep({ suggestedTitles, onTitleSelect, isProcessing }: TitleSelectionStepProps) {
  const [customTitle, setCustomTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleCustomTitleSubmit = () => {
    if (customTitle.trim()) {
      onTitleSelect(customTitle);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
        <h3 className="text-lg font-medium">Escolha o Título</h3>
        <p className="text-sm text-muted-foreground">Selecione uma sugestão ou crie seu próprio título</p>
      </div>

      {isEditing ? (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Digite seu título personalizado..."
                className="text-base"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCustomTitleSubmit}
                  disabled={!customTitle.trim() || isProcessing}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Usar Título
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {suggestedTitles.map((title, index) => (
            <Card key={index} className="hover:border-primary transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-center gap-4">
                  <p className="text-base flex-1">{title}</p>
                  <Button
                    onClick={() => onTitleSelect(title)}
                    disabled={isProcessing}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Usar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Criar Título Personalizado
          </Button>
        </div>
      )}

      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Dica do Assistente</h4>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Um bom título deve ser conciso e informativo. Use entre 50-60 caracteres para melhor SEO.
        </p>
      </div>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Edit, Check } from "lucide-react";
import { useState } from "react";

interface TitleSelectionStepProps {
  suggestedTitles: string[];
  onTitleSelect: (title: string) => void;
  isProcessing: boolean;
  onNextStep: () => Promise<string | undefined>;
}

export function TitleSelectionStep({ suggestedTitles, onTitleSelect, isProcessing, onNextStep }: TitleSelectionStepProps) {
  const [customTitle, setCustomTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null);
  const [editedTitles, setEditedTitles] = useState<string[]>([...suggestedTitles]);

  const handleCustomTitleSubmit = async () => {
    if (customTitle.trim()) {
      await onTitleSelect(customTitle);
      onNextStep();
    }
  };

  const handleSelectTitle = async (title: string) => {
    await onTitleSelect(title);
    onNextStep();
  };

  const handleEditTitle = (index: number, newTitle: string) => {
    const newTitles = [...editedTitles];
    newTitles[index] = newTitle;
    setEditedTitles(newTitles);
  };

  const handleSaveEdit = (index: number) => {
    setEditingTitleIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
        <h3 className="text-lg font-medium">Escolha o Título</h3>
        <p className="text-sm text-muted-foreground">Selecione uma sugestão ou crie seu próprio título</p>
      </div>

      {isEditing ? (
        <Card className="bg-card">
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
                  variant="outline"
                  onClick={handleCustomTitleSubmit}
                  disabled={!customTitle.trim() || isProcessing}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {editedTitles.map((title, index) => (
            <Card key={index} className="hover:border-primary transition-colors bg-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-center gap-4">
                  {editingTitleIndex === index ? (
                    <Input
                      value={title}
                      onChange={(e) => handleEditTitle(index, e.target.value)}
                      className="flex-1"
                    />
                  ) : (
                    <p className="text-base flex-1">{title}</p>
                  )}
                  <div className="flex gap-2">
                    {editingTitleIndex === index ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveEdit(index)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTitleIndex(index)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectTitle(title)}
                          disabled={isProcessing}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Enviar
                        </Button>
                      </>
                    )}
                  </div>
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

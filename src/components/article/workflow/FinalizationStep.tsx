
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, AlertCircle, Check } from "lucide-react";

interface FinalizationStepProps {
  title: string;
  content: string;
  selectedImage: any;
  onFinalize: () => void;
  isProcessing: boolean;
}

export function FinalizationStep({ 
  title, 
  content, 
  selectedImage,
  onFinalize,
  isProcessing 
}: FinalizationStepProps) {
  const checkSteps = [
    {
      label: "Título",
      isComplete: Boolean(title?.trim()),
      details: title || "Nenhum título definido"
    },
    {
      label: "Conteúdo",
      isComplete: Boolean(content?.trim()),
      details: `${content?.length || 0} caracteres`
    },
    {
      label: "Imagem",
      isComplete: Boolean(selectedImage),
      details: selectedImage ? "Imagem selecionada" : "Nenhuma imagem selecionada"
    }
  ];

  const allComplete = checkSteps.every(step => step.isComplete);

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
        <h3 className="text-lg font-medium">Finalização</h3>
        <p className="text-sm text-muted-foreground">Revise seu artigo antes de finalizar</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {checkSteps.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {step.isComplete ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                  <div>
                    <p className="font-medium">{step.label}</p>
                    <p className="text-sm text-muted-foreground">{step.details}</p>
                  </div>
                </div>
                <Badge 
                  variant={step.isComplete ? "default" : "secondary"}
                >
                  {step.isComplete ? "Completo" : "Pendente"}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button
              className="w-full"
              onClick={onFinalize}
              disabled={!allComplete || isProcessing}
            >
              <Send className="h-4 w-4 mr-2" />
              {isProcessing ? "Processando..." : "Finalizar Artigo"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

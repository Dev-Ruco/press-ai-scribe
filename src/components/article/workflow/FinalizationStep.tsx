
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, AlertCircle, Check, Globe, FileText } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { sendArticleToN8N } from "@/utils/webhookUtils";
import { useToast } from "@/hooks/use-toast";
import { N8N_WEBHOOK_URL } from "@/utils/webhook/types";

interface FinalizationStepProps {
  title: string;
  content: string;
  selectedImage: any;
  onFinalize: () => void;
  isProcessing: boolean;
  onNextStep?: () => Promise<string | undefined>;
}

export function FinalizationStep({ 
  title, 
  content, 
  selectedImage,
  onFinalize,
  isProcessing,
  onNextStep
}: FinalizationStepProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const platforms = [
    {
      id: 'wordpress',
      name: 'WordPress',
      icon: FileText,
      configured: true
    },
    {
      id: 'website',
      name: 'Website Principal',
      icon: Globe,
      configured: true
    },
    {
      id: 'medium',
      name: 'Medium',
      icon: FileText,
      configured: false
    }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleFinalize = async () => {
    setIsPublishing(true);
    
    try {
      // Enviar os dados para o webhook N8N no formato exigido
      await sendArticleToN8N(
        content,
        "Artigo", // Use o valor padrão ou use um valor real se disponível
        [], // Não temos arquivos neste ponto
        [] // Não temos links neste ponto
      );
      
      toast({
        title: "Artigo publicado",
        description: `Artigo enviado com sucesso para ${N8N_WEBHOOK_URL}!`
      });
      
      // Chamar as funções de callback
      onFinalize();
      if (onNextStep) {
        await onNextStep();
      }
    } catch (error) {
      console.error("Erro ao publicar artigo:", error);
      toast({
        title: "Erro",
        description: `Não foi possível publicar o artigo: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

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
      <div className="border-l-4 border-primary pl-4 py-2 bg-background">
        <h3 className="text-lg font-medium">Finalização</h3>
        <p className="text-sm text-muted-foreground">Revise seu artigo e selecione as plataformas para publicação</p>
      </div>

      <Card className="bg-background">
        <CardContent className="p-6">
          <div className="space-y-4">
            {checkSteps.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded bg-background">
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
        </CardContent>
      </Card>

      <Card className="bg-background">
        <CardContent className="p-6">
          <h4 className="font-medium text-base mb-4">Plataformas de Publicação</h4>
          <div className="space-y-3">
            {platforms.map((platform) => (
              <div 
                key={platform.id} 
                className="flex items-center justify-between p-3 border rounded bg-background"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={platform.id}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => handlePlatformToggle(platform.id)}
                    disabled={!platform.configured}
                  />
                  <platform.icon className="h-5 w-5 text-muted-foreground" />
                  <label htmlFor={platform.id} className="text-sm font-medium cursor-pointer">
                    {platform.name}
                  </label>
                </div>
                {!platform.configured && (
                  <Button variant="outline" size="sm">Configurar</Button>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleFinalize}
            disabled={!allComplete || isProcessing || isPublishing || selectedPlatforms.length === 0}
            className="w-full mt-6"
          >
            {isProcessing || isPublishing ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Publicar Artigo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

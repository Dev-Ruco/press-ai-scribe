
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CreateArticleHeaderProps {
  step: number;
  substep: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  progress: number;
  isFirstStep: boolean;
}

export function CreateArticleHeader({
  step,
  substep,
  onPrevStep,
  onNextStep,
  progress,
  isFirstStep
}: CreateArticleHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b pb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="bg-primary text-white font-medium rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
            {step}
          </span>
          <h2 className="text-xl font-bold">
            {step === 1 && "Upload & Configuração"}
            {step === 2 && "Títulos & Fontes"}
            {step === 3 && "Escrita Assistida"}
            {step === 4 && "Materiais Visuais"}
            {step === 5 && "Revisão & Publicação"}
          </h2>
        </div>
        <div className="text-sm text-text-secondary">
          {step === 2 && `Passo ${substep}/4`}
        </div>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPrevStep}
          disabled={isFirstStep}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button 
          size="sm" 
          onClick={onNextStep}
        >
          Próximo
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export type ProcessingStep = {
  id: string;
  label: string;
  status: "idle" | "processing" | "completed" | "error";
};

export type ProcessingStage = "idle" | "uploading" | "analyzing" | "extracting" | "organizing" | "completed" | "error";

interface ProcessingOverlayProps {
  isVisible: boolean;
  currentStage: ProcessingStage;
  progress: number;
  statusMessage: string;
  error?: string;
  onCancel?: () => void;
}

export function ProcessingOverlay({
  isVisible,
  currentStage,
  progress,
  statusMessage,
  error,
  onCancel
}: ProcessingOverlayProps) {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: "uploading", label: "Enviando arquivos", status: "idle" },
    { id: "analyzing", label: "Analisando conteúdo", status: "idle" },
    { id: "extracting", label: "Extraindo informações", status: "idle" },
    { id: "organizing", label: "Organizando dados", status: "idle" }
  ]);

  useEffect(() => {
    // Atualizar o status dos passos com base no estágio atual
    setSteps(prevSteps => prevSteps.map(step => {
      if (step.id === currentStage) {
        return { ...step, status: "processing" };
      } else if (
        (step.id === "uploading" && ["analyzing", "extracting", "organizing", "completed"].includes(currentStage)) ||
        (step.id === "analyzing" && ["extracting", "organizing", "completed"].includes(currentStage)) ||
        (step.id === "extracting" && ["organizing", "completed"].includes(currentStage)) ||
        (step.id === "organizing" && ["completed"].includes(currentStage))
      ) {
        return { ...step, status: "completed" };
      } else if (currentStage === "error") {
        return { ...step, status: step.status === "processing" ? "error" : step.status };
      } else {
        return step;
      }
    }));
  }, [currentStage]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card shadow-lg rounded-lg p-6 max-w-md w-full space-y-6 relative">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Processando Conteúdo</h3>
          <p className="text-muted-foreground mt-1">{statusMessage}</p>
        </div>

        <div className="space-y-6">
          <div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2 text-center">{progress}% concluído</p>
          </div>

          <ul className="space-y-4">
            {steps.map((step) => (
              <li key={step.id} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {step.status === "processing" && (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  )}
                  {step.status === "completed" && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {step.status === "error" && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  {step.status === "idle" && (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className={`text-sm font-medium ${
                    step.status === "processing" ? "text-primary" : 
                    step.status === "completed" ? "text-green-500" : 
                    step.status === "error" ? "text-red-500" : 
                    "text-muted-foreground"
                  }`}>
                    {step.label}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {onCancel && (
          <button 
            onClick={onCancel}
            className="text-sm text-muted-foreground hover:text-foreground mt-4 absolute bottom-4 right-6"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

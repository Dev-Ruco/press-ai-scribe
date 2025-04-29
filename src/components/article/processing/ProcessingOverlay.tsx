
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

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
  estimatedTimeRemaining?: number;
}

export function ProcessingOverlay({
  isVisible,
  currentStage,
  progress,
  statusMessage,
  error,
  onCancel,
  estimatedTimeRemaining
}: ProcessingOverlayProps) {
  const { t } = useLanguage();
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: "uploading", label: t('uploadingFiles'), status: "idle" },
    { id: "analyzing", label: t('analyzing'), status: "idle" },
    { id: "extracting", label: t('generating'), status: "idle" },
    { id: "organizing", label: t('processing'), status: "idle" }
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
  }, [currentStage, t]);

  const formatTimeRemaining = (ms?: number) => {
    if (!ms) return null;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds} segundos`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minuto${minutes > 1 ? 's' : ''} ${seconds % 60} segundo${seconds % 60 !== 1 ? 's' : ''}`;
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${currentStage === "completed" ? "animate-fade-out" : ""}`}>
      <div className="bg-card shadow-lg rounded-lg p-6 max-w-md w-full space-y-6 relative">
        <div className="text-center">
          <h3 className="text-lg font-semibold">{t('processing')}</h3>
          <p className="text-muted-foreground mt-1">{statusMessage}</p>
          
          {estimatedTimeRemaining && currentStage !== "completed" && currentStage !== "error" && (
            <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Tempo estimado: {formatTimeRemaining(estimatedTimeRemaining)}</span>
            </div>
          )}
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
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  {step.status === "idle" && (
                    <div className="h-5 w-5 border-2 border-muted rounded-full" />
                  )}
                </div>
                <span className={`text-sm ${
                  step.status === "processing" ? "text-primary font-medium" : 
                  step.status === "completed" ? "text-green-500" : 
                  step.status === "error" ? "text-destructive" : 
                  "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
              </li>
            ))}
          </ul>
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {onCancel && currentStage !== "completed" && currentStage !== "error" && (
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="text-muted-foreground"
              >
                {t('cancel')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


import { FileText, CheckCircle } from "lucide-react";

interface WorkflowStep {
  id: string;
  label: string;
  completed?: boolean;
  current?: boolean;
}

interface WorkflowProgressProps {
  currentStep: string;
}

export function WorkflowProgress({ currentStep }: WorkflowProgressProps) {
  const steps: WorkflowStep[] = [
    { id: "upload", label: "Upload" },
    { id: "type-selection", label: "Tipo" },
    { id: "title-selection", label: "Título" },
    { id: "content-editing", label: "Conteúdo" },
    { id: "finalization", label: "Finalização" }
  ].map(step => ({
    ...step,
    completed: getStepIndex(currentStep) > getStepIndex(step.id),
    current: currentStep === step.id
  }));

  function getStepIndex(stepId: string): number {
    return steps.findIndex(s => s.id === stepId);
  }

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center rounded-full w-8 h-8 ${
              step.completed
                ? "bg-primary/10 text-primary"
                : step.current
                ? "bg-primary/5 text-primary border-2 border-primary"
                : "bg-muted/30 text-muted-foreground"
            }`}
          >
            {step.completed ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <span className="text-sm">{index + 1}</span>
            )}
          </div>
          
          <div className="flex flex-col items-center mx-1">
            <span
              className={`text-xs ${
                step.current ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`h-px w-8 ${
                step.completed ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

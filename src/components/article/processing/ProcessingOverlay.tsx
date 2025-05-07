
import { AlertCircle, CheckCircle, Loader, X, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

export interface ProcessingOverlayProps {
  isVisible: boolean;
  currentStage?: "uploading" | "analyzing" | "completed" | "error" | "waiting";
  stage?: "uploading" | "analyzing" | "completed" | "error" | "waiting";
  progress: number;
  statusMessage: string;
  error?: string;
  onCancel: () => void;
  onRetry?: () => void;
  elapsedTime?: number; // Tempo decorrido em segundos
}

export function ProcessingOverlay({
  isVisible,
  currentStage,
  stage,
  progress,
  statusMessage,
  error,
  onCancel,
  onRetry,
  elapsedTime
}: ProcessingOverlayProps) {
  const [opacity, setOpacity] = useState("opacity-0");
  
  // Use either currentStage or stage property (for backward compatibility)
  const activeStage = stage || currentStage || "uploading";
  
  // Format elapsed time as mm:ss
  const formattedElapsedTime = elapsedTime 
    ? `${Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:${(elapsedTime % 60).toString().padStart(2, '0')}`
    : null;

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setOpacity("opacity-100"), 50);
      return () => clearTimeout(timer);
    } else {
      setOpacity("opacity-0");
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${opacity}`}>
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Processando conteúdo</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="flex-1">{statusMessage}</span>
              <span className="ml-2 flex items-center">
                {formattedElapsedTime && (
                  <span className="mr-2 text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formattedElapsedTime}
                  </span>
                )}
                <span>{progress}%</span>
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Status Icon */}
          <div className="flex justify-center my-6">
            {activeStage === "uploading" && (
              <div className="bg-blue-50 p-4 rounded-full">
                <Loader className="h-10 w-10 text-blue-500 animate-spin" />
              </div>
            )}
            
            {activeStage === "analyzing" && (
              <div className="bg-amber-50 p-4 rounded-full">
                <Loader className="h-10 w-10 text-amber-500 animate-spin" />
              </div>
            )}
            
            {activeStage === "waiting" && (
              <div className="bg-purple-50 p-4 rounded-full">
                <Loader className="h-10 w-10 text-purple-500 animate-spin" />
              </div>
            )}
            
            {activeStage === "completed" && (
              <div className="bg-green-50 p-4 rounded-full">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            )}
            
            {activeStage === "error" && (
              <div className="bg-red-50 p-4 rounded-full">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
            )}
          </div>

          {/* Processing Stage Indicator */}
          <div className="grid grid-cols-4 gap-1 mb-4">
            <div className={`h-1.5 rounded ${progress >= 25 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`h-1.5 rounded ${progress >= 50 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`h-1.5 rounded ${progress >= 75 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`h-1.5 rounded ${progress >= 100 ? 'bg-primary' : 'bg-muted'}`}></div>
          </div>
          
          {/* Current Processing Stage */}
          <div className="text-xs text-muted-foreground text-center">
            {activeStage === "uploading" && "Enviando conteúdo..."}
            {activeStage === "analyzing" && "Analisando conteúdo..."}
            {activeStage === "waiting" && "Aguardando resposta do servidor..."}
            {activeStage === "completed" && "Processamento concluído!"}
            {activeStage === "error" && "Ocorreu um erro"}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Erro:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Long running process message */}
          {(activeStage === "analyzing" || activeStage === "waiting") && progress >= 85 && (
            <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm">
              <p className="font-medium">O processamento está demorando mais que o esperado</p>
              <p>O sistema está aguardando a resposta do servidor. Isto pode levar alguns minutos.</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end gap-2 pt-2">
            {/* Show retry button only on error */}
            {activeStage === "error" && onRetry && (
              <Button 
                variant="outline" 
                onClick={onRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar Novamente
              </Button>
            )}
            <Button 
              variant={activeStage === "completed" ? "default" : "outline"} 
              onClick={onCancel}
            >
              {activeStage === "completed" ? "Concluído" : "Cancelar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

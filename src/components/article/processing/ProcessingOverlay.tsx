
import { AlertCircle, CheckCircle, Loader, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

export interface ProcessingOverlayProps {
  isVisible: boolean;
  currentStage?: string;
  stage?: "uploading" | "analyzing" | "completed" | "error";
  progress: number;
  statusMessage: string;
  error?: string;
  onCancel: () => void;
}

export function ProcessingOverlay({
  isVisible,
  currentStage,
  stage,
  progress,
  statusMessage,
  error,
  onCancel
}: ProcessingOverlayProps) {
  const [opacity, setOpacity] = useState("opacity-0");
  
  // Use either currentStage or stage property (for backward compatibility)
  const activeStage = stage || currentStage || "uploading";

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
              <span>{statusMessage}</span>
              <span>{progress}%</span>
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Erro:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
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

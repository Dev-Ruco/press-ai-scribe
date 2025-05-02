
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ProcessingStatus } from "@/types/processing";
import { Skeleton } from "@/components/ui/skeleton";

interface ProcessingOverlayProps {
  isVisible: boolean;
  currentStage: ProcessingStatus['stage'];
  progress: number;
  statusMessage: string;
  error?: string;
  onCancel?: () => void;
  estimatedTimeRemaining?: number;
  webhookUrl?: string;
}

export function ProcessingOverlay({
  isVisible,
  currentStage,
  progress,
  statusMessage,
  error,
  onCancel,
  estimatedTimeRemaining,
  webhookUrl
}: ProcessingOverlayProps) {
  if (!isVisible) return null;

  const formatTimeRemaining = (ms?: number) => {
    if (!ms) return '';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const getStageEmoji = (stage: ProcessingStatus['stage']) => {
    switch(stage) {
      case 'uploading': return '📤';
      case 'analyzing': return '🔍';
      case 'extracting': return '📋';
      case 'organizing': return '📝';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const isError = currentStage === 'error';

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background border rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <span className="mr-2">
              {getStageEmoji(currentStage)}
            </span>
            Processando conteúdo
            {currentStage === 'uploading' && " (Enviando arquivos...)"}
          </h3>
          {onCancel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          <Progress value={progress} className="h-2 w-full" />
          
          <div className="text-sm">
            <div className="font-medium mb-1">{statusMessage}</div>
            {error && (
              <div className="text-destructive text-sm mt-1 bg-destructive/10 p-2 rounded border border-destructive/20">
                {error}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-xs text-muted-foreground">
              {isError ? 'Status:' : 'Estágio:'}
              <span className={`ml-1 font-medium ${isError ? 'text-destructive' : 'text-foreground'}`}>
                {isError ? 'Falha' : currentStage === 'completed' ? 'Concluído' : `${progress}%`}
              </span>
            </div>
            {!isError && estimatedTimeRemaining && progress < 100 ? (
              <div className="text-xs text-muted-foreground text-right">
                Tempo restante: 
                <span className="ml-1 font-medium text-foreground">
                  {formatTimeRemaining(estimatedTimeRemaining)}
                </span>
              </div>
            ) : null}
          </div>
          
          {webhookUrl && (
            <div className="text-xs text-muted-foreground mt-4 border-t pt-2">
              <span>Enviando para: </span>
              <span className="font-mono text-xs break-all">{webhookUrl}</span>
            </div>
          )}
          
          {isError && onCancel && (
            <Button 
              onClick={onCancel} 
              variant="outline" 
              className="w-full mt-2"
            >
              Fechar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

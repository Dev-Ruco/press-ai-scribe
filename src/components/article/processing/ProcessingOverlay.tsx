
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { XCircle, Link2, AlertTriangle } from 'lucide-react';

interface ProcessingOverlayProps {
  isVisible: boolean;
  currentStage: 'idle' | 'uploading' | 'analyzing' | 'extracting' | 'organizing' | 'completed' | 'error';
  progress: number;
  statusMessage: string;
  error?: string;
  onCancel: () => void;
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
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  
  useEffect(() => {
    if (estimatedTimeRemaining) {
      const seconds = Math.floor(estimatedTimeRemaining / 1000);
      if (seconds < 60) {
        setTimeRemaining(`${seconds} segundos`);
      } else {
        setTimeRemaining(`${Math.floor(seconds / 60)}m ${seconds % 60}s`);
      }
    } else {
      setTimeRemaining('');
    }
  }, [estimatedTimeRemaining]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-background bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg shadow-lg p-6 max-w-md w-full space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Processando conteúdo</h3>
            {webhookUrl && (
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Link2 className="h-3 w-3" />
                <span className="truncate max-w-[180px]">{webhookUrl}</span>
              </div>
            )}
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{getStageLabel(currentStage)}</span>
            <span>{progress}%</span>
          </div>
          
          <div className="bg-muted p-3 rounded text-sm">
            {statusMessage}
          </div>
          
          {timeRemaining && (
            <div className="text-xs text-muted-foreground text-center">
              Tempo estimado restante: {timeRemaining}
            </div>
          )}
          
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Erro no processamento</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Cancelar processamento
          </Button>
        </div>
      </div>
    </div>
  );
}

function getStageLabel(stage: string) {
  switch (stage) {
    case 'uploading':
      return 'Enviando arquivos...';
    case 'analyzing':
      return 'Analisando conteúdo...';
    case 'extracting':
      return 'Extraindo informações...';
    case 'organizing':
      return 'Organizando dados...';
    case 'completed':
      return 'Processamento concluído';
    case 'error':
      return 'Erro no processamento';
    default:
      return 'Processando...';
  }
}

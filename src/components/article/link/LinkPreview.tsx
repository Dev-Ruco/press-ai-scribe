
import { Link2, X, AlertCircle, Clock, Loader, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LinkPreviewProps {
  links: Array<{
    url: string;
    id: string;
    status?: 'queued' | 'processing' | 'completed' | 'error';
    error?: string;
  }>;
  onRemove: (id: string) => void;
}

export function LinkPreview({ links, onRemove }: LinkPreviewProps) {
  if (links.length === 0) return null;

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'processing':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'queued':
        return 'Em fila';
      case 'processing':
        return 'Processando';
      case 'completed':
        return 'Concluído';
      case 'error':
        return 'Erro';
      default:
        return 'Em fila';
    }
  };

  return (
    <div className="space-y-2">
      {links.map(link => (
        <Card key={link.id} className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Link2 className="h-5 w-5 text-primary/70" />
              <div className="flex-1">
                <p className="text-sm font-medium break-all">
                  {link.url.length > 50 ? link.url.substring(0, 47) + '...' : link.url}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {getStatusIcon(link.status)}
                  <p className={`text-xs ${
                    link.status === 'error' ? 'text-destructive' : 
                    link.status === 'completed' ? 'text-green-500' :
                    link.status === 'processing' ? 'text-blue-500' : 
                    'text-muted-foreground'
                  }`}>
                    {getStatusText(link.status)}
                  </p>
                </div>
                {link.status === 'error' && link.error && (
                  <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{link.error}</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onRemove(link.id)}
              disabled={link.status === 'processing'}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

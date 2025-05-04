
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendArticleToN8N } from '@/utils/webhookUtils';

interface QueueItem {
  id: string;
  file: File;
  status: 'queued' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export function useProcessQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const addToQueue = (files: File[]) => {
    const newItems: QueueItem[] = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      status: 'queued',
      progress: 0
    }));
    
    setQueue(prev => [...prev, ...newItems]);
  };

  const removeFromQueue = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const processQueue = async () => {
    const queuedItems = queue.filter(item => item.status === 'queued');
    if (queuedItems.length === 0) return;
    
    setIsProcessing(true);
    
    for (const item of queuedItems) {
      try {
        // Update status to uploading
        setQueue(prev => 
          prev.map(q => q.id === item.id 
            ? { ...q, status: 'uploading', progress: 10 } 
            : q
          )
        );
        
        // Process the file (simplified without using real storage)
        const result = await sendArticleToN8N(
          "Processando arquivo", 
          "Upload",
          [{
            url: URL.createObjectURL(item.file),
            fileName: item.file.name,
            mimeType: item.file.type,
            fileType: 'document',
            fileSize: item.file.size
          }],
          []
        );
        
        if (result?.success) {
          // Update queue item to completed
          setQueue(prev => 
            prev.map(q => q.id === item.id 
              ? { ...q, status: 'completed', progress: 100 } 
              : q
            )
          );
        } else {
          throw new Error(result?.error || "Falha no processamento do arquivo");
        }
      } catch (error) {
        console.error(`Error processing file ${item.file.name}:`, error);
        
        // Update queue item to error
        setQueue(prev => 
          prev.map(q => q.id === item.id 
            ? { 
                ...q, 
                status: 'error', 
                progress: 0, 
                error: error instanceof Error ? error.message : "Erro desconhecido" 
              } 
            : q
          )
        );
        
        toast({
          variant: "destructive",
          title: `Erro ao processar ${item.file.name}`,
          description: error instanceof Error ? error.message : "Erro desconhecido"
        });
      }
    }
    
    setIsProcessing(false);
  };

  return {
    queue,
    addToQueue,
    removeFromQueue,
    processQueue,
    isProcessing
  };
}


import { useState, useCallback } from 'react';
import { useToast } from "./use-toast";
import { chunkedUpload } from '@/utils/webhookUtils';

interface QueuedFile {
  file: File;
  id: string;
  progress: number;
  status: 'queued' | 'uploading' | 'completed' | 'error';
  error?: string;
}

const MAX_CONCURRENT_UPLOADS = 3;

export function useUploadQueue() {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const updateFileStatus = useCallback((fileId: string, updates: Partial<QueuedFile>) => {
    setQueue(prev => prev.map(item => 
      item.id === fileId ? { ...item, ...updates } : item
    ));
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const pendingFiles = queue.filter(f => f.status === 'queued');
      if (pendingFiles.length === 0) {
        setIsProcessing(false);
        return;
      }

      // Process files in parallel with limit
      const processBatch = async (files: QueuedFile[]) => {
        await Promise.all(files.map(async (queuedFile) => {
          try {
            updateFileStatus(queuedFile.id, { status: 'uploading', progress: 0 });
            await chunkedUpload(queuedFile.file, queuedFile.id);
            updateFileStatus(queuedFile.id, { status: 'completed', progress: 100 });
          } catch (error) {
            console.error(`Error uploading file ${queuedFile.file.name}:`, error);
            updateFileStatus(queuedFile.id, { 
              status: 'error', 
              error: error.message || 'Upload failed'
            });
            toast({
              variant: "destructive",
              title: `Erro ao enviar ${queuedFile.file.name}`,
              description: error.message || 'Falha no upload do arquivo'
            });
          }
        }));
      };

      // Process in batches of MAX_CONCURRENT_UPLOADS
      while (queue.some(f => f.status === 'queued')) {
        const batch = queue
          .filter(f => f.status === 'queued')
          .slice(0, MAX_CONCURRENT_UPLOADS);
        
        await processBatch(batch);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [queue, isProcessing, updateFileStatus, toast]);

  const addToQueue = useCallback((files: File[]) => {
    const newFiles = files.map(file => ({
      file,
      id: crypto.randomUUID(),
      progress: 0,
      status: 'queued' as const
    }));

    setQueue(prev => [...prev, ...newFiles]);
    processQueue();
  }, [processQueue]);

  const removeFromQueue = useCallback((fileId: string) => {
    setQueue(prev => prev.filter(f => f.id !== fileId));
  }, []);

  return {
    queue,
    addToQueue,
    removeFromQueue,
    isProcessing
  };
}

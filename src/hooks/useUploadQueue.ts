
import { useState, useCallback, useRef } from 'react';
import { useToast } from "./use-toast";

interface QueuedFile {
  file: File;
  id: string;
  progress: number;
  status: 'queued' | 'uploading' | 'completed' | 'error';
  error?: string;
  retries?: number;
}

const MAX_CONCURRENT_UPLOADS = 3;
const MAX_RETRIES = 3;

export function useUploadQueue() {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef<boolean>(false);
  const { toast } = useToast();

  const updateFileStatus = useCallback((fileId: string, updates: Partial<QueuedFile>) => {
    setQueue(prev => prev.map(item => 
      item.id === fileId ? { ...item, ...updates } : item
    ));
  }, []);

  // Simplified mock upload function since chunkedUpload is not available
  const uploadFile = async (file: File, fileId: string, onProgress: (progress: number) => void) => {
    // Simulating progress in steps
    for (let i = 0; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const progress = i * 10;
      onProgress(progress);
    }
    return { success: true };
  };

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessing(true);

    try {
      const pendingFiles = queue.filter(f => f.status === 'queued');
      if (pendingFiles.length === 0) {
        processingRef.current = false;
        setIsProcessing(false);
        return;
      }

      // Process files in parallel with limit
      const processBatch = (files: QueuedFile[]) => {
        return files.map(async (queuedFile) => {
          try {
            updateFileStatus(queuedFile.id, { status: 'uploading', progress: 0 });
            
            const onProgress = (progress: number) => {
              updateFileStatus(queuedFile.id, { progress });
            };
            
            await uploadFile(queuedFile.file, queuedFile.id, onProgress);
            updateFileStatus(queuedFile.id, { status: 'completed', progress: 100 });
            
            return { success: true, fileId: queuedFile.id };
          } catch (error) {
            console.error(`Error uploading file ${queuedFile.file.name}:`, error);
            
            const currentRetries = queuedFile.retries || 0;
            if (currentRetries < MAX_RETRIES) {
              console.log(`Retrying file ${queuedFile.file.name}, attempt ${currentRetries + 1}`);
              updateFileStatus(queuedFile.id, { 
                status: 'queued',
                progress: 0,
                retries: currentRetries + 1
              });
              
              return { success: false, retry: true, fileId: queuedFile.id };
            }
            
            updateFileStatus(queuedFile.id, { 
              status: 'error', 
              error: error.message || 'Upload failed'
            });
            
            toast({
              variant: "destructive",
              title: `Erro ao enviar ${queuedFile.file.name}`,
              description: error.message || 'Falha no upload do arquivo'
            });
            
            return { success: false, retry: false, fileId: queuedFile.id };
          }
        });
      };

      // Process in batches
      const startProcessing = async () => {
        let allProcessed = false;
        
        while (!allProcessed) {
          const pendingFiles = queue.filter(f => f.status === 'queued');
          
          if (pendingFiles.length === 0) {
            allProcessed = true;
            break;
          }
          
          const batch = pendingFiles.slice(0, MAX_CONCURRENT_UPLOADS);
          const results = await Promise.all(processBatch(batch));
          
          if (results.every(r => !r.retry)) {
            const remainingQueued = queue.filter(f => f.status === 'queued');
            if (remainingQueued.length === 0) {
              allProcessed = true;
            }
          }
          
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        processingRef.current = false;
        setIsProcessing(false);
      };

      startProcessing();
    } catch (error) {
      console.error("Error processing queue:", error);
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [queue, updateFileStatus, toast]);

  const addToQueue = useCallback((files: File[]) => {
    const newFiles = files.map(file => ({
      file,
      id: crypto.randomUUID(),
      progress: 0,
      status: 'queued' as const,
      retries: 0
    }));

    setQueue(prev => [...prev, ...newFiles]);
  }, []);

  const removeFromQueue = useCallback((fileId: string) => {
    setQueue(prev => prev.filter(f => f.id !== fileId));
  }, []);

  return {
    queue,
    addToQueue,
    removeFromQueue,
    isProcessing,
    processQueue
  };
}

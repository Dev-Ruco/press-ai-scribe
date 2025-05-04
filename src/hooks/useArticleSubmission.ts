
import { useState } from 'react';
import { useToast } from './use-toast';
import { submitArticleToN8N } from '@/utils/articleSubmissionUtils';
import { ProcessingStatus } from '@/types/processing';

export interface UploadedFile {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  fileType: 'audio' | 'document' | 'image';
  fileSize: number;
  status: string;
  progress: number;
}

export function useArticleSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    stage: 'uploading',
    progress: 0,
    message: 'Preparando envio...'
  });
  const { toast } = useToast();
  
  const submitArticle = async (
    content: string,
    articleType: string,
    files: UploadedFile[] = [],
    links: string[] = [],
    onSuccess?: () => void
  ) => {
    setIsSubmitting(true);
    setProcessingStatus({
      stage: 'uploading',
      progress: 10,
      message: 'Preparando envio...'
    });
    
    try {
      // Update processing status to let user know we're proceeding
      setProcessingStatus({
        stage: 'uploading',
        progress: 30,
        message: 'Enviando dados para processamento...'
      });
      
      // Submit to the service
      const result = await submitArticleToN8N(
        content,
        articleType,
        files,
        links,
        (stage, progress, message, error) => {
          setProcessingStatus({
            stage,
            progress,
            message,
            error
          });
        },
        onSuccess
      );
      
      if (result.success) {
        setProcessingStatus({
          stage: 'completed',
          progress: 100,
          message: 'Processamento concluído com sucesso!'
        });
        
        return {
          success: true,
          status: {
            stage: 'completed',
            progress: 100,
            message: 'Processamento concluído!'
          }
        };
      } else {
        setProcessingStatus({
          stage: 'error',
          progress: 0,
          message: 'Erro no processamento.',
          error: result.status.error || 'Erro desconhecido'
        });
        
        return result;
      }
    } catch (error) {
      console.error("Error in submitArticle:", error);
      setProcessingStatus({
        stage: 'error',
        progress: 0,
        message: 'Erro durante o envio.',
        error: error.message
      });
      
      return {
        success: false,
        status: {
          stage: 'error',
          progress: 0,
          message: 'Erro durante o envio.',
          error: error.message
        }
      };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const cancelProcessing = () => {
    setIsSubmitting(false);
    setProcessingStatus({
      stage: 'error',
      progress: 0,
      message: 'Processamento cancelado.'
    });
  };
  
  return {
    isSubmitting,
    processingStatus,
    submitArticle,
    cancelProcessing
  };
}

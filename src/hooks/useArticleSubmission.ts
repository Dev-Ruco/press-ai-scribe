
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
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string; // Added error property for consistency
}

export function useArticleSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    stage: 'uploading',
    progress: 0,
    message: 'Preparando envio...'
  });
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const { toast } = useToast();
  
  const submitArticle = async (
    content: string,
    articleType: string,
    files: UploadedFile[] = [],
    links: string[] = [],
    onSuccess?: (suggestedTitles?: string[]) => void
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
        stage: 'analyzing',
        progress: 30,
        message: '🧠 A estruturar a informação recebida... Em breve receberá sugestões de títulos para o seu artigo.'
      });
      
      // Submit to the service
      const result = await submitArticleToN8N(
        content,
        articleType,
        files.map(file => ({
          id: file.id,
          url: file.url,
          fileName: file.fileName,
          mimeType: file.mimeType,
          fileType: file.fileType,
          fileSize: file.fileSize,
          status: file.status,
          progress: file.progress
        })),
        links,
        (stage, progress, message, error) => {
          setProcessingStatus({
            stage,
            progress,
            message,
            error
          });
        },
        (titles) => {
          // Store the suggested titles
          if (titles && titles.length > 0) {
            setSuggestedTitles(titles);
          }
          
          // Call the original onSuccess callback with the titles
          if (onSuccess) {
            onSuccess(titles);
          }
        }
      );
      
      if (result.success) {
        // Store the suggested titles from the result
        if (result.suggestedTitles && result.suggestedTitles.length > 0) {
          setSuggestedTitles(result.suggestedTitles);
        }

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
          },
          suggestedTitles: result.suggestedTitles || []
        };
      } else {
        setProcessingStatus({
          stage: 'error',
          progress: 0,
          message: '⚠️ Ocorreu um erro ao gerar os títulos. Pode tentar novamente ou inserir manualmente.',
          error: result.status.error || 'Erro desconhecido'
        });
        
        return result;
      }
    } catch (error) {
      console.error("Error in submitArticle:", error);
      setProcessingStatus({
        stage: 'error',
        progress: 0,
        message: '⚠️ Ocorreu um erro ao gerar os títulos. Pode tentar novamente ou inserir manualmente.',
        error: error.message
      });
      
      return {
        success: false,
        status: {
          stage: 'error',
          progress: 0,
          message: '⚠️ Ocorreu um erro ao gerar os títulos. Pode tentar novamente ou inserir manualmente.',
          error: error.message
        },
        suggestedTitles: []
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
    suggestedTitles,
    submitArticle,
    cancelProcessing
  };
}

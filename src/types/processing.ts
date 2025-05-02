
export interface ProcessingStatus {
  stage: 'idle' | 'uploading' | 'analyzing' | 'extracting' | 'organizing' | 'completed' | 'error';
  progress: number;
  message: string;
  error?: string;
}

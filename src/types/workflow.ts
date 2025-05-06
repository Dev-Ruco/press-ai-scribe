
import { ArticleTypeObject } from "@/types/article";

export interface WorkflowState {
  step: string;
  files: any[];
  content: string;
  articleType: ArticleTypeObject;
  title: string;
  isProcessing: boolean;
  processingStatus: string;
  processingStage: string;
  processingProgress: number;
  processingMessage: string;
  selectedImage: any;
  articleId: string | null;
  agentConfirmed: boolean;
  suggestedTitles: string[];
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export type WorkflowStep = 
  | "upload"
  | "title-selection" 
  | "content-editing"
  | "image-selection"
  | "finalization";

export interface WorkflowStateUpdate extends Partial<WorkflowState> {}

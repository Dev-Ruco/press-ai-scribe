import { useToast } from "@/hooks/use-toast";
import { N8N_WEBHOOK_URL } from '@/utils/webhook/types';
import { sendArticleToN8N } from '@/utils/webhookUtils';
import { ProcessingStatus } from '@/types/processing';
import { supabase } from '@/integrations/supabase/client';

export interface UploadedFile {
  url: string;
  fileName: string;
  mimeType: string;
  fileType: 'audio' | 'document' | 'image' | 'video';
  fileSize: number;
  status?: 'uploading' | 'completed' | 'error';
  progress?: number;
  id?: string;
  error?: string; // Added the error property to fix type issues
}

export interface SubmissionResult {
  success: boolean;
  status: ProcessingStatus;
}

export const submitArticleToN8N = async (
  content: string, 
  articleType: string,
  uploadedFiles: UploadedFile[] = [],
  links: string[] = [],
  updateProgress: (stage: ProcessingStatus['stage'], progress: number, message: string, error?: string) => void,
  onSuccess?: () => void
): Promise<SubmissionResult> => {
  try {
    // Start submission process
    updateProgress("uploading", 50, `Preparing data submission to webhook...`);
    
    console.log("Starting submission with:", { 
      contentLength: content?.length || 0, 
      filesCount: uploadedFiles?.length || 0, 
      linksCount: links?.length || 0,
      webhookUrl: N8N_WEBHOOK_URL
    });

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("User not authenticated!");
      throw new Error("You need to be authenticated. Please login.");
    }
    
    // Verify all files have valid URLs
    const invalidFiles = uploadedFiles.filter(file => !file.url || !file.url.startsWith('http'));
    if (invalidFiles.length > 0) {
      throw new Error(`Found ${invalidFiles.length} files with invalid URLs. Wait for all uploads to complete.`);
    }
    
    // Send article data to N8N webhook
    updateProgress("uploading", 70, `Sending data to webhook...`);
    
    // Send data to N8N
    try {
      const response = await sendArticleToN8N(
        content, 
        articleType, 
        uploadedFiles, 
        links
      );
      
      if (!response.success) {
        throw new Error(response.error || "Error sending data to webhook");
      }
    } catch (webhookError) {
      console.error("Error calling webhook:", webhookError);
      updateProgress("error", 0, `Error calling webhook.`, webhookError.message);
      throw new Error(`Error calling webhook: ${webhookError.message}`);
    }
    
    updateProgress("completed", 100, `Processing completed successfully! ${uploadedFiles.length} file(s) sent.`);

    // Add delay before transitioning
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Call success callback if provided
    if (onSuccess) {
      console.log(`Calling success callback after content was processed`);
      onSuccess();
    }

    return {
      success: true,
      status: { stage: "completed", progress: 100, message: `Processing completed successfully! ${uploadedFiles.length} file(s) sent.` }
    };

  } catch (error) {
    console.error(`Error submitting article:`, error);
    
    updateProgress(
      "error", 
      0, 
      `An error occurred during submission.`, 
      error.message || 'Unknown error'
    );
    
    return {
      success: false,
      status: { 
        stage: "error", 
        progress: 0, 
        message: `An error occurred during submission.`, 
        error: error.message || 'Unknown error'
      }
    };
  }
};

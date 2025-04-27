
import { ArticleWorkspace } from "@/components/article/ArticleWorkspace";
import { Send, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ArticleEditorSectionProps {
  workflowState: any;
  onWorkflowUpdate: (updates: any) => void;
}

export function ArticleEditorSection({ workflowState, onWorkflowUpdate }: ArticleEditorSectionProps) {
  const [isEdited, setIsEdited] = useState(false);

  const handleContentChange = (newContent: string) => {
    setIsEdited(true);
    onWorkflowUpdate({
      content: newContent
    });
  };

  const handleRegenerate = () => {
    setIsEdited(false);
    onWorkflowUpdate({
      content: workflowState.content,
      isRegenerating: true
    });
  };

  const handleSubmit = () => {
    onWorkflowUpdate({
      content: workflowState.content,
      step: "image-selection"
    });
  };

  // For compatibility with ArticleWorkspace
  const getCompatibleWorkflowState = () => {
    const { articleType, ...rest } = workflowState;
    return {
      ...rest,
      articleType: typeof articleType === 'object' ? articleType.id : articleType
    };
  };

  return (
    <div className="space-y-4">
      <ArticleWorkspace
        workflowState={getCompatibleWorkflowState()}
        onWorkflowUpdate={handleContentChange}
      />
      <div className="flex justify-end gap-2">
        {isEdited && (
          <Button 
            variant="outline"
            onClick={handleRegenerate}
            disabled={workflowState.isProcessing}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Regenerar
          </Button>
        )}
        <Button 
          onClick={handleSubmit}
          disabled={workflowState.isProcessing}
          className="flex items-center gap-2"
        >
          {workflowState.isProcessing ? (
            <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Selecionar Imagens
        </Button>
      </div>
    </div>
  );
}

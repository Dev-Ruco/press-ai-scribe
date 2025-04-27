
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleWorkspace } from "@/components/article/ArticleWorkspace";
import { ArticlePreview } from "@/components/article/editor/ArticlePreview";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ArticleEditorSectionProps {
  workflowState: any;
  onWorkflowUpdate: (updates: any) => void;
}

export function ArticleEditorSection({ workflowState, onWorkflowUpdate }: ArticleEditorSectionProps) {
  // For compatibility with ArticleWorkspace
  const getCompatibleWorkflowState = () => {
    const { articleType, ...rest } = workflowState;
    return {
      ...rest,
      articleType: typeof articleType === 'object' ? articleType.id : articleType
    };
  };

  return (
    <Tabs defaultValue="editor" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="editor" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Editor
        </TabsTrigger>
        <TabsTrigger value="preview" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Preview
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="editor">
        <ArticleWorkspace
          workflowState={getCompatibleWorkflowState()}
          onWorkflowUpdate={onWorkflowUpdate}
        />
      </TabsContent>
      
      <TabsContent value="preview">
        <Card className="border bg-card">
          <CardContent className="p-6">
            <ArticlePreview 
              content={workflowState.content}
              articleType={workflowState.articleType}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}


import { AlertCircle, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticleActionsFooterProps {
  onSaveDraft: () => void;
  onSubmitForApproval: () => void;
  onPublish: () => void;
}

export function ArticleActionsFooter({
  onSaveDraft,
  onSubmitForApproval,
  onPublish
}: ArticleActionsFooterProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t py-4 mt-6">
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onSaveDraft}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Rascunho
        </Button>
        <Button variant="outline" onClick={onSubmitForApproval}>
          <AlertCircle className="h-4 w-4 mr-2" />
          Enviar para Aprovação
        </Button>
        <Button onClick={onPublish}>
          <FileText className="h-4 w-4 mr-2" />
          Publicar
        </Button>
      </div>
    </div>
  );
}

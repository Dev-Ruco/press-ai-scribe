
import { FilePreview } from "./FilePreview";

interface ArticleFilePreviewSectionProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export function ArticleFilePreviewSection({ files, onRemoveFile }: ArticleFilePreviewSectionProps) {
  return files.length > 0 ? (
    <FilePreview 
      files={files} 
      onRemove={onRemoveFile}
    />
  ) : null;
}

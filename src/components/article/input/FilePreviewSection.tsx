
import { UploadedFile } from '@/utils/articleSubmissionUtils';
import { FilePreview } from "../file-upload/FilePreview";

interface FilePreviewSectionProps {
  uploadedFiles: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
}

export function FilePreviewSection({ uploadedFiles, onRemoveFile }: FilePreviewSectionProps) {
  if (uploadedFiles.length === 0) return null;

  return (
    <div className="px-4 py-3 border-t border-gray-700/50 bg-gray-900">
      <div className="text-sm font-medium text-gray-300 mb-2">
        Arquivos anexados ({uploadedFiles.length})
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {uploadedFiles.map((file) => (
          <FilePreview
            key={file.id}
            files={[{
              file: new File([], file.fileName, { type: file.mimeType }), // File dummy apenas para visualização
              id: file.id || '',
              progress: 100,
              status: file.status || 'completed',
              error: file.error
            }]}
            onRemove={(fileObj) => onRemoveFile(fileObj.id)}
          />
        ))}
      </div>
    </div>
  );
}

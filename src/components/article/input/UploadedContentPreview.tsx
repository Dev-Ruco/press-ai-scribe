
import { FilePreview } from "../file-upload/FilePreview";
import { LinkPreview } from "../link/LinkPreview";

interface UploadedContentPreviewProps {
  queue: Array<{
    file: File;
    progress: number;
    status: 'queued' | 'uploading' | 'completed' | 'error';
    error?: string;
  }>;
  onQueueItemRemove: (index: number) => void;
  savedLinks: Array<{ url: string; id: string; }>;
  onLinkRemove: (id: string) => void;
}

export function UploadedContentPreview({
  queue,
  onQueueItemRemove,
  savedLinks,
  onLinkRemove
}: UploadedContentPreviewProps) {
  if (queue.length === 0 && savedLinks.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <FilePreview 
        files={queue.map(q => ({ 
          file: q.file,
          progress: q.progress,
          status: q.status,
          error: q.error
        }))}
        onRemove={onQueueItemRemove}
      />
      <LinkPreview
        links={savedLinks}
        onRemove={onLinkRemove}
      />
    </div>
  );
}

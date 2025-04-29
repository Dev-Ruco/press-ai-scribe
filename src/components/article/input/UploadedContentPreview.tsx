
import { FilePreview } from "../file-upload/FilePreview";
import { LinkPreview } from "../link/LinkPreview";
import { Clock } from "lucide-react";

interface UploadedContentPreviewProps {
  queue: Array<{
    file: File;
    id: string;
    progress: number;
    status: 'queued' | 'uploading' | 'completed' | 'error';
    error?: string;
  }>;
  onQueueItemRemove: (item: { id: string }) => void;
  savedLinks: Array<{ url: string; id: string; status?: string }>;
  onLinkRemove: (id: string) => void;
  estimatedTimeRemaining?: string;
}

export function UploadedContentPreview({
  queue,
  onQueueItemRemove,
  savedLinks,
  onLinkRemove,
  estimatedTimeRemaining
}: UploadedContentPreviewProps) {
  if (queue.length === 0 && savedLinks.length === 0) return null;

  // Count in-progress uploads
  const inProgressCount = queue.filter(q => q.status === 'uploading').length;

  return (
    <div className="flex flex-col gap-2">
      {/* Time estimate */}
      {estimatedTimeRemaining && inProgressCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-2 rounded-lg">
          <Clock className="h-4 w-4" />
          <span>Estimated time remaining: {estimatedTimeRemaining}</span>
        </div>
      )}
      
      <FilePreview 
        files={queue.map(q => ({ 
          file: q.file,
          id: q.id,
          progress: q.progress,
          status: q.status,
          error: q.error
        }))}
        onRemove={onQueueItemRemove}
      />
      
      <LinkPreview
        links={savedLinks.map(link => ({
          ...link,
          status: link.status || 'queued'
        }))}
        onRemove={onLinkRemove}
      />
    </div>
  );
}

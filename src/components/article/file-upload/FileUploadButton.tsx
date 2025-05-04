
import { useRef } from "react";
import { HiddenFileInput } from "./HiddenFileInput";
import { UploadMenu } from "./UploadMenu";

interface FileUploadButtonProps {
  onFileUpload: (files: FileList | File[]) => void;
  allowedFileTypes: string[];
}

export function FileUploadButton({ onFileUpload, allowedFileTypes }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadType = (type?: string) => {
    if (!fileInputRef.current) return;
    
    // Ajustando os tipos de arquivo aceitos com base na seleção
    if (type) {
      switch (type) {
        case 'document':
          fileInputRef.current.accept = '.pdf,.doc,.docx,.txt,.rtf';
          break;
        case 'image':
          fileInputRef.current.accept = 'image/*';
          break;
        case 'video':
          fileInputRef.current.accept = 'video/*';
          break;
        case 'audio':
          fileInputRef.current.accept = 'audio/*';
          break;
        default:
          fileInputRef.current.accept = allowedFileTypes.join(',');
      }
    } else {
      fileInputRef.current.accept = allowedFileTypes.join(',');
    }
    
    fileInputRef.current.click();
  };

  return (
    <>
      <HiddenFileInput
        ref={fileInputRef}
        onFileSelect={onFileUpload}
        allowedFileTypes={allowedFileTypes}
      />
      <UploadMenu onFileSelect={handleUploadType} />
    </>
  );
}

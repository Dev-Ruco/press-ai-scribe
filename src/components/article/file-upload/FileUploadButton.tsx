
import { useRef } from "react";
import { HiddenFileInput } from "./HiddenFileInput";
import { UploadMenu } from "./UploadMenu";

interface FileUploadButtonProps {
  onFileUpload: (files: FileList | File[]) => void;
  allowedFileTypes: string[];
}

export function FileUploadButton({ onFileUpload, allowedFileTypes }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadType = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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

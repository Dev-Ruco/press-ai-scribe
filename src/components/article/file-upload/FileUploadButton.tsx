
import { useRef } from "react";
import { HiddenFileInput } from "./HiddenFileInput";
import { UploadTriggerButton } from "./UploadTriggerButton";

interface FileUploadButtonProps {
  onFileUpload: (files: FileList) => void;
  allowedFileTypes: string[];
}

export function FileUploadButton({ onFileUpload, allowedFileTypes }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadButtonClick = () => {
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
      <UploadTriggerButton onClick={handleUploadButtonClick} />
    </>
  );
}

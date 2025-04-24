
import { useRef } from "react";
import { HiddenFileInput } from "./HiddenFileInput";
import { UploadTriggerButton } from "./UploadTriggerButton";

interface FileUploadButtonProps {
  onFileUpload: (files: FileList) => void;
  allowedFileTypes: string[];
  isDisabled?: boolean;
}

export function FileUploadButton({ onFileUpload, allowedFileTypes, isDisabled }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current && !isDisabled) {
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
      <UploadTriggerButton onClick={handleUploadButtonClick} isDisabled={isDisabled} />
    </>
  );
}

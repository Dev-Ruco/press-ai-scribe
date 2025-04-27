
import { useRef } from "react";
import { HiddenFileInput } from "./HiddenFileInput";
import { UploadMenu } from "./UploadMenu";

interface FileUploadButtonProps {
  onFileUpload: (files: FileList) => void;
  allowedFileTypes: string[];
}

export function FileUploadButton({ onFileUpload, allowedFileTypes }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadType = (type: string) => {
    if (fileInputRef.current) {
      switch (type) {
        case "audio":
          fileInputRef.current.accept = "audio/*,.mp3,.wav,.aac,.ogg,.m4a,.flac";
          break;
        case "video":
          fileInputRef.current.accept = "video/*,.mp4,.webm,.ogg,.mov,.avi";
          break;
        case "document":
          fileInputRef.current.accept = ".doc,.docx,.pdf,.txt,.rtf,.md";
          break;
      }
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

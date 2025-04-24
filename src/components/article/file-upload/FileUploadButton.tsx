
import { useRef, useState } from "react";
import { HiddenFileInput } from "./HiddenFileInput";
import { UploadTriggerButton } from "./UploadTriggerButton";
import { useToast } from "@/hooks/use-toast";

interface FileUploadButtonProps {
  onFileUpload: (files: FileList) => void;
  allowedFileTypes: string[];
  isDisabled?: boolean;
}

export function FileUploadButton({ onFileUpload, allowedFileTypes, isDisabled }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [currentFileType, setCurrentFileType] = useState<string[]>(allowedFileTypes);

  const handleUploadButtonClick = (type: string) => {
    if (fileInputRef.current && !isDisabled) {
      setCurrentFileType([type]);
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
    }
  };

  const handleFileSelect = (files: FileList) => {
    if (files.length > 0) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(file => {
        const isValidType = currentFileType.some(type => 
          file.type.includes(type.replace('*', '')) || 
          type.includes(file.type) ||
          type.includes(file.name.split('.').pop()?.toLowerCase() || '')
        );

        if (!isValidType) {
          toast({
            variant: "destructive",
            title: "Tipo de arquivo não suportado",
            description: `${file.name} não é um tipo de arquivo suportado.`
          });
          return false;
        }

        return true;
      });

      if (validFiles.length > 0) {
        onFileUpload(validFiles as unknown as FileList);
      }
    }
  };

  return (
    <>
      <HiddenFileInput
        ref={fileInputRef}
        onFileSelect={handleFileSelect}
        allowedFileTypes={currentFileType}
      />
      <UploadTriggerButton 
        onClick={handleUploadButtonClick} 
        isDisabled={isDisabled}
        supportedTypes={allowedFileTypes}
      />
    </>
  );
}

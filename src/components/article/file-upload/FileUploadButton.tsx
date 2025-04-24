
import { useRef } from "react";
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

  const handleUploadButtonClick = () => {
    if (fileInputRef.current && !isDisabled) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (files: FileList) => {
    if (files.length > 0) {
      // Convert FileList to array for easier processing
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(file => {
        // Check file type
        const isValidType = allowedFileTypes.some(type => 
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
        allowedFileTypes={allowedFileTypes}
      />
      <UploadTriggerButton 
        onClick={handleUploadButtonClick} 
        isDisabled={isDisabled}
        supportedTypes={allowedFileTypes}
      />
    </>
  );
}


import { forwardRef } from "react";

interface HiddenFileInputProps {
  onFileSelect: (files: FileList) => void;
  allowedFileTypes: string[];
}

export const HiddenFileInput = forwardRef<HTMLInputElement, HiddenFileInputProps>(
  ({ onFileSelect, allowedFileTypes }, ref) => {
    return (
      <input
        type="file"
        ref={ref}
        className="hidden"
        multiple
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files);
            // Resetar o input para permitir a seleção do mesmo arquivo novamente
            e.target.value = '';
          }
        }}
        accept={allowedFileTypes.join(',')}
      />
    );
  }
);

HiddenFileInput.displayName = "HiddenFileInput";

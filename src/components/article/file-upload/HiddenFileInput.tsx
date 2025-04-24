
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
          if (e.target.files) {
            onFileSelect(e.target.files);
          }
        }}
        accept={allowedFileTypes.join(',')}
      />
    );
  }
);

HiddenFileInput.displayName = "HiddenFileInput";

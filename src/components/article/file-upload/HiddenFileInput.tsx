
import { forwardRef } from "react";

interface HiddenFileInputProps {
  onFileSelect: (files: FileList) => void;
  allowedFileTypes: string[];
  multiple?: boolean;
}

export const HiddenFileInput = forwardRef<HTMLInputElement, HiddenFileInputProps>(
  ({ onFileSelect, allowedFileTypes, multiple = true }, ref) => {
    return (
      <input
        type="file"
        ref={ref}
        className="hidden"
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files);
          }
        }}
        accept={allowedFileTypes.join(',')}
      />
    );
  }
);

HiddenFileInput.displayName = "HiddenFileInput";

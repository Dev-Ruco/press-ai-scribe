
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthForm } from "./AuthForm";
import { Logo } from "@/components/common/Logo";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export function AuthDialog({ isOpen, onClose, defaultMode = 'login' }: AuthDialogProps) {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-4">
        <div className="flex items-center gap-4">
          <Logo className="h-12 w-auto flex-shrink-0" />
          <AuthForm 
            mode={defaultMode} 
            onSuccess={handleSuccess}
            onToggleMode={() => {}}
            className="flex-1 min-w-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

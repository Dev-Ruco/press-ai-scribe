
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
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-y-6 py-6">
          <Logo className="h-16 w-auto" />
          <AuthForm 
            mode={defaultMode} 
            onSuccess={handleSuccess}
            onToggleMode={() => {}}
            className="w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

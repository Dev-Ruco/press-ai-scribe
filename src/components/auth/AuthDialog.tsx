
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthForm } from "./AuthForm";
import { Logo } from "@/components/common/Logo";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { X } from "lucide-react";
import { ensureStorageBucketExists } from "@/utils/webhookUtils";
import { useToast } from "@/components/ui/use-toast";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
  onSuccess?: () => void;
  actionAfterAuth?: () => void;
}

export function AuthDialog({ 
  isOpen, 
  onClose, 
  defaultMode = 'login',
  onSuccess,
  actionAfterAuth
}: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreatingBucket, setIsCreatingBucket] = useState(false);
  
  // Verificar se o usuário acabou de fazer login e tentar criar o bucket
  useEffect(() => {
    if (user && isOpen) {
      setIsCreatingBucket(true);
      
      ensureStorageBucketExists()
        .then((result) => {
          console.log("Storage bucket check result:", result);
          if (result.success) {
            if (result.created) {
              toast({
                title: "Storage configurado",
                description: "O bucket de armazenamento foi criado com sucesso."
              });
            }
            handleSuccess();
          } else {
            console.error("Failed to ensure storage bucket exists:", result.error);
            // Continua com o fluxo mesmo se falhar a criação do bucket
            handleSuccess();
          }
        })
        .catch(error => {
          console.error("Error ensuring storage bucket exists:", error);
          // Continua com o fluxo mesmo se ocorrer um erro
          handleSuccess();
        })
        .finally(() => {
          setIsCreatingBucket(false);
        });
    }
  }, [user, isOpen]);
  
  const handleSuccess = () => {
    console.log("Auth success in dialog, user: ", user?.id);
    
    // Primeiro executamos o callback de sucesso
    if (onSuccess) {
      onSuccess();
    }
    
    // Depois fechamos o diálogo
    onClose();
    
    // Execute the pending action after a delay if any
    if (actionAfterAuth && user) {
      setTimeout(() => {
        actionAfterAuth();
      }, 500);
    }
  };

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <div className="absolute right-4 top-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-12 w-auto" />
          
          {isCreatingBucket ? (
            <div className="w-full text-center py-4">
              <div className="mb-2">Configurando ambiente...</div>
              <div className="animate-pulse h-1 bg-primary/20 rounded-full"></div>
            </div>
          ) : (
            <div className="w-full">
              <AuthForm 
                mode={mode} 
                onSuccess={handleSuccess}
                onToggleMode={handleToggleMode}
                className="w-full"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

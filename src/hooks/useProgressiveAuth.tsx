
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface UseProgressiveAuthProps {
  onAuthenticated?: () => void;
}

export function useProgressiveAuth({ onAuthenticated }: UseProgressiveAuthProps = {}) {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const { user } = useAuth();

  const requireAuth = (action: () => void) => {
    if (user) {
      // User is already authenticated, proceed with action
      action();
    } else {
      // Store the action to execute after authentication
      setPendingAction(() => action);
      // Open auth dialog
      setAuthDialogOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false);
    
    if (onAuthenticated) {
      onAuthenticated();
    }
    
    // If there was a pending action, execute it
    if (pendingAction && user) {
      pendingAction();
      setPendingAction(null);
    }
  };

  return {
    authDialogOpen,
    setAuthDialogOpen,
    requireAuth,
    handleAuthSuccess,
    pendingAction
  };
}

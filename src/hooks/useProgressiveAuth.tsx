
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UseProgressiveAuthProps {
  onAuthenticated?: () => void;
}

export function useProgressiveAuth({ onAuthenticated }: UseProgressiveAuthProps = {}) {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const { user, session } = useAuth();
  const [isAuthCheckingComplete, setIsAuthCheckingComplete] = useState(false);

  // Check if session is valid on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error checking session:", error);
        }
        setIsAuthCheckingComplete(true);
      } catch (err) {
        console.error("Error in auth check:", err);
        setIsAuthCheckingComplete(true);
      }
    };

    checkSession();
  }, []);

  // Watch for auth state changes
  useEffect(() => {
    if (user && pendingAction) {
      console.log("User authenticated, executing pending action");
      pendingAction();
      setPendingAction(null);
      
      if (onAuthenticated) {
        onAuthenticated();
      }
    }
  }, [user, pendingAction, onAuthenticated]);

  const requireAuth = (action: () => void) => {
    if (user && session) {
      // User is already authenticated, proceed with action
      console.log("User already authenticated, proceeding with action");
      action();
    } else {
      // Store the action to execute after authentication
      console.log("User not authenticated, storing action for later");
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
      console.log("Auth success, executing pending action");
      pendingAction();
      setPendingAction(null);
    }
  };

  return {
    authDialogOpen,
    setAuthDialogOpen,
    requireAuth,
    handleAuthSuccess,
    pendingAction,
    isAuthCheckingComplete
  };
}

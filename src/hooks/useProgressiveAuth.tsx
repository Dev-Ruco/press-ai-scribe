
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

interface UseProgressiveAuthProps {
  onAuthenticated?: () => void;
}

export function useProgressiveAuth({ onAuthenticated }: UseProgressiveAuthProps = {}) {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const { user, session } = useAuth();
  const [isAuthCheckingComplete, setIsAuthCheckingComplete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar se o usuário está na rota /auth e já está autenticado
  useEffect(() => {
    if (user && location.pathname === '/auth') {
      // Redirecionar para home se o usuário já estiver autenticado
      navigate('/', { replace: true });
    }
  }, [user, navigate, location.pathname]);

  // Check if session is valid on mount - com menos frequência
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
    
    // Reduzir verificações para evitar rate limit - aumentar para 5 minutos (300000ms)
    const refreshInterval = setInterval(checkSession, 300000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Watch for auth state changes
  useEffect(() => {
    if (user && pendingAction) {
      console.log("User authenticated, executing pending action");
      // Use setTimeout para evitar loops de atualização
      setTimeout(() => {
        pendingAction();
        setPendingAction(null);
        
        if (onAuthenticated) {
          onAuthenticated();
        }
      }, 100);
    }
  }, [user, pendingAction, onAuthenticated]);

  const requireAuth = useCallback((action: () => void) => {
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
  }, [user, session]);

  const handleAuthSuccess = useCallback(() => {
    setAuthDialogOpen(false);
    
    if (onAuthenticated) {
      onAuthenticated();
    }
    
    // Se houver uma ação pendente e o usuário estiver autenticado, execute-a
    if (pendingAction && user) {
      console.log("Auth success, executing pending action");
      setTimeout(() => {
        pendingAction();
        setPendingAction(null);
      }, 500);
    }
  }, [pendingAction, user, onAuthenticated]);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // Redirecionar para página inicial após logout
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [navigate]);

  return {
    authDialogOpen,
    setAuthDialogOpen,
    requireAuth,
    handleAuthSuccess,
    handleLogout,
    pendingAction,
    isAuthCheckingComplete
  };
}

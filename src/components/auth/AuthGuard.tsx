
import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPrompt } from "./AuthPrompt";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
  allowView?: boolean;
  requireAuth?: boolean;
}

export function AuthGuard({ 
  children, 
  allowView = true,
  requireAuth = false
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      // Save current location and redirect to auth page
      navigate('/auth', { 
        state: { from: location },
        replace: true // Use replace to prevent history stack buildup
      });
    }
  }, [user, loading, requireAuth, navigate, location]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // If allowView is enabled and auth isn't required, show content with optional prompt
  if (!user && allowView && !requireAuth) {
    return (
      <>
        {children}
        <AuthPrompt 
          isOpen={showPrompt} 
          onClose={() => setShowPrompt(false)} 
        />
      </>
    );
  }

  // If auth is required and user isn't logged in, show prompt
  if (!user) {
    return <AuthPrompt isOpen={true} onClose={() => navigate('/', { replace: true })} />;
  }

  return <>{children}</>;
}

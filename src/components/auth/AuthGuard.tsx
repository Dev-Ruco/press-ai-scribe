
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useState } from "react";
import { AuthPrompt } from "./AuthPrompt";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false); // Alterado para iniciar como false

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!user) {
    if (showPrompt) {
      return (
        <AuthPrompt 
          isOpen={true} 
          onClose={() => {
            setShowPrompt(false);
            // Redirect to home after closing the prompt
            window.location.href = '/';
          }} 
        />
      );
    }
    // Store the location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

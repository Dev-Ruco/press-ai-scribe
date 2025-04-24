
import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPrompt } from "./AuthPrompt";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
  allowView?: boolean; // Nova propriedade para permitir visualização sem login
  requireAuth?: boolean; // Propriedade para forçar autenticação
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
      // Save current location to redirect back after login
      navigate('/auth', { state: { from: location } });
    }
  }, [user, loading, requireAuth, navigate, location]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // Se allowView estiver habilitado, mostramos o conteúdo mesmo sem login
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

  // Caso contrário, ainda requer login
  if (!user) {
    return <AuthPrompt isOpen={true} onClose={() => navigate('/', { replace: true })} />;
  }

  return <>{children}</>;
}

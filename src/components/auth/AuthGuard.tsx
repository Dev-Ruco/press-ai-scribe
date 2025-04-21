
import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPrompt } from "./AuthPrompt";

interface AuthGuardProps {
  children: ReactNode;
  allowView?: boolean; // Nova propriedade para permitir visualização sem login
}

export function AuthGuard({ children, allowView = true }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // Se allowView estiver habilitado, mostramos o conteúdo mesmo sem login
  if (!user && allowView) {
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
    return <AuthPrompt isOpen={true} onClose={() => window.location.href = "/"} />;
  }

  return <>{children}</>;
}


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Se já estiver autenticado, redirecionar para a página inicial
        navigate('/');
      }
    };

    checkAuthStatus();

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Press AI Pessoal
        </h1>
        <p className="text-muted-foreground mt-2">
          Sua plataforma personalizada de gerenciamento de conteúdo
        </p>
      </div>
      <AuthForm 
        mode={isLogin ? 'login' : 'signup'} 
        onToggleMode={() => setIsLogin(!isLogin)}
        onSuccess={() => navigate('/')}
      />
    </AuthLayout>
  );
}

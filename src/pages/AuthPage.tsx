
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { search, state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // If user is already logged in, redirect to home or returnTo path
  if (user) {
    const params = new URLSearchParams(search);
    const returnTo = params.get('returnTo') || (state as any)?.returnTo || '/';
    navigate(returnTo);
  }

  const handleLogin = async (email: string, password: string) => {
    setIsLoggingIn(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      const params = new URLSearchParams(search);
      const returnTo = params.get('returnTo') || (state as any)?.returnTo || '/';
      navigate(returnTo);
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setIsLoggingIn(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Cadastro realizado",
        description: "Verifique seu email para confirmar sua conta.",
      });
      
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <AuthLayout>
      <AuthForm 
        mode={mode}
        onToggleMode={() => setMode(mode === 'login' ? 'signup' : 'login')}
        onSuccess={() => {
          const params = new URLSearchParams(search);
          const returnTo = params.get('returnTo') || (state as any)?.returnTo || '/';
          navigate(returnTo);
        }}
        className="w-full"
      />
    </AuthLayout>
  );
}

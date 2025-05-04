
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event);
      if (!mounted) return;
      
      if (newSession?.user) {
        console.log("Auth state change: user authenticated");
        setSession(newSession);
        setUser(newSession.user);
      } else {
        console.log("Auth state change: user not authenticated");
        setSession(null);
        setUser(null);
      }
      
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      
      console.log("Initial session check:", currentSession ? "Session exists" : "No session");
      
      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
      }
      
      setLoading(false);
    }).catch(error => {
      console.error("Error checking session:", error);
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Verificar se o login foi bem-sucedido
      if (data.user) {
        toast({
          title: "Bem-vindo",
          description: "Login realizado com sucesso"
        });
      } else {
        throw new Error("Falha no login. Nenhum usuário retornado.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message === "Invalid login credentials"
          ? "Email ou senha incorretos"
          : error.message || "Não foi possível realizar o login"
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, userData: any) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Conta criada",
          description: "Sua conta foi criada com sucesso"
        });
      } else {
        throw new Error("Falha no cadastro. Nenhum usuário retornado.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Não foi possível criar a conta";
      
      if (error.message.includes("already registered")) {
        errorMessage = "Este email já está cadastrado";
      }
      
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: errorMessage
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Até logo",
        description: "Logout realizado com sucesso"
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Erro no logout",
        description: "Não foi possível sair da conta"
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Apple, Loader2, Linkedin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Logo } from "@/components/common/Logo";

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
  onSuccess: () => void;
  className?: string;
}

export function AuthForm({ mode, onToggleMode, onSuccess, className }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Verificar se há um usuário logado ao carregar
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setCurrentUser(data.session.user);
        console.log("Usuário atual:", data.session.user);
      } else {
        console.log("Nenhum usuário logado");
      }
    };
    
    checkUser();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Evento de autenticação:", event);
        if (session?.user) {
          setCurrentUser(session.user);
          console.log("Usuário atualizado:", session.user);
        } else {
          setCurrentUser(null);
        }
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleError = (error: any) => {
    let message = "Ocorreu um erro inesperado";
    console.error("Erro de autenticação:", error);
    
    switch (error.message) {
      case "Invalid login credentials":
        message = "Email ou senha incorretos. Verifique suas credenciais e tente novamente.";
        break;
      case "User already registered":
        message = "Este email já está cadastrado. Tente fazer login.";
        break;
      case "Email not confirmed":
        message = "Por favor, confirme seu email antes de fazer login.";
        break;
      case "Password is too short":
        message = "A senha deve ter pelo menos 6 caracteres.";
        break;
      case "For security purposes, you can only request this once every 60 seconds":
        message = "Por segurança, você só pode solicitar isso uma vez a cada 60 segundos.";
        break;
      default:
        console.error("Erro detalhado:", error);
        message = `Erro: ${error.message}`;
    }
    
    setError(message);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem");
        }
        if (password.length < 6) {
          throw new Error("A senha deve ter pelo menos 6 caracteres");
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              account_type: "individual",
            }
          }
        });

        if (signUpError) throw signUpError;
        
        console.log("Signup successful:", signUpData);

        // Automatically sign in after successful signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;

        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao Press AI!",
        });

        onSuccess();

      } else {
        console.log("Attempting login with:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        
        console.log("Login successful:", data);

        toast({
          title: "Bem-vindo de volta!",
          description: "Login realizado com sucesso.",
        });
        onSuccess();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider: 'google' | 'apple' | 'linkedin_oidc') {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (err) {
      handleError(err);
    }
  }

  async function handleResetPassword() {
    if (!resetPasswordEmail) {
      setError("Por favor, insira seu email");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetPasswordEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;
      
      setResetEmailSent(true);
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha."
      });
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  return (
    <div className={`${className}`}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="email" className="sr-only">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="sr-only">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder={mode === 'signup' ? "Escolha uma senha" : "Sua senha"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {mode === 'signup' && (
          <div>
            <Label htmlFor="confirmPassword" className="sr-only">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? "Entrar" : "Criar conta"}
          </Button>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              type="button"
              onClick={() => handleSocialLogin('linkedin_oidc')}
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
            
            <Button 
              variant="outline"
              size="icon"
              type="button" 
              onClick={() => handleSocialLogin('apple')}
            >
              <Apple className="h-4 w-4" />
              <span className="sr-only">Apple</span>
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              Não tem uma conta?{" "}
              <button onClick={onToggleMode} className="font-medium text-primary hover:underline">
                Crie uma agora
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <button onClick={onToggleMode} className="font-medium text-primary hover:underline">
                Entre
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}

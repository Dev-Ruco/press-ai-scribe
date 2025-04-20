
import { useState } from "react";
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

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
  onSuccess: () => void;
}

export function AuthForm({ mode, onToggleMode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup' && password !== confirmPassword) {
        throw new Error("As senhas não coincidem");
      }

      const { error } = mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                account_type: "individual",
              }
            }
          });

      if (error) throw error;

      toast({
        title: mode === 'login' ? "Bem-vindo de volta!" : "Conta criada com sucesso!",
        description: mode === 'login' ? "Você foi conectado." : "Por favor, verifique seu email para confirmar sua conta.",
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
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
      setError(err instanceof Error ? err.message : "Falha ao conectar com provedor social");
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
      setError(err instanceof Error ? err.message : "Erro ao enviar email de recuperação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {mode === 'login' ? "Bem-vindo de volta" : "Criar conta"}
      </h2>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'login' ? "Entrar" : "Criar conta"}
        </Button>
      </form>

      {mode === 'login' && (
        <div className="mt-4 text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-sm">Esqueceu sua senha?</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Recuperar senha</DialogTitle>
                <DialogDescription>
                  {resetEmailSent 
                    ? "Email enviado! Verifique sua caixa de entrada para redefinir sua senha."
                    : "Insira seu email abaixo para receber um link de recuperação de senha."}
                </DialogDescription>
              </DialogHeader>
              
              {!resetEmailSent && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Email</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetPasswordEmail}
                      onChange={(e) => setResetPasswordEmail(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleResetPassword} disabled={loading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar link de recuperação
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-muted-foreground">Ou continuar com</span>
        </div>
      </div>

      <div className="grid gap-3">
        <Button variant="outline" onClick={() => handleSocialLogin('google')} type="button" className="w-full">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        <Button variant="outline" onClick={() => handleSocialLogin('linkedin_oidc')} type="button" className="w-full">
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </Button>

        <Button variant="outline" onClick={() => handleSocialLogin('apple')} type="button" className="w-full">
          <Apple className="mr-2 h-4 w-4" />
          Apple
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
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
    </div>
  );
}

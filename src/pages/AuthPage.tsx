
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ensureStorageBucketExists } from "@/utils/webhookUtils";

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isCreatingBucket, setIsCreatingBucket] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  // Verificar de onde o usuário veio e para onde deve voltar
  const from = location.state?.from?.pathname || '/';
  const returnTo = location.state?.returnTo || '/';
  
  // Verificar se o usuário já está autenticado e redirecionar se estiver
  useEffect(() => {
    if (user && !loading) {
      console.log("Usuário autenticado, redirecionando de /auth para:", from);
      
      // Antes de redirecionar, verificar bucket
      setIsCreatingBucket(true);
      
      ensureStorageBucketExists()
        .then((result) => {
          console.log("Storage bucket check result:", result);
          if (result.created) {
            toast({
              title: "Storage configurado",
              description: "O bucket de armazenamento foi criado com sucesso."
            });
          }
        })
        .catch(error => {
          console.error("Error ensuring storage bucket exists:", error);
        })
        .finally(() => {
          setIsCreatingBucket(false);
          // Redirecionar independentemente do resultado do bucket
          navigate(returnTo || from, { replace: true });
        });
    }
  }, [user, loading, navigate, from, returnTo, toast]);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleAuthSuccess = () => {
    // Sucesso no login/signup, redirecionar após confirmação do bucket
    setIsCreatingBucket(true);
    
    ensureStorageBucketExists()
      .then((result) => {
        console.log("Storage bucket check result after auth:", result);
        if (result.created) {
          toast({
            title: "Storage configurado",
            description: "O bucket de armazenamento foi criado com sucesso."
          });
        }
      })
      .catch(error => {
        console.error("Error ensuring storage bucket exists after auth:", error);
      })
      .finally(() => {
        setIsCreatingBucket(false);
        navigate(returnTo || from, { replace: true });
      });
  };

  // Se estiver carregando, mostrar loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Verificando autenticação...</div>
          <div className="w-16 h-1 bg-primary/20 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Se já estiver autenticado e criando bucket, mostrar loading
  if (user && isCreatingBucket) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Configurando ambiente...</div>
          <div className="w-16 h-1 bg-primary/20 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === 'login' ? 'Entrar na conta' : 'Criar uma conta'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'login' 
              ? 'Digite seu e-mail e senha para entrar' 
              : 'Digite seus dados para criar uma conta'}
          </p>
        </div>
        
        {isCreatingBucket ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4 text-center">Configurando ambiente...</div>
            <div className="animate-pulse h-1 bg-primary/20 rounded-full"></div>
          </div>
        ) : (
          <AuthForm 
            mode={mode} 
            onSuccess={handleAuthSuccess}
            onToggleMode={toggleMode} 
          />
        )}
        
        <p className="px-8 text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              Ainda não tem uma conta?{" "}
              <button onClick={toggleMode} className="underline underline-offset-4 hover:text-primary">
                Registre-se
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <button onClick={toggleMode} className="underline underline-offset-4 hover:text-primary">
                Entrar
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

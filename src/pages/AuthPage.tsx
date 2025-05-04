
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { ensureStorageBucketExists } from "@/utils/webhookUtils";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isCreatingBucket, setIsCreatingBucket] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Verificar se o usuário já está autenticado e redirecionar se estiver
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      
      // Verificar e criar bucket se necessário após login
      setIsCreatingBucket(true);
      ensureStorageBucketExists()
        .then(result => {
          if (result.created) {
            toast({
              title: "Bucket criado com sucesso",
              description: "O bucket para armazenamento de arquivos foi criado automaticamente."
            });
          } else if (result.error) {
            toast({
              variant: "destructive",
              title: "Erro ao verificar armazenamento",
              description: result.error
            });
          }
        })
        .catch(error => {
          console.error("Erro ao verificar/criar bucket:", error);
        })
        .finally(() => {
          setIsCreatingBucket(false);
          navigate(from, { replace: true });
        });
    }
  }, [user, navigate, location.state, toast]);

  const handleGoBack = () => {
    navigate('/');
  };
  
  const handleSuccess = () => {
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-lg space-y-8 bg-white rounded-lg p-8">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack}
            className="text-primary hover:bg-primary/10"
          >
            <ChevronLeft size={24} />
          </Button>
          <Logo className="mx-auto h-12 w-auto" />
          <div className="w-10"></div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">
            {isLogin ? t('welcomeBack') : t('createAccount')}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? t('enterToContinue') : t('registerToStart')}
          </p>
        </div>

        <div className="space-y-6">
          <AuthForm 
            mode={isLogin ? 'login' : 'signup'} 
            onToggleMode={() => setIsLogin(!isLogin)}
            onSuccess={handleSuccess}
            className="space-y-4"
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                {t('orContinueWith')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="mr-2">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-1 7.28-2.64l-3.57-2.75c-.99.67-2.26 1.07-3.71 1.07-2.87 0-5.3-1.93-6.16-4.53H2.18v2.84C4 20.2 7.74 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.15c-.26-.78-.4-1.61-.4-2.47 0-.86.14-1.69.4-2.47V6.37H2.18C1.43 7.87 1 9.39 1 12s.43 4.13 1.18 5.63l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.74 1 4 3.8 2.18 6.37l3.66 2.84c.86-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button" className="w-full">
              <svg className="mr-2 h-5 w-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"></path>
              </svg>
              LinkedIn
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

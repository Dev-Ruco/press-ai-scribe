
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { FilePlus, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { AuthPrompt } from "@/components/auth/AuthPrompt";
import { AuthDialog } from "@/components/auth/AuthDialog";

export function WelcomeCard() {
  const { user } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [greeting, setGreeting] = useState("Olá");
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  const getUserDisplayName = () => {
    if (!user) return "";
    if (user.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return "";
  };

  const handleAction = (path: string) => {
    if (!user) {
      setAuthDialogOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <div className="space-y-6 pb-6 border-b border-border/30">
        {user ? (
          <>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {greeting}, {getUserDisplayName()}!
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Pronto para o seu próximo grande artigo?
              </p>
            </div>
            <p className="text-gray-600">
              Sou o seu assistente editorial. Estou aqui para reduzir o seu tempo operacional e permitir que se concentre na apuração jornalística.
            </p>
            <div className="flex items-center gap-4">
              <Button 
                size="sm"
                className="h-9 px-4 gap-2 bg-primary hover:bg-primary/90" 
                onClick={() => navigate("/new-article")}
              >
                <FilePlus className="h-4 w-4" />
                <span>Criar Artigo</span>
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="h-9 px-4 gap-2 text-muted-foreground hover:text-foreground border-border/40" 
                onClick={() => navigate("/reformulate")}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reformular Artigo</span>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Bem-vindo ao Press AI
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Converta notas, áudio ou imagens num artigo pronto para publicar
              </p>
            </div>
            <p className="text-gray-600">
              Sou o seu assistente editorial. Estou aqui para reduzir o seu tempo operacional e permitir que se concentre na apuração jornalística.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90" 
                onClick={() => setAuthDialogOpen(true)}
              >
                <span>Experimente Gratuitamente</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-xs text-gray-500 self-center">
                Sem custos de arranque • Cancelamento fácil • Acesso imediato
              </p>
            </div>
          </>
        )}
      </div>
      <AuthDialog isOpen={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </>
  );
}

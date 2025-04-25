
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { FilePlus, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { AuthPrompt } from "@/components/auth/AuthPrompt";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { cn } from "@/lib/utils";

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
      <div className={cn(
        "relative overflow-hidden rounded-xl",
        "backdrop-blur-md",
        user ? "bg-white/20 p-6" : "bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 p-8 text-white"
      )}>
        {/* Animated background elements for non-authenticated users */}
        {!user && (
          <>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute h-64 w-64 bg-purple-500/20 rounded-full blur-3xl -top-20 -right-20 animate-pulse" />
              <div className="absolute h-48 w-48 bg-blue-500/20 rounded-full blur-3xl -bottom-12 left-1/3 animate-pulse" style={{ animationDelay: '1s'}} />
              <div className="absolute h-32 w-32 bg-cyan-500/20 rounded-full blur-2xl bottom-4 right-10 animate-pulse" style={{ animationDelay: '2s'}} />
              
              <div className="absolute top-0 right-0 opacity-20 w-full h-full">
                <svg viewBox="0 0 100 100" className="opacity-20" preserveAspectRatio="none">
                  <path d="M0,0 L100,0 L100,100 Z" fill="rgba(255,255,255,0.03)"></path>
                </svg>
              </div>
              
              {/* Grid pattern */}
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            </div>
          </>
        )}

        {user ? (
          <>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {greeting}, {getUserDisplayName()}!
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Pronto para o seu próximo grande artigo?
              </p>
            </div>
            <p className="text-muted-foreground mt-4">
              Sou o seu assistente editorial. Estou aqui para reduzir o seu tempo operacional e permitir que se concentre na apuração jornalística.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Button 
                size="sm"
                className="h-9 px-4 gap-2 bg-gradient-to-r from-foreground to-primary hover:opacity-90 text-background border-0" 
                onClick={() => navigate("/new-article")}
              >
                <FilePlus className="h-4 w-4" />
                <span>Criar Artigo</span>
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="h-9 px-4 gap-2 text-muted-foreground hover:text-foreground border-border/40 backdrop-blur-sm" 
                onClick={() => navigate("/reformulate")}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reformular Artigo</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="relative z-10">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-semibold text-white">
                Bem-vindo ao Press AI
              </h1>
              <p className="text-base text-blue-200/80">
                Converta notas, áudio ou imagens num artigo pronto para publicar
              </p>
            </div>
            <p className="text-slate-300 mt-6 max-w-xl">
              Sou o seu assistente editorial. Estou aqui para reduzir o seu tempo operacional e permitir que se concentre na apuração jornalística.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mt-8 items-start">
              <Button 
                size="lg"
                className="gap-2 relative overflow-hidden group bg-gradient-to-r from-foreground to-primary hover:from-foreground/90 hover:to-primary/90 border-0 text-background shadow-minimal" 
                onClick={() => setAuthDialogOpen(true)}
              >
                <span>Experimente Gratuitamente</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </Button>
              <p className="text-sm text-slate-400 self-center">
                Sem custos de arranque • Cancelamento fácil • Acesso imediato
              </p>
            </div>
          </div>
        )}
      </div>
      <AuthDialog isOpen={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </>
  );
}

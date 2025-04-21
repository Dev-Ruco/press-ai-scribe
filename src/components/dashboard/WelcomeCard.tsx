
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { FilePlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { AuthPrompt } from "@/components/auth/AuthPrompt";
import { Separator } from "@/components/ui/separator";

export function WelcomeCard() {
  const { user } = useAuth();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
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

  const description = user 
    ? `${greeting}, ${getUserDisplayName()}! Sou o seu assistente editorial. Estou aqui para reduzir o seu tempo operacional e permitir que se concentre na apuração jornalística.` 
    : "Olá, sou o teu assistente editorial. Estou aqui para reduzir o teu tempo operacional e permitir que te concentres na apuração jornalística.";

  const handleAction = (path: string) => {
    if (!user) {
      setAuthPromptOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900">
            Bem vindo a Press Ai
          </h1>
          {user && (
            <p className="text-base text-neutral-500 mt-2">
              Bem-vindo(a) ao seu dashboard personalizado
            </p>
          )}
        </div>
        <p className="text-neutral-600 text-lg">{description}</p>
        <div className="flex items-center gap-4 pt-2">
          <Button 
            className="bg-neutral-900 hover:bg-neutral-800 text-white gap-2 h-12 px-8 text-base" 
            onClick={() => handleAction("/new-article")}
          >
            <FilePlus size={20} />
            <span>Criar Artigo</span>
          </Button>
          <Button 
            variant="outline" 
            className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 gap-2 h-12 px-8 text-base" 
            onClick={() => handleAction("/reformulate")}
          >
            <RefreshCw size={20} />
            <span>Reformular Artigo</span>
          </Button>
        </div>
      </div>
      <Separator className="bg-neutral-200 mb-8" />
      <AuthPrompt isOpen={authPromptOpen} onClose={() => setAuthPromptOpen(false)} />
    </>
  );
}


import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { FilePlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { AuthPrompt } from "@/components/auth/AuthPrompt";

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
      <div className="space-y-6 pb-6 border-b border-border/30">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Bem vindo a Press Ai
          </h1>
          {user && (
            <p className="text-sm text-gray-500 mt-1">
              Bem-vindo(a) ao seu dashboard personalizado
            </p>
          )}
        </div>
        <p className="text-gray-600">{description}</p>
        <div className="flex items-center gap-4">
          <Button 
            className="bg-gray-900 hover:bg-gray-800 text-white gap-2 h-10 px-6" 
            onClick={() => handleAction("/new-article")}
          >
            <FilePlus size={18} />
            <span>Criar Artigo</span>
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 hover:bg-gray-50 gap-2 h-10 px-6" 
            onClick={() => handleAction("/reformulate")}
          >
            <RefreshCw size={18} />
            <span>Reformular Artigo</span>
          </Button>
        </div>
      </div>
      <AuthPrompt isOpen={authPromptOpen} onClose={() => setAuthPromptOpen(false)} />
    </>
  );
}

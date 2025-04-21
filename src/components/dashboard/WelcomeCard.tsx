
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  // Get user's first name from metadata or email
  const getUserDisplayName = () => {
    if (!user) return "";
    
    if (user.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    
    // If no first name, use email before the @ symbol
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return "";
  };

  // Editorial Assistant intro text
  const description = user 
    ? `${greeting}, ${getUserDisplayName()}! Sou o seu assistente editorial. Estou aqui para reduzir o seu tempo operacional e permitir que se concentre na apuração jornalística.`
    : "Olá, sou o teu assistente editorial. Estou aqui para reduzir o teu tempo operacional e permitir que te concentres na apuração jornalística.";

  // Gated action
  const handleAction = (path: string) => {
    if (!user) {
      setAuthPromptOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <Card className="bg-bg-white border-border shadow-light">
        <CardHeader className={`pb-2 ${user ? 'bg-primary/10 rounded-t-lg' : ''}`}>
          <CardTitle className="title-section text-primary-dark flex items-center gap-2">
            <span className="text-3xl">🧠</span>
            <div>
              <span>Editorial Assistant</span>
              {user && <p className="text-sm font-normal text-muted-foreground mt-1">Bem-vindo(a) ao seu dashboard personalizado</p>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className={user ? 'pt-4' : ''}>
          <p className="text-text-secondary mb-6">{description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Button
              className="w-full sm:w-[200px] bg-primary hover:bg-primary-dark text-white gap-2 transition-all duration-200 hover:shadow-md"
              onClick={() => handleAction("/new-article")}
            >
              <FilePlus size={20} />
              <span>Criar Artigo</span>
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-[200px] border-primary text-primary hover:bg-primary/10 gap-2 transition-all duration-200"
              onClick={() => handleAction("/reformulate")}
            >
              <RefreshCw size={20} />
              <span>Reformular Artigo</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      <AuthPrompt isOpen={authPromptOpen} onClose={() => setAuthPromptOpen(false)} />
    </>
  );
}

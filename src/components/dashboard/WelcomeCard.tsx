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
  const navigate = useNavigate();

  // Editorial Assistant intro text
  const description =
    "Olá, sou o teu assistente editorial. Estou aqui para reduzir o teu tempo operacional e permitir que te concentres na apuração jornalística.";

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
        <CardHeader className="pb-2">
          <CardTitle className="title-section text-primary-dark">
            🧠 Editorial Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
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


import { Button } from "@/components/ui/button";
import { FilePlus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function WelcomeCard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const fullName = session.user.user_metadata?.full_name;
        const firstName = fullName?.split(' ')[0] || session.user.email?.split('@')[0] || '';
        setUserName(fullName || firstName);
      }
    });
  }, []);

  const handleActionClick = () => {
    navigate('/auth', { state: { mode: 'signup' } });
  };

  if (userName) {
    return (
      <Card className="bg-bg-white border-border shadow-light">
        <CardHeader className="pb-2">
          <CardTitle className="title-section text-primary-dark">
            Bem-vindo, {userName}! 👋
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary mb-6">
            O que você gostaria de fazer hoje? Crie novos artigos ou reformule conteúdo existente com facilidade usando nossa IA.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Button
              asChild
              className="w-full sm:w-[200px] bg-primary hover:bg-primary-dark text-white gap-2 transition-all duration-200 hover:shadow-md"
            >
              <Link to="/new-article">
                <FilePlus size={20} />
                <span>Gerar Artigo</span>
              </Link>
            </Button>
            
            <Button
              asChild
              className="w-full sm:w-[200px] bg-primary hover:bg-primary-dark text-white gap-2 transition-all duration-200 hover:shadow-md"
            >
              <Link to="/reformulate">
                <RefreshCw size={20} />
                <span>Reformular Artigo</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-bg-white border-border shadow-light">
      <CardHeader className="pb-2">
        <CardTitle className="title-section text-primary-dark">
          Bem-vindo ao Press AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-text-secondary mb-6">
          Plataforma completa de gestão editorial com recursos de inteligência artificial.
          Crie, reforme e transcriva conteúdos com facilidade.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button 
            className="bg-primary hover:bg-primary-dark gap-2"
            onClick={handleActionClick}
          >
            <FilePlus size={18} />
            <span>Começar Agora</span>
          </Button>
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10 gap-2"
            onClick={handleActionClick}
          >
            <RefreshCw size={18} />
            <span>Experimente Grátis</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

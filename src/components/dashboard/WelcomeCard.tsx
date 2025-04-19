
import { Button } from "@/components/ui/button";
import { FilePlus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomeCardProps {
  username?: string;
}

export function WelcomeCard({ username = "Usuário" }: WelcomeCardProps) {
  return (
    <Card className="bg-bg-white border-border shadow-light">
      <CardHeader className="pb-2">
        <CardTitle className="title-section text-primary-dark">
          Bem-vindo ao Press AI, {username}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-text-secondary mb-6">
          Plataforma completa de gestão editorial com recursos de inteligência artificial.
          Crie, reforme e transcriva conteúdos com facilidade.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-primary hover:bg-primary-dark gap-2">
            <FilePlus size={18} />
            <span>Gerar Novo Artigo</span>
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 gap-2">
            <RefreshCw size={18} />
            <span>Reformular Artigo</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

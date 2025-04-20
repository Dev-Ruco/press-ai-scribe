
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { FileText, Headphones, Clock, FilePen, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();

  // Display minimal content if not authenticated
  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Bem-vindo à Plataforma de Conteúdo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Faça login ou registe-se para começar a criar e gerir o seu conteúdo.
          </p>
          <div className="flex gap-4 mt-6">
            <Button asChild size="lg">
              <Link to="/auth">
                <LogIn className="mr-2 h-5 w-5" />
                Entrar
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth?tab=register">
                <UserPlus className="mr-2 h-5 w-5" />
                Registar
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Display regular dashboard for authenticated users
  return (
    <MainLayout>
      <div className="space-y-6">
        <WelcomeCard />
        
        <QuickActions />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            icon={FileText} 
            title="Artigos" 
            value="0" 
            change={{ value: "Comece a criar", positive: true }}
          />
          <StatsCard 
            icon={Headphones} 
            title="Transcrições" 
            value="0" 
            change={{ value: "Personalize", positive: true }}
          />
          <StatsCard 
            icon={Clock} 
            title="Horas Salvas" 
            value="0" 
            change={{ value: "Aumente sua produtividade", positive: true }}
          />
          <StatsCard 
            icon={FilePen} 
            title="Reformulações" 
            value="0" 
            change={{ value: "Experimente agora", positive: true }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;

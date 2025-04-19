
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { QuickAccessCard } from "@/components/dashboard/QuickAccessCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TranscriptionTable } from "@/components/dashboard/TranscriptionTable";
import { DashboardArticleTable } from "@/components/dashboard/DashboardArticleTable";
import { 
  FileText, 
  RefreshCw, 
  Headphones, 
  BarChart2,
  FileUp,
  Clock,
  FilePen,
  BookOpen 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const recentTranscriptions = [
  {
    id: "1",
    name: "Entrevista CEO.mp3",
    date: "18/04/2025",
    duration: "32:45",
    status: 'completed' as const
  },
  {
    id: "2",
    name: "Conferencia de Imprensa.mp4",
    date: "15/04/2025",
    duration: "54:20",
    status: 'completed' as const
  },
  {
    id: "3",
    name: "Podcast Ep.128.mp3",
    date: "12/04/2025",
    duration: "45:10",
    status: 'processing' as const
  },
  {
    id: "4",
    name: "Reunião Trimestral.mp3",
    date: "10/04/2025",
    duration: "67:30",
    status: 'failed' as const
  }
];

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <WelcomeCard />

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            icon={FileText} 
            title="Artigos" 
            value="124" 
            change={{ value: "12% esta semana", positive: true }}
          />
          <StatsCard 
            icon={Headphones} 
            title="Transcrições" 
            value="37" 
            change={{ value: "5% este mês", positive: true }}
          />
          <StatsCard 
            icon={Clock} 
            title="Horas Salvas" 
            value="56" 
            change={{ value: "23% este mês", positive: true }}
          />
          <StatsCard 
            icon={FilePen} 
            title="Reformulações" 
            value="43" 
            change={{ value: "8% esta semana", positive: true }}
          />
        </div>

        {/* Recent Articles Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-xl">Artigos Recentes</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/articles" className="gap-2">
                <FileText className="h-4 w-4" />
                Gestão de Artigos
              </Link>
            </Button>
          </div>
          <DashboardArticleTable limit={5} />
        </div>

        {/* Recent Transcriptions Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-xl">Transcrições Recentes</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/transcribe" className="gap-2">
                <Headphones className="h-4 w-4" />
                Ver Todas
              </Link>
            </Button>
          </div>
          <TranscriptionTable transcriptions={recentTranscriptions.slice(0, 5)} />
        </div>

        {/* Quick Access Section */}
        <div>
          <h2 className="font-medium text-xl mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAccessCard 
              icon={FileText} 
              title="Últimas Notícias" 
              description="Acesse as publicações mais recentes" 
              href="/news"
            />
            <QuickAccessCard 
              icon={RefreshCw} 
              title="Reformular Conteúdo" 
              description="Melhore textos existentes com IA" 
              href="/reformulate"
            />
            <QuickAccessCard 
              icon={Headphones} 
              title="Transcrições" 
              description="Converta áudio em texto facilmente" 
              href="/transcribe"
            />
            <QuickAccessCard 
              icon={BookOpen} 
              title="Gestão de Artigos" 
              description="Organize e gerencie seus conteúdos" 
              href="/articles"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;

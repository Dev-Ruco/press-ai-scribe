
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { QuickAccessCard } from "@/components/dashboard/QuickAccessCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TranscriptionTable } from "@/components/dashboard/TranscriptionTable";
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

        {/* Transcriptions Section */}
        <TranscriptionTable transcriptions={recentTranscriptions} />

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

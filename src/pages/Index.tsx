
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { FileText, Headphones, Clock, FilePen } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <WelcomeCard />
        
        <QuickActions />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            icon={FileText} 
            title="Artigos" 
            value="∞" 
            change={{ value: "Comece a criar", positive: true }}
          />
          <StatsCard 
            icon={Headphones} 
            title="Transcrições" 
            value="∞" 
            change={{ value: "Personalize", positive: true }}
          />
          <StatsCard 
            icon={Clock} 
            title="Horas Salvas" 
            value="∞" 
            change={{ value: "Aumente sua produtividade", positive: true }}
          />
          <StatsCard 
            icon={FilePen} 
            title="Reformulações" 
            value="∞" 
            change={{ value: "Experimente agora", positive: true }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;

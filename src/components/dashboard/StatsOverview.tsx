
import { Card, CardContent } from "@/components/ui/card";
import { BarChart2, CalendarDays, FileText, Clock } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export function StatsOverview() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  const stats = [
    {
      title: "Artigos Pendentes",
      value: "3",
      icon: CalendarDays,
      change: { value: "2 novos", positive: true },
      link: "/articles/manage",
    },
    {
      title: "Fontes Monitorizadas",
      value: "7",
      icon: FileText,
      change: { value: "2 atualizadas", positive: true },
      link: "/news",
    },
    {
      title: "Transcrições Recentes",
      value: "12",
      icon: Clock,
      link: "/transcribe",
    },
    {
      title: "Desempenho",
      value: "82%",
      icon: BarChart2,
      change: { value: "5%", positive: true },
      link: "/profile/statistics",
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Link to={stat.link} key={index} className="hover:opacity-90 transition-opacity">
          <StatsCard 
            icon={stat.icon} 
            title={stat.title} 
            value={stat.value} 
            change={stat.change}
          />
        </Link>
      ))}
    </div>
  );
}

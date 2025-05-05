
import { useAuth } from "@/contexts/AuthContext";
import { FilePlus, Sparkles, Newspaper, FileText, Mic, ChartPie } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function QuickAccessSection() {
  const { user } = useAuth();
  
  // Different card sets based on authentication status
  const accessCards = user ? [
    {
      title: "Criar Novo Artigo",
      description: "Gere um artigo a partir de notas, áudio ou texto",
      icon: FilePlus,
      href: "/new-article",
      color: "bg-black text-white"
    },
    {
      title: "Reformular Conteúdo",
      description: "Reescreva ou melhore um artigo existente",
      icon: Sparkles,
      href: "/reformulate",
      color: "bg-white border-gray-200"
    },
    {
      title: "Importar Notícias",
      description: "Conecte fontes de notícias para monitorar",
      icon: Newspaper,
      href: "/news",
      color: "bg-white border-gray-200"
    },
    {
      title: "Meus Artigos",
      description: "Veja e gerencie todos os seus artigos",
      icon: FileText,
      href: "/articles",
      color: "bg-white border-gray-200"
    }
  ] : [
    {
      title: "Criação de Artigos",
      description: "Gere artigos profissionais em minutos, não horas",
      icon: FilePlus,
      href: "/auth",
      color: "bg-white border-gray-200"
    },
    {
      title: "Transcrição Automática",
      description: "Converta áudio em texto editável instantaneamente",
      icon: Mic,
      href: "/auth",
      color: "bg-white border-gray-200"
    },
    {
      title: "Monitoramento de Fontes",
      description: "Acompanhe notícias de várias fontes em um só lugar",
      icon: Newspaper,
      href: "/auth",
      color: "bg-white border-gray-200"
    },
    {
      title: "Análise Editorial",
      description: "Métricas de desempenho para otimizar sua produção",
      icon: ChartPie,
      href: "/auth",
      color: "bg-white border-gray-200"
    }
  ];
  
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {accessCards.map((card, index) => (
        <motion.div key={index} variants={item}>
          <Link to={card.href} className="block h-full">
            <Card className={`h-full rounded-2xl border hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden ${card.color}`}>
              <div className="p-6 flex flex-col h-full">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-gray-100 mb-4">
                  <card.icon className="h-6 w-6 text-gray-800" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                <p className={`text-sm ${card.color === 'bg-black text-white' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {card.description}
                </p>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

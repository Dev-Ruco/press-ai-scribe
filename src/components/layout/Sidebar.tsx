
import { cn } from "@/lib/utils";
import {
  Layout,
  FileText,
  FilePlus,
  RefreshCw,
  Headphones,
  BookOpen,
  BarChart2,
  Share2,
  BookOpenCheck,
  Brain,
  Newspaper,
} from "lucide-react";
import { useLocation } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  
  const menuItems = [
    { icon: Layout, label: 'Painel', href: '/' },
    { icon: FileText, label: 'Notícias', href: '/news' },
    { icon: FilePlus, label: 'Novo', href: '/new-article' },
    { icon: RefreshCw, label: 'Reformular', href: '/reformulate' },
    { icon: Headphones, label: 'Transcrever', href: '/transcribe' },
    { icon: BookOpen, label: 'Artigos', href: '/articles' },
    { icon: Brain, label: 'IA', href: '/ai-training' },
    { icon: BarChart2, label: 'Análise', href: '/analytics' },
    { icon: Share2, label: 'Integrar', href: '/integrations' },
    { icon: BookOpenCheck, label: 'Normas', href: '/style-guide' },
    { icon: Newspaper, label: 'Redação', href: '/create-newsroom' },
  ];

  return (
    <div 
      className={cn(
        "flex flex-col h-screen border-r border-border/30 bg-[#111111] text-white/80 w-14 hover:w-56 group transition-all duration-200",
        className
      )}
    >
      <div className="flex flex-col gap-1 p-3 mt-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <a
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-2.5 py-2 rounded-md text-sm whitespace-nowrap",
                "hover:bg-white/10 hover:text-white",
                "transition-all duration-200",
                isActive ? "bg-white/10 text-white" : "text-white/70"
              )}
            >
              <item.icon size={18} className="min-w-[18px]" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

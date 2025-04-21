
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
        "flex flex-col h-screen border-r border-border/30 bg-[#111111] text-white/80 w-8 hover:w-40 group transition-all duration-200",
        className
      )}
    >
      <div className="flex flex-col gap-0.5 p-1 mt-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <a
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-1.5 py-1 rounded-md text-xs whitespace-nowrap",
                "hover:bg-white/10 hover:text-white",
                "transition-all duration-200",
                isActive ? "bg-white/10 text-white" : "text-white/70"
              )}
            >
              <item.icon size={12} className="min-w-[12px]" />
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


import { useState, useEffect } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);
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
        "flex flex-col h-screen border-r border-white/10 bg-[#111111] text-white/80 transition-all duration-300 ease-in-out",
        isHovered ? "w-48" : "w-12",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-1 p-1 mt-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <a
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs",
                "hover:bg-white/10 hover:text-white",
                "transition-all duration-200 ease-in-out",
                "relative overflow-hidden whitespace-nowrap",
                isActive ? "bg-white/10 text-white" : "text-white/70"
              )}
            >
              <item.icon size={14} className="min-w-[14px]" />
              <span className={cn(
                "transition-opacity duration-200",
                isHovered ? "opacity-100" : "opacity-0"
              )}>
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

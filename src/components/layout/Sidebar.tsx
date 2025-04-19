import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  ChevronLeft,
  ChevronRight,
  Layout,
  FileText,
  FilePlus,
  RefreshCw,
  Headphones,
  BookOpen,
  BarChart2,
  Share2,
  BookOpenCheck,
} from "lucide-react";
import { useLocation } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  
  const location = useLocation();
  
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { icon: Layout, label: 'Painel Editorial', href: '/' },
    { icon: FileText, label: 'Últimas Notícias', href: '/news' },
    { icon: FilePlus, label: 'Criar Novo Artigo', href: '/new-article' },
    { icon: RefreshCw, label: 'Reformular Conteúdo', href: '/reformulate' },
    { icon: Headphones, label: 'Transcrever Áudio', href: '/transcribe' },
    { icon: BookOpen, label: 'Gestão de Artigos', href: '/articles' },
    { icon: BarChart2, label: 'Análise Editorial', href: '/analytics' },
    { icon: Share2, label: 'Integração com Plataformas', href: '/integrations' },
    { icon: BookOpenCheck, label: 'Normas e Estilo', href: '/style-guide' },
  ];

  return (
    <div 
      className={cn(
        "flex flex-col h-screen border-r bg-[#34393f] text-white transition-all duration-300 ease-in-out shadow-md",
        collapsed ? "w-16" : "w-[20%]",
        className
      )}
    >
      <div className="flex items-center justify-end p-4 border-b border-sidebar-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-sidebar-accent/20 transition-all duration-200"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="flex flex-col gap-1 p-2 flex-1">
        <TooltipProvider delayDuration={100}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <a 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg",
                      "hover:bg-[#373c43] hover:text-white hover:shadow-md",
                      "transition-all duration-200 ease-in-out group",
                      collapsed ? "justify-center" : "px-4",
                      "relative overflow-hidden",
                      isActive ? 
                        "bg-[#373c43] text-white border-l-4 border-white" : 
                        "text-[rgba(255,255,255,0.7)]"
                    )}
                  >
                    <item.icon 
                      size={20} 
                      className={cn(
                        "min-w-[24px] opacity-85 transition-transform duration-200",
                        "group-hover:scale-110 group-hover:opacity-100"
                      )} 
                    />
                    {!collapsed && (
                      <span className="text-sm transition-opacity duration-200">
                        {item.label}
                      </span>
                    )}
                  </a>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent 
                    side="right" 
                    className="bg-[#373c43] text-white border-none shadow-lg z-50"
                  >
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="p-4 text-center text-xs text-white/60">
        {!collapsed && "Press AI © 2025"}
      </div>
    </div>
  );
}

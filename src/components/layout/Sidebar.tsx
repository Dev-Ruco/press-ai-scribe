
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
  Brain,
  Newspaper,
} from "lucide-react";
import { useLocation } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : true; // Default to collapsed
  });
  
  const location = useLocation();
  
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

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
        "flex flex-col h-screen border-r bg-[#1a1a1a] text-white/80 transition-all duration-300 ease-in-out",
        collapsed ? "w-12" : "w-48",
        className
      )}
    >
      <div className="flex items-center justify-end p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-white/80 hover:bg-white/10 h-6 w-6"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>
      
      <Separator className="bg-white/10" />
      
      <div className="flex flex-col gap-1 p-1 flex-1">
        <TooltipProvider delayDuration={100}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <a 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                      "hover:bg-white/10 hover:text-white",
                      "transition-all duration-200 ease-in-out group",
                      collapsed ? "justify-center" : "px-3",
                      "relative overflow-hidden",
                      isActive ? 
                        "bg-white/10 text-white" : 
                        "text-white/70"
                    )}
                  >
                    <item.icon 
                      size={16} 
                      className={cn(
                        "min-w-[16px] transition-transform duration-200",
                        "group-hover:scale-105"
                      )} 
                    />
                    {!collapsed && (
                      <span className="text-xs truncate">
                        {item.label}
                      </span>
                    )}
                  </a>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent 
                    side="right" 
                    className="bg-[#1a1a1a] text-white/90 border-none shadow-lg text-xs py-1 px-2"
                  >
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
      
      <Separator className="bg-white/10" />
      
      <div className="p-2 text-center text-[10px] text-white/40">
        {!collapsed && "Press AI"}
      </div>
    </div>
  );
}

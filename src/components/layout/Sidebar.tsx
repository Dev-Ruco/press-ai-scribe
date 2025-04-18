
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  
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
        "flex flex-col h-screen border-r border-border bg-bg-white",
        collapsed ? "w-16" : "w-64",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <img 
            src="/lovable-uploads/db3d147e-9c95-4af5-bbeb-9c68dcc60353.png" 
            alt="Press AI Logo" 
            className="h-8 max-w-full" 
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <Separator />
      
      <div className="flex flex-col gap-1 p-2 flex-1">
        {menuItems.map((item, index) => (
          <a 
            key={index} 
            href={item.href}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg text-text-secondary hover:bg-bg-gray transition-default",
              collapsed ? "justify-center" : "px-4"
            )}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </div>
      
      <Separator />
      
      <div className="p-4 text-center text-xs text-text-secondary">
        {!collapsed && "Press AI © 2025"}
      </div>
    </div>
  );
}

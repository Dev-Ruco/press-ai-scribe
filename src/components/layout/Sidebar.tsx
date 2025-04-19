import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Layout, FileText, FilePlus, RefreshCw, Headphones, BookOpen, BarChart2, Share2, BookOpenCheck } from "lucide-react";
interface SidebarProps {
  className?: string;
}
export function Sidebar({
  className
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  const menuItems = [{
    icon: Layout,
    label: 'Painel Editorial',
    href: '/'
  }, {
    icon: FileText,
    label: 'Últimas Notícias',
    href: '/news'
  }, {
    icon: FilePlus,
    label: 'Criar Novo Artigo',
    href: '/new-article'
  }, {
    icon: RefreshCw,
    label: 'Reformular Conteúdo',
    href: '/reformulate'
  }, {
    icon: Headphones,
    label: 'Transcrever Áudio',
    href: '/transcribe'
  }, {
    icon: BookOpen,
    label: 'Gestão de Artigos',
    href: '/articles'
  }, {
    icon: BarChart2,
    label: 'Análise Editorial',
    href: '/analytics'
  }, {
    icon: Share2,
    label: 'Integração com Plataformas',
    href: '/integrations'
  }, {
    icon: BookOpenCheck,
    label: 'Normas e Estilo',
    href: '/style-guide'
  }];
  return <div className={cn("flex flex-col h-screen border-r bg-[#34393f] text-white", collapsed ? "w-16" : "w-64", "transition-all duration-300 ease-in-out shadow-md", className)}>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && <img src="/lovable-uploads/db3d147e-9c95-4af5-bbeb-9c68dcc60353.png" alt="Press AI Logo" className="h-8 max-w-full" />}
        
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="flex flex-col gap-1 p-2 flex-1">
        {menuItems.map((item, index) => <a key={index} href={item.href} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-[rgba(255,255,255,0.7)]", "hover:bg-[#373c43] hover:text-white hover:border-l-[3px] hover:border-l-white/40", "transition-all duration-200 ease-in-out", collapsed ? "justify-center" : "px-4", "group relative")} data-title={collapsed ? item.label : undefined}>
            <item.icon size={20} className="min-w-[24px] opacity-85" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </a>)}
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="p-4 text-center text-xs text-white/60">
        {!collapsed && "Press AI © 2025"}
      </div>
    </div>;
}
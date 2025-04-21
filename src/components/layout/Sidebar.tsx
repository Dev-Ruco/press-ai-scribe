
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
  Bot,
  Settings,
} from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const { current, isAdmin } = useWorkspace();
  
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Itens do menu padrão (pessoal)
  const personalMenuItems = [
    { icon: Layout, label: 'Painel Editorial', href: '/' },
    { icon: FileText, label: 'Últimas Notícias', href: '/news' },
    { icon: FilePlus, label: 'Criar Novo Artigo', href: '/new-article' },
    { icon: RefreshCw, label: 'Reformular Conteúdo', href: '/reformulate' },
    { icon: Headphones, label: 'Transcrever Áudio', href: '/transcribe' },
    { icon: BookOpen, label: 'Gestão de Artigos', href: '/articles' },
    { icon: Brain, label: 'Treino da IA', href: '/ai-training' },
    { icon: BarChart2, label: 'Análise Editorial', href: '/analytics' },
    { icon: Share2, label: 'Integração com Plataformas', href: '/integrations' },
    { icon: BookOpenCheck, label: 'Normas e Estilo', href: '/style-guide' },
    { icon: Newspaper, label: 'Criar Redação', href: '/create-newsroom' },
  ];

  // Itens adicionais para redações
  const organisationAdminItems = [
    { icon: Bot, label: 'Configurar Agentes', href: '/agents' },
    { icon: Settings, label: 'Configurações da Redação', href: '/newsroom-settings' },
  ];

  // Determinar quais itens de menu mostrar
  let menuItems = [...personalMenuItems];

  if (current.type === 'organisation') {
    // Se for uma organização, adicionar itens específicos de organização
    if (current.organisation && isAdmin(current.organisation.id)) {
      // Adicionar itens de administração ao final
      menuItems = [...personalMenuItems, ...organisationAdminItems];
    }
  }
  
  // Estilo customizado baseado na redação atual
  const sidebarStyle = current.type === 'organisation' && current.organisation?.primaryColor 
    ? { backgroundColor: adjustColorBrightness(current.organisation.primaryColor, -0.3) }
    : {};

  // Função para ajustar o brilho de uma cor
  function adjustColorBrightness(color: string, amount: number): string {
    // Esta função simplificada ajusta o brilho de uma cor HEX ou HSL
    if (color.startsWith('hsl')) {
      // Extrair apenas o valor L (luminosidade) em HSL
      const match = color.match(/hsl\(\s*([0-9]+)\s*,\s*([0-9]+)%\s*,\s*([0-9]+)%/i);
      if (match) {
        const h = parseInt(match[1]);
        const s = parseInt(match[2]);
        let l = parseInt(match[3]);
        
        // Ajustar luminosidade
        l = Math.max(0, Math.min(100, l + amount * 100));
        
        return `hsl(${h}, ${s}%, ${l}%)`;
      }
    }
    
    // Caso não consiga processar, retorna a cor original
    return color;
  }

  return (
    <div 
      className={cn(
        "flex flex-col h-screen border-r text-white transition-all duration-300 ease-in-out shadow-md",
        collapsed ? "w-16" : "w-64",
        className
      )}
      style={sidebarStyle}
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
                  <Button
                    variant="ghost"
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
                    onClick={() => navigate(item.href)}
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
                  </Button>
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
        {!collapsed && (
          current.type === 'organisation' 
            ? `${current.organisation?.name} © 2025`
            : "Press AI © 2025"
        )}
      </div>
    </div>
  );
}

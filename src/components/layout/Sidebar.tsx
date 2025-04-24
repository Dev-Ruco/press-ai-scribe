
import { cn } from "@/lib/utils";
import {
  Layout,
  FileText,
  FilePlus,
  Headphones,
  Brain,
  BarChart2,
  Share2,
  Newspaper,
} from "lucide-react";
import { useLocation } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
}

export function Sidebar({ className, collapsed = false }: SidebarProps) {
  const location = useLocation();
  
  const menuItems = [
    { icon: Layout, label: 'Painel', href: '/' },
    { icon: FileText, label: 'Notícias', href: '/news' },
    { icon: FilePlus, label: 'Novo', href: '/new-article' },
    { icon: Headphones, label: 'Transcrições', href: '/transcribe' },
    { icon: Brain, label: 'IA', href: '/ai-training' },
    { icon: BarChart2, label: 'Análise', href: '/analytics' },
    { icon: Share2, label: 'Integrar', href: '/integrations' },
    { icon: Newspaper, label: 'Redação', href: '/create-newsroom' },
  ];

  return (
    <aside 
      className={cn(
        "h-full flex flex-col",
        "bg-[#111111] border-r border-border/30",
        className
      )}
    >
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-3">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <a
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-2.5 py-2 rounded-md text-sm",
                  "transition-all duration-200",
                  "hover:bg-white/10",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-white/70 hover:text-white",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} className="min-w-[20px]" />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </a>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}

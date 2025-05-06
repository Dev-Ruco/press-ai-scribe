
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FilePlus, 
  FileText, 
  Headphones, 
  Brain, 
  BarChart2, 
  Share2, 
  Newspaper, 
  Users, 
  Settings,
  LayoutDashboard
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface SidebarNavProps {
  collapsed?: boolean;
}

export function SidebarNav({ collapsed = false }: SidebarNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  // Modernized and simplified menu items - added Dashboard as the first item
  const menuItems = [
    { icon: LayoutDashboard, label: language === 'pt-MZ' ? 'Dashboard' : 'Dashboard', href: '/' },
    { icon: FilePlus, label: language === 'pt-MZ' ? 'Novo' : 'New', href: '/new-article' },
    { icon: FileText, label: language === 'pt-MZ' ? 'Artigos' : 'Articles', href: '/news' },
    { icon: Brain, label: language === 'pt-MZ' ? 'IA' : 'AI', href: '/ai-training' },
    { icon: Headphones, label: language === 'pt-MZ' ? 'Áudio' : 'Audio', href: '/transcribe' },
    { icon: Share2, label: language === 'pt-MZ' ? 'Links' : 'Links', href: '/integrations' },
    { icon: BarChart2, label: language === 'pt-MZ' ? 'Insights' : 'Insights', href: '/analytics' },
    { icon: Brain, label: language === 'pt-MZ' ? 'Treinar' : 'Train', href: '/ai-training' },
    { icon: Newspaper, label: language === 'pt-MZ' ? 'Redacções' : 'Newsrooms', href: '/create-newsroom' },
    { icon: Users, label: language === 'pt-MZ' ? 'Equipa' : 'Team', href: '/team' },
    { icon: Settings, label: language === 'pt-MZ' ? 'Definições' : 'Settings', href: '/settings/profile' },
  ];

  return (
    <ScrollArea className="flex-1">
      <nav className="flex flex-col gap-1 p-3">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.href || 
                          (item.href === '/' && location.pathname === '/');
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-2 rounded-md text-sm",
                    "transition-all duration-300",
                    "hover:bg-[#3D3D3D]",
                    isActive 
                      ? "bg-gradient-to-r from-[#232323] to-[#2c2c2c] text-white border-l-[3px] border-white shadow-sm" 
                      : "text-white/90 hover:text-white",
                    "relative overflow-hidden",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                  }}
                >
                  <item.icon size={18} className={cn(
                    "min-w-[18px]", 
                    isActive ? "text-white" : "text-white/80"
                  )} />
                  <span 
                    className={cn(
                      "truncate transition-all duration-300 font-medium",
                      isActive ? "font-semibold" : "",
                      collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute inset-0 rounded-r-md opacity-10"></span>
                  )}
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={!collapsed}>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </ScrollArea>
  );
}

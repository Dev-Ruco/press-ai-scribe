
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
  Settings 
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
  const { language } = useLanguage();

  // Modernized and simplified menu items
  const menuItems = [
    { icon: FilePlus, label: language === 'pt' ? 'Novo' : 'New', href: '/new-article' },
    { icon: FileText, label: language === 'pt' ? 'Artigos' : 'Articles', href: '/news' },
    { icon: Brain, label: language === 'pt' ? 'IA' : 'AI', href: '/ai-training' },
    { icon: Headphones, label: language === 'pt' ? 'Áudio' : 'Audio', href: '/transcribe' },
    { icon: Share2, label: language === 'pt' ? 'Links' : 'Links', href: '/integrations' },
    { icon: BarChart2, label: language === 'pt' ? 'Insights' : 'Insights', href: '/analytics' },
    { icon: Brain, label: language === 'pt' ? 'Treinar' : 'Train', href: '/ai-training' },
    { icon: Newspaper, label: language === 'pt' ? 'Redações' : 'Newsrooms', href: '/create-newsroom' },
    { icon: Users, label: language === 'pt' ? 'Equipa' : 'Team', href: '/team' },
    { icon: Settings, label: language === 'pt' ? 'Definições' : 'Settings', href: '/settings/profile' },
  ];

  return (
    <ScrollArea className="flex-1">
      <nav className="flex flex-col gap-1 p-3">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-2 rounded-md text-sm",
                    "transition-all duration-200",
                    "hover:bg-slate-100",
                    isActive 
                      ? "bg-slate-100 text-black border-l-2 border-black" 
                      : "text-slate-700 hover:text-black",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                  }}
                >
                  <item.icon size={18} className="min-w-[18px]" />
                  <span 
                    className={cn(
                      "truncate transition-all duration-300 font-medium",
                      collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}
                  >
                    {item.label}
                  </span>
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

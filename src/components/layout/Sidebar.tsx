
import { cn } from "@/lib/utils";
import {
  FilePlus,
  FileText,
  Headphones,
  Brain,
  BarChart2,
  Globe,
  Share2,
  Newspaper,
  Users,
  Settings,
  LogOut,
  User,
  CreditCard,
} from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "@/components/common/Logo";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
}

export function Sidebar({ className, collapsed = false }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast({
        title: language === 'pt' ? "Erro ao realizar logout" : "Error logging out",
        description: language === 'pt' ? "Tente novamente mais tarde" : "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <aside 
      className={cn(
        "h-full flex flex-col transition-all duration-300",
        "bg-white border-r border-border",
        className
      )}
    >
      {/* Logo section */}
      <div className="p-4 flex items-center justify-center">
        <Logo size={collapsed ? "small" : "normal"} className="text-black" />
      </div>

      {/* Main navigation */}
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
                  "hover:bg-slate-100",
                  isActive 
                    ? "bg-slate-100 text-black border-l-2 border-black" 
                    : "text-slate-700 hover:text-black",
                  collapsed ? "justify-center" : "justify-start"
                )}
                title={collapsed ? item.label : undefined}
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
            );
          })}
        </nav>
      </ScrollArea>
      
      {/* Sidebar footer with user profile */}
      <div className="mt-auto border-t border-slate-200 pt-3 pb-4 px-3">
        {/* User profile and settings */}
        <div className={cn(
          "flex items-center",
          collapsed ? "flex-col gap-3" : "px-2 justify-between"
        )}>
          {user ? (
            <>
              {/* User dropdown menu */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="text-sm bg-slate-100 text-black">
                            {user?.email?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="right" hidden={!collapsed}>
                    <p>{user?.email}</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent className="w-56 bg-white text-black border-slate-200" align="end" sideOffset={5} forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-200" />
                  <DropdownMenuItem 
                    onClick={() => navigate('/settings/profile')} 
                    className="text-sm focus:bg-slate-100"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>{language === 'pt' ? "Conta" : "Account"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/settings/plan')} 
                    className="text-sm focus:bg-slate-100"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>{language === 'pt' ? "Plano" : "Plan"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200" />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-sm text-red-600 focus:bg-slate-100 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{language === 'pt' ? "Sair" : "Logout"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Plan button (only visible when not collapsed) */}
              {!collapsed && (
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/settings/plan')}
                  className="h-8 text-xs bg-transparent border-slate-200 text-slate-700 hover:text-black hover:bg-slate-100"
                >
                  <CreditCard size={14} className="mr-1.5" />
                  {language === 'pt' ? "Plano" : "Plan"}
                </Button>
              )}
            </>
          ) : (
            /* Login button if not logged in */
            <div className={cn(
              "flex",
              collapsed ? "flex-col gap-2" : "gap-2 w-full"
            )}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/auth')}
                    className={cn(
                      "border-slate-200 text-slate-700 hover:text-black hover:bg-slate-100",
                      collapsed ? "w-9 h-9 p-0" : "flex-1"
                    )}
                  >
                    {collapsed ? (
                      <User size={18} />
                    ) : (
                      language === 'pt' ? "Entrar" : "Login"
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" hidden={!collapsed}>
                  <p>{language === 'pt' ? "Entrar" : "Login"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

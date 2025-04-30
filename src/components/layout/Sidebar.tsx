
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
  Search,
  Settings,
  Globe,
  LogOut,
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
import { Input } from "@/components/ui/input";
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const menuItems = [
    { icon: Layout, label: 'Painel', href: '/dashboard' }, // Changed from '/' to '/dashboard'
    { icon: FileText, label: 'Notícias', href: '/news' },
    { icon: FilePlus, label: 'Novo', href: '/new-article' },
    { icon: Headphones, label: 'Transcrições', href: '/transcribe' },
    { icon: Brain, label: 'IA', href: '/ai-training' },
    { icon: BarChart2, label: 'Análise', href: '/analytics' },
    { icon: Share2, label: 'Integrar', href: '/integrations' },
    { icon: Newspaper, label: 'Redação', href: '/create-newsroom' },
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
        "bg-[#111111] border-r border-border/30",
        className
      )}
    >
      {/* Logo section */}
      <div className="p-4 flex items-center justify-center">
        <Logo size={collapsed ? "small" : "normal"} className="text-white" />
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
                  "hover:bg-white/10",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-white/70 hover:text-white",
                  collapsed ? "justify-center" : "justify-start"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} className="min-w-[20px]" />
                <span 
                  className={cn(
                    "truncate transition-all duration-300",
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
      
      {/* Sidebar footer with user profile, search and settings */}
      <div className="mt-auto border-t border-white/10 pt-3 pb-4 px-3">
        {/* Search input */}
        <div className={cn(
          "mb-3 relative transition-all duration-300", 
          collapsed && !isSearchFocused ? "px-0.5" : "px-2"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "relative rounded-md",
                isSearchFocused && collapsed ? "absolute left-0 right-0 z-10" : ""
              )}>
                <Input
                  type="search"
                  placeholder={collapsed && !isSearchFocused ? "" : (language === 'pt' ? "Pesquisar..." : "Search...")}
                  className={cn(
                    "h-9 w-full bg-white/5 border-white/10 text-white/80 placeholder:text-white/40 focus:bg-white/10",
                    collapsed && !isSearchFocused ? "pl-7" : "",
                    isSearchFocused && collapsed ? "w-56" : ""
                  )}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <Search
                  className={cn(
                    "absolute",
                    collapsed && !isSearchFocused ? "left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" : "left-2.5 top-1/2 -translate-y-1/2",
                    "h-4 w-4 text-white/50"
                  )}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" align="start" hidden={!collapsed || isSearchFocused}>
              <p>{language === 'pt' ? "Pesquisar" : "Search"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Language switcher (simplified version) */}
        {!collapsed && (
          <div className="flex gap-2 px-2 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage('pt')}
              className={`text-sm h-7 ${language === 'pt' ? 'bg-white/10 text-white' : 'text-white/70'}`}
            >
              PT
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage('en')}
              className={`text-sm h-7 ${language === 'en' ? 'bg-white/10 text-white' : 'text-white/70'}`}
            >
              EN
            </Button>
          </div>
        )}

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
                          <AvatarFallback className="text-sm bg-white/10 text-white">
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
                <DropdownMenuContent className="w-56 bg-[#111111] text-white border-white/10" align="end" sideOffset={5} forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {/* Language options in dropdown when collapsed */}
                  {collapsed && (
                    <>
                      <DropdownMenuItem 
                        onClick={() => setLanguage('pt')} 
                        className={`text-sm ${language === 'pt' ? 'bg-white/10' : ''} focus:bg-white/20`}
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        <span>Português</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setLanguage('en')}
                        className={`text-sm ${language === 'en' ? 'bg-white/10' : ''} focus:bg-white/20`}
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        <span>English</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={() => navigate('/settings/profile')} 
                    className="text-sm focus:bg-white/20"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{language === 'pt' ? "Configurações" : "Settings"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-sm text-red-400 focus:bg-white/20 focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{language === 'pt' ? "Sair" : "Logout"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Settings button (only visible when not collapsed) */}
              {!collapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/settings/profile')}
                  className="h-9 w-9 rounded-full bg-transparent text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Settings size={18} />
                </Button>
              )}
            </>
          ) : (
            /* Login/Register buttons if not logged in */
            <div className={cn(
              "flex",
              collapsed ? "flex-col gap-2" : "gap-2 w-full"
            )}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/auth')}
                    className={cn(
                      "text-white/70 hover:text-white hover:bg-white/10",
                      collapsed ? "w-9 h-9 p-0" : "flex-1"
                    )}
                  >
                    {collapsed ? (
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-white/10 text-white text-xs">
                          ?
                        </AvatarFallback>
                      </Avatar>
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

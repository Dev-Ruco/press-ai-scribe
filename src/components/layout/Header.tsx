
import { Button } from "@/components/ui/button";
import { FilePlus, Search, Settings, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast({
        title: language === 'pt-MZ' ? "Erro ao realizar logout" : "Error logging out",
        description: language === 'pt-MZ' ? "Tente novamente mais tarde" : "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/30 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link to="/" className="text-xl font-bold text-black">
          PRESS AI
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage('pt-MZ')}
            className={`text-sm ${language === 'pt-MZ' ? 'bg-gray-100' : ''}`}
          >
            PT
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage('en-UK')}
            className={`text-sm ${language === 'en-UK' ? 'bg-gray-100' : ''}`}
          >
            EN
          </Button>
        </div>

        <div className="relative flex items-center">
          {isSearchExpanded && (
            <Input
              type="search"
              placeholder={language === 'pt-MZ' ? "Pesquisar..." : "Search..."}
              className="w-[280px] absolute right-0 top-0 h-10 text-sm bg-gray-50 border-border/30"
              autoFocus
              onBlur={() => setIsSearchExpanded(false)}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="text-gray-600 hover:bg-gray-100 h-10 w-10 p-0"
          >
            <Search size={20} />
          </Button>
        </div>

        {!user ? (
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/auth')}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 h-10 px-4"
            >
              {language === 'pt-MZ' ? "Entrar" : "Login"}
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white h-10 px-4"
            >
              {language === 'pt-MZ' ? "Criar Conta" : "Create Account"}
            </Button>
          </div>
        ) : (
          <>
            <Button 
              asChild
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white gap-2 h-10 px-4"
            >
              <Link to="/new-article">
                <FilePlus size={18} />
                <span>{language === 'pt-MZ' ? "Novo" : "New"}</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-sm">
                      {user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/settings/profile')} className="text-sm">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{language === 'pt-MZ' ? "Configurações" : "Settings"}</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-sm text-red-500">
                  <span>{language === 'pt-MZ' ? "Sair" : "Logout"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
}


import { Button } from "@/components/ui/button";
import { FilePlus, Search, Settings } from "lucide-react";
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

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro ao realizar logout",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="h-10 border-b border-white/10 bg-[#111111] px-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/">
          <img 
            src="/lovable-uploads/db3d147e-9c95-4af5-bbeb-9c68dcc60353.png" 
            alt="Logo" 
            className="h-6 transition-transform duration-200 hover:scale-105" 
          />
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          {isSearchExpanded && (
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-[180px] absolute right-0 top-0 h-6 text-xs bg-[#1a1a1a] border-white/10"
              autoFocus
              onBlur={() => setIsSearchExpanded(false)}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="text-white/80 hover:bg-white/10 h-6 w-6"
          >
            <Search size={14} />
          </Button>
        </div>

        {!user ? (
          <div className="flex gap-1">
            <Button 
              onClick={() => navigate('/auth')}
              variant="ghost"
              size="sm"
              className="hidden md:flex text-white/80 hover:bg-white/10 h-6 text-xs"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white h-6 text-xs"
            >
              Criar Conta
            </Button>
          </div>
        ) : (
          <>
            <Button 
              asChild
              size="sm"
              className="hidden md:flex bg-white/10 hover:bg-white/20 text-white gap-1.5 h-6"
            >
              <Link to="/new-article">
                <FilePlus size={12} />
                <span className="text-xs">Novo</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-6 w-6">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback className="text-[10px]">
                      {user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-medium leading-none">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/settings/profile')} className="text-xs">
                    <Settings className="mr-2 h-3 w-3" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-xs text-red-500">
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
}

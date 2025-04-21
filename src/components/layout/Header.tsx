
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
    <header className="h-16 border-b border-border/30 bg-white px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/">
          <img 
            src="/lovable-uploads/db3d147e-9c95-4af5-bbeb-9c68dcc60353.png" 
            alt="Logo" 
            className="h-8 transition-transform duration-200 hover:scale-105" 
          />
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          {isSearchExpanded && (
            <Input
              type="search"
              placeholder="Pesquisar..."
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
              Entrar
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white h-10 px-4"
            >
              Criar Conta
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
                <span>Novo</span>
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
                    <span>Configurações</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-sm text-red-500">
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

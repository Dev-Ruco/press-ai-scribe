import { Button } from "@/components/ui/button";
import { FilePlus, Menu, Search, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const [userName, setUserName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            return;
          }

          if (profile) {
            const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
            setUserName(fullName || user.email?.split('@')[0] || '');
            if (profile.avatar_url) {
              setAvatarUrl(profile.avatar_url);
            }
          }
        } catch (err) {
          console.error("Failed to fetch user profile data:", err);
        }
      } else {
        setUserName("");
        setAvatarUrl(null);
      }
    };

    fetchUserData();
  }, [user]);

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
    <header className="h-12 border-b border-border/20 bg-[#1a1a1a] px-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden text-white/80 hover:bg-white/10 h-7 w-7" 
          onClick={onToggleMobileSidebar}
        >
          <Menu size={18} />
        </Button>
        <Link to="/">
          <img 
            src="/lovable-uploads/db3d147e-9c95-4af5-bbeb-9c68dcc60353.png" 
            alt="Logo" 
            className="h-8 transition-transform duration-200 hover:scale-105" 
          />
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          {isSearchExpanded && (
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-[180px] md:w-[240px] absolute right-0 top-0 h-7 text-sm"
              autoFocus
              onBlur={() => setIsSearchExpanded(false)}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="text-white/80 hover:bg-white/10 h-7 w-7"
          >
            <Search size={16} />
          </Button>
        </div>

        {!user ? (
          <div className="flex gap-1">
            <Button 
              onClick={() => navigate('/auth')}
              variant="ghost"
              size="sm"
              className="hidden md:flex text-white/80 hover:bg-white/10 h-7"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white h-7 text-sm"
            >
              Criar Conta
            </Button>
          </div>
        ) : (
          <>
            <Button 
              asChild
              size="sm"
              className="hidden md:flex bg-white/10 hover:bg-white/20 text-white gap-1.5 h-7"
            >
              <Link to="/new-article">
                <FilePlus size={14} />
                <span className="text-xs">Novo</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-7 w-7">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={avatarUrl} alt={userName} />
                    <AvatarFallback className="text-xs">{userName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-medium leading-none">{userName || user?.email}</p>
                    <p className="text-[10px] leading-none text-muted-foreground">{user?.email}</p>
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
                <DropdownMenuItem onClick={handleLogout} className="text-xs">
                  <span className="text-red-600">Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
}

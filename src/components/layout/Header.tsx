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
    <header className="h-[72px] border-b border-border bg-white px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-primary hover:bg-primary/10 transition-all duration-200" 
          onClick={onToggleMobileSidebar}
        >
          <Menu size={24} />
        </Button>
        <Link to="/">
          <img 
            src="/lovable-uploads/db3d147e-9c95-4af5-bbeb-9c68dcc60353.png" 
            alt="Logo" 
            className="h-16 transition-transform duration-200 hover:scale-105" 
          />
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          {isSearchExpanded && (
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-[200px] md:w-[300px] absolute right-0 top-0"
              autoFocus
              onBlur={() => setIsSearchExpanded(false)}
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="text-primary hover:bg-primary/10"
          >
            <Search size={20} />
          </Button>
        </div>

        {!user ? (
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              className="hidden md:flex"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              Criar Conta
            </Button>
          </div>
        ) : (
          <>
            <Button 
              asChild
              className="hidden md:flex bg-primary hover:bg-primary-dark text-white gap-2 transition-all duration-200 hover:shadow-md"
            >
              <Link to="/new-article">
                <FilePlus size={18} />
                <span>Novo Artigo</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarUrl} alt={userName} />
                    <AvatarFallback>{userName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName || user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
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

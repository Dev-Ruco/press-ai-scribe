
import { Button } from "@/components/ui/button";
import { FilePlus, Menu, Search, Settings, Users } from "lucide-react";
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
import { useWorkspace } from "@/contexts/WorkspaceContext";

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
  const { organisations, current, switchToPersonal, switchToOrganisation } = useWorkspace();

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
              style={current.type === 'organisation' && current.organisation?.primaryColor ? {
                backgroundColor: current.organisation.primaryColor
              } : {}}
            >
              <Link to="/new-article">
                <FilePlus size={18} />
                <span>Novo Artigo</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  {current.type === 'organisation' && current.organisation?.logoUrl ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={current.organisation.logoUrl} alt={current.organisation.name} />
                      <AvatarFallback>{current.organisation.name[0]}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={avatarUrl} alt={userName} />
                      <AvatarFallback>{userName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    {current.type === 'organisation' ? (
                      <>
                        <p className="text-sm font-medium leading-none">{current.organisation?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">Redação</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium leading-none">{userName || user?.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuLabel>Alternar para</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => switchToPersonal()}>
                    <Avatar className="h-4 w-4 mr-2">
                      <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>Conta Pessoal</span>
                  </DropdownMenuItem>
                  
                  {organisations.length > 0 && (
                    <DropdownMenuSeparator />
                  )}
                  
                  {organisations.map(org => (
                    <DropdownMenuItem 
                      key={org.id} 
                      onClick={() => switchToOrganisation(org)}
                    >
                      <Avatar className="h-4 w-4 mr-2">
                        {org.logoUrl ? (
                          <AvatarImage src={org.logoUrl} alt={org.name} />
                        ) : null}
                        <AvatarFallback>{org.name[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{org.name}</span>
                      {org.role === 'admin' && (
                        <span className="ml-2 text-xs text-muted-foreground">(Admin)</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => navigate('/create-newsroom')}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Criar Nova Redação</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

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

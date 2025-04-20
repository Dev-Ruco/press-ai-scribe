
import { Button } from "@/components/ui/button";
import { FilePlus, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthAction = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthDialog(true);
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
            alt="Press AI Logo" 
            className="h-16 transition-transform duration-200 hover:scale-105" 
          />
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Button 
              variant="ghost"
              onClick={() => handleAuthAction('login')}
              className="text-primary hover:bg-primary/10"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => handleAuthAction('signup')}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              Criar Conta
            </Button>
          </>
        ) : (
          <Button 
            asChild
            className="hidden md:flex bg-primary hover:bg-primary-dark text-white gap-2 transition-all duration-200 hover:shadow-md"
          >
            <Link to="/new-article">
              <FilePlus size={18} />
              <span>Novo Artigo</span>
            </Link>
          </Button>
        )}
      </div>

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        defaultMode={authMode}
      />
    </header>
  );
}

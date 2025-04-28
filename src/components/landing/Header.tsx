
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function Header() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user } = useAuth();

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  return (
    <header className="container mx-auto p-4 flex items-center justify-between animate-fade-in">
      <Link to="/" className="hover:opacity-80 transition-opacity">
        <Logo size="large" className="animate-fade-in" />
      </Link>
      
      {!user ? (
        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="ghost" 
            onClick={() => handleOpenAuth('login')}
            className="text-sm md:text-base hover:bg-gray-100"
          >
            Login
          </Button>
          <Button 
            variant="default"
            onClick={() => handleOpenAuth('signup')}
            className="text-sm md:text-base bg-black hover:bg-gray-900"
          >
            Regista-te
          </Button>
        </div>
      ) : (
        <Link 
          to="/dashboard" 
          className="text-sm md:text-base font-medium text-black hover:text-gray-800 transition-all"
        >
          Dashboard
        </Link>
      )}

      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)}
        defaultMode={authMode}
      />
    </header>
  );
}

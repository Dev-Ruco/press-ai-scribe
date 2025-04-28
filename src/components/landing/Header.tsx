import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto py-6 px-4 flex items-center justify-between animate-fade-in">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo size="large" className="animate-fade-in" />
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage('pt')}
              className={`text-sm ${language === 'pt' ? 'bg-gray-100' : ''}`}
            >
              PT
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage('en')}
              className={`text-sm ${language === 'en' ? 'bg-gray-100' : ''}`}
            >
              EN
            </Button>
          </div>

          {!user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-sm md:text-base hover:bg-gray-100"
              >
                {t('login')}
              </Button>
              <Button 
                variant="default"
                onClick={() => navigate('/auth')}
                className="text-sm md:text-base bg-black hover:bg-gray-900"
              >
                {t('registerButton')}
              </Button>
            </div>
          ) : (
            <Link 
              to="/dashboard" 
              className="text-sm md:text-base font-medium text-black hover:text-gray-800 transition-all"
            >
              {t('dashboard')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

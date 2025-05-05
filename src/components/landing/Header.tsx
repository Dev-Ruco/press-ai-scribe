import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (path: string) => {
    if (path.startsWith('#')) {
      // If it's a hash link, scroll to the section
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Otherwise navigate to the path
      window.location.href = path;
    }
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-sm border-b border-gray-200' 
          : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'
      }`}
    >
      <div className="container mx-auto py-4 px-4 flex items-center justify-between animate-fade-in">
        <a href="/" className="hover:opacity-80 transition-opacity">
          <Logo size="large" className="animate-fade-in" />
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <a 
              href="#features" 
              className="text-sm text-gray-700 hover:text-black transition-colors font-medium"
            >
              {language === 'pt' ? 'Recursos' : 'Features'}
            </a>
            <a 
              href="#pricing" 
              className="text-sm text-gray-700 hover:text-black transition-colors font-medium"
            >
              {language === 'pt' ? 'Preços' : 'Pricing'}
            </a>
            <a 
              href="/blog" 
              className="text-sm text-gray-700 hover:text-black transition-colors font-medium"
            >
              Blog
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition-colors font-medium outline-none">
                {language === 'pt' ? 'Empresa' : 'Company'} <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigateTo('/about')}>
                  {language === 'pt' ? 'Sobre' : 'About'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo('/contact')}>
                  {language === 'pt' ? 'Contato' : 'Contact'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo('/careers')}>
                  {language === 'pt' ? 'Carreiras' : 'Careers'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          
          <div className="h-5 w-px bg-gray-300"></div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition-colors font-medium outline-none">
                <Globe className="h-4 w-4" />
                {language === 'pt' ? 'PT' : 'EN'}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage('pt')}>
                  Português
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {!user ? (
            <div className="flex items-center gap-3">
              <Button 
                variant="default"
                onClick={() => navigateTo('#waitlist')}
                className="text-sm bg-black hover:bg-gray-900 text-white"
              >
                {language === 'pt' ? 'Entrar para lista' : 'Join waitlist'}
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigateTo('/dashboard')} 
              className="text-sm font-medium text-black hover:text-gray-800 transition-all"
            >
              {t('dashboard')}
            </Button>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 pt-2 pb-4 px-4 space-y-3">
          <a 
            href="#features" 
            className="block py-2 text-gray-700 hover:text-black font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {language === 'pt' ? 'Recursos' : 'Features'}
          </a>
          <a 
            href="#pricing" 
            className="block py-2 text-gray-700 hover:text-black font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {language === 'pt' ? 'Preços' : 'Pricing'}
          </a>
          <a 
            href="/blog" 
            className="block py-2 text-gray-700 hover:text-black font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </a>
          <a 
            href="/about" 
            className="block py-2 text-gray-700 hover:text-black font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {language === 'pt' ? 'Sobre' : 'About'}
          </a>
          <a 
            href="/contact" 
            className="block py-2 text-gray-700 hover:text-black font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {language === 'pt' ? 'Contato' : 'Contact'}
          </a>
          
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <div className="flex gap-2">
              <button 
                onClick={() => { setLanguage('pt'); setMobileMenuOpen(false); }}
                className={`px-2 py-1 text-sm ${language === 'pt' ? 'font-bold text-black' : 'text-gray-500'}`}
              >
                PT
              </button>
              <button 
                onClick={() => { setLanguage('en'); setMobileMenuOpen(false); }}
                className={`px-2 py-1 text-sm ${language === 'en' ? 'font-bold text-black' : 'text-gray-500'}`}
              >
                EN
              </button>
            </div>
            
            <Button 
              variant="default"
              onClick={() => navigateTo('#waitlist')}
              className="text-sm bg-black hover:bg-gray-900 text-white"
            >
              {language === 'pt' ? 'Lista de espera' : 'Join waitlist'}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

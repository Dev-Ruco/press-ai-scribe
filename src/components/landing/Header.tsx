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
          ? 'bg-white/90 shadow-sm backdrop-blur-md border-b border-gray-200/50' 
          : 'bg-white/80 backdrop-blur-md border-b border-gray-200/30'
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
              <DropdownMenuContent className="rounded-xl border border-gray-200/80 shadow-lg">
                <DropdownMenuItem onClick={() => navigateTo('/about')} className="rounded-lg hover:bg-gray-50">
                  {language === 'pt' ? 'Sobre' : 'About'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo('/contact')} className="rounded-lg hover:bg-gray-50">
                  {language === 'pt' ? 'Contato' : 'Contact'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateTo('/careers')} className="rounded-lg hover:bg-gray-50">
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
              <DropdownMenuContent className="rounded-xl border border-gray-200/80 shadow-lg">
                <DropdownMenuItem onClick={() => setLanguage('pt')} className="rounded-lg hover:bg-gray-50">
                  Português
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')} className="rounded-lg hover:bg-gray-50">
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {!user ? (
            <Button 
              variant="default"
              onClick={() => navigateTo('#waitlist')}
              className="text-sm px-6 py-2.5"
            >
              {t('joinWaitlist')}
            </Button>
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
            className="p-2 text-gray-700 rounded-full hover:bg-gray-100"
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
                className={`px-3 py-1.5 rounded-full text-sm ${language === 'pt' ? 'font-bold text-black bg-gray-100' : 'text-gray-500'}`}
              >
                PT
              </button>
              <button 
                onClick={() => { setLanguage('en'); setMobileMenuOpen(false); }}
                className={`px-3 py-1.5 rounded-full text-sm ${language === 'en' ? 'font-bold text-black bg-gray-100' : 'text-gray-500'}`}
              >
                EN
              </button>
            </div>
            
            <Button 
              variant="default"
              onClick={() => navigateTo('#waitlist')}
              className="text-sm"
            >
              {t('joinWaitlist')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

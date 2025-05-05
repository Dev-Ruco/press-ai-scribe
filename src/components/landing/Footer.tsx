
import React from 'react';
import { Logo } from '@/components/common/Logo';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-auto" />
              <span className="font-playfair text-lg font-bold">PRESS AI</span>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'pt' ? 'Transformando o jornalismo com IA' : 'Transforming journalism with AI'}
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">{language === 'pt' ? 'Produto' : 'Product'}</h3>
            <ul className="space-y-2">
              <li><a href="#waitlist" className="text-sm text-gray-600 hover:text-black">{language === 'pt' ? 'Lista de espera' : 'Waitlist'}</a></li>
              <li><a href="#features" className="text-sm text-gray-600 hover:text-black">{language === 'pt' ? 'Recursos' : 'Features'}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">{language === 'pt' ? 'Empresa' : 'Company'}</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm text-gray-600 hover:text-black">{language === 'pt' ? 'Sobre' : 'About'}</a></li>
              <li><a href="/contact" className="text-sm text-gray-600 hover:text-black">{language === 'pt' ? 'Contato' : 'Contact'}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">{language === 'pt' ? 'Legal' : 'Legal'}</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-sm text-gray-600 hover:text-black">{language === 'pt' ? 'Privacidade' : 'Privacy'}</a></li>
              <li><a href="/terms" className="text-sm text-gray-600 hover:text-black">{language === 'pt' ? 'Termos' : 'Terms'}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          © {currentYear} PRESS AI. {language === 'pt' ? 'Todos os direitos reservados' : 'All rights reserved'}
        </div>
      </div>
    </footer>
  );
}

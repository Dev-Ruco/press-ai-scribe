
import React from 'react';
import { Logo } from '@/components/common/Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { Twitter, Linkedin, Instagram, Mail, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Twitter className="w-4 h-4" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Instagram className="w-4 h-4" />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Mail className="w-4 h-4" />, href: "mailto:contact@pressai.com", label: "Email" }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-auto" />
              <span className="font-playfair text-lg font-bold">PRESS AI</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              {language === 'pt' 
                ? 'Transformando o processo editorial e jornalístico através de soluções de IA avançadas que economizam tempo e aumentam a qualidade.'
                : 'Transforming editorial and journalism processes through advanced AI solutions that save time and increase quality.'}
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-black hover:text-white flex items-center justify-center transition-colors" 
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-bold mb-4 text-black">{language === 'pt' ? 'Produto' : 'Product'}</h3>
            <ul className="space-y-2">
              <li><a href="#waitlist" className="text-sm text-gray-600 hover:text-black transition-colors hover:underline">{language === 'pt' ? 'Lista de espera' : 'Waitlist'}</a></li>
              <li><a href="#features" className="text-sm text-gray-600 hover:text-black transition-colors hover:underline">{language === 'pt' ? 'Recursos' : 'Features'}</a></li>
              <li><a href="/pricing" className="text-sm text-gray-600 hover:text-black transition-colors hover:underline">{language === 'pt' ? 'Preços' : 'Pricing'}</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-bold mb-4 text-black">{language === 'pt' ? 'Empresa' : 'Company'}</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm text-gray-600 hover:text-black transition-colors hover:underline">{language === 'pt' ? 'Sobre' : 'About'}</a></li>
              <li><a href="/blog" className="text-sm text-gray-600 hover:text-black transition-colors hover:underline">{language === 'pt' ? 'Blog' : 'Blog'}</a></li>
              <li><a href="/contact" className="text-sm text-gray-600 hover:text-black transition-colors hover:underline">{language === 'pt' ? 'Contato' : 'Contact'}</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-bold mb-4 text-black">{language === 'pt' ? 'Legal' : 'Legal'}</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-sm text-gray-600 hover:text-black transition-colors hover:underline">{language === 'pt' ? 'Privacidade' : 'Privacy'}</a></li>
              <li><a href="/terms" className="text-sm text-gray-600 hover:text-black transition-colors hover:underline">{language === 'pt' ? 'Termos' : 'Terms'}</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-bold mb-4 text-black">{language === 'pt' ? 'Recursos' : 'Resources'}</h3>
            <ul className="space-y-2">
              <li><a href="/help" className="text-sm text-gray-600 hover:text-black transition-colors hover:underline">{language === 'pt' ? 'Ajuda' : 'Help Center'}</a></li>
              <li><a href="/documentation" className="text-sm text-gray-600 hover:text-black transition-colors hover:underline">{language === 'pt' ? 'Documentação' : 'Documentation'}</a></li>
              <li>
                <a href="/api" className="text-sm flex items-center gap-1 text-gray-600 hover:text-black transition-colors hover:underline">
                  API <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-sm text-gray-600">
            © {currentYear} PRESS AI. {language === 'pt' ? 'Todos os direitos reservados' : 'All rights reserved'}
          </p>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setLanguage('pt')} className={`text-xs ${language === 'pt' ? 'font-bold text-black' : 'text-gray-500 hover:text-black'} transition-colors`}>
              Português
            </button>
            <button onClick={() => setLanguage('en')} className={`text-xs ${language === 'en' ? 'font-bold text-black' : 'text-gray-500 hover:text-black'} transition-colors`}>
              English
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

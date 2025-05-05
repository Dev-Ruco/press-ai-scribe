
import React from 'react';
import { Logo } from '@/components/common/Logo';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
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
              {t('transformingJournalism')}
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">{t('product')}</h3>
            <ul className="space-y-2">
              <li><a href="/dashboard" className="text-sm text-gray-600 hover:text-black">{t('dashboard')}</a></li>
              <li><a href="/pricing" className="text-sm text-gray-600 hover:text-black">{t('pricing')}</a></li>
              <li><a href="/features" className="text-sm text-gray-600 hover:text-black">{t('features')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">{t('company')}</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm text-gray-600 hover:text-black">{t('about')}</a></li>
              <li><a href="/contact" className="text-sm text-gray-600 hover:text-black">{t('contact')}</a></li>
              <li><a href="/blog" className="text-sm text-gray-600 hover:text-black">{t('blog')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-sm text-gray-600 hover:text-black">{t('privacy')}</a></li>
              <li><a href="/terms" className="text-sm text-gray-600 hover:text-black">{t('terms')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          © {currentYear} PRESS AI. {t('allRightsReserved')}
        </div>
      </div>
    </footer>
  );
}

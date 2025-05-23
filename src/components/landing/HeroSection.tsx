import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Newspaper } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';

const screenshot = "/lovable-uploads/fcaefddb-58c6-4858-be28-f816d438a65b.png";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="container mx-auto px-4 py-8 md:py-16 flex flex-col md:flex-row items-center gap-4 md:gap-8">
      <div 
        className={`flex-1 space-y-3 md:space-y-5 transition-all duration-1000 delay-300 transform ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-xs md:text-sm font-medium">
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-gray-700" /> {t('heroRevolutionizing')}
        </div>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold leading-tight text-black">
          {t('heroTitle')}
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-xl">
          {t('heroDescription')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center pt-4">
          <Link to="/dashboard">
            <Button 
              size={isMobile ? "default" : "lg"} 
              className="bg-gradient-to-r from-gray-900 to-black text-white hover:from-black hover:to-gray-800 font-medium rounded-md px-4 md:px-6 flex items-center gap-2 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-md w-full sm:w-auto h-10 md:h-12"
            >
              {t('tryItNow')}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
            </Button>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-gray-600 text-xs md:text-sm mt-2 sm:mt-0">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">JM</div>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs">AS</div>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-xs">+</div>
            </div>
            <span>{t('journalistsCount')}</span>
          </div>
        </div>
      </div>

      <div 
        className={`flex-1 mt-8 md:mt-0 transition-all duration-1000 delay-500 transform ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}
      >
        <div 
          className="relative rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.02]"
          style={{
            transformStyle: 'preserve-3d',
            transform: isMobile ? 'none' : 'perspective(2000px) rotateY(-8deg)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-50 rounded-lg -z-10 transform -translate-y-2 translate-x-2 scale-[0.98] blur-lg"></div>
          
          <img 
            src={screenshot} 
            alt="PRESS AI Interface" 
            className="w-full rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.15)] border border-black/5"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.07] to-transparent pointer-events-none rounded-lg" />
          
          <div className="absolute -bottom-2 -right-2 bg-black text-white rounded-full p-2 shadow-lg transform rotate-12 animate-pulse">
            <Newspaper className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>
      </div>
    </section>
  );
}

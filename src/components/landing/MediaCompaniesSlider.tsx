
import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';

export function MediaCompaniesSlider() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Updated logos to include the new noticias logo
  const logos = [
    "/lovable-uploads/22d2707f-3f03-4638-84b1-49b1590703ea.png", // BBC NEWS
    "/lovable-uploads/1d0ef951-adaa-4412-b67b-811febbc95ed.png", // SAVANA
    "/lovable-uploads/dd2f0aa6-c877-4668-a965-f503e143a22d.png", // O PAIS
    "/lovable-uploads/aef8b775-db3a-4e98-ac7c-ca92228c789c.png"  // NOTICIAS (newly added)
  ];

  useEffect(() => {
    if (sliderRef.current && inView) {
      // Create infinite scrolling animation effect
      const animation = sliderRef.current.animate(
        [
          { transform: 'translateX(0%)' },
          { transform: 'translateX(-50%)' }
        ],
        {
          duration: 30000,
          iterations: Infinity,
          easing: 'linear'
        }
      );
      
      return () => animation.cancel();
    }
  }, [inView]);
  
  return (
    <section ref={ref} className="py-10 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-center text-gray-600 font-medium">
          {language === 'pt' 
            ? 'Empresas de mídia que confiam em nossa tecnologia'
            : 'Trusted by leading media companies'}
        </p>
      </div>
      
      <div className="relative w-full">
        {/* Gradient fade on the left */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
        
        {/* Slider container */}
        <div className="flex overflow-hidden">
          <div 
            ref={sliderRef} 
            className="flex items-center space-x-16 whitespace-nowrap min-w-max"
          >
            {/* First set of logos */}
            {logos.map((logo, index) => (
              <div 
                key={`logo-1-${index}`} 
                className="h-12 flex items-center px-4 grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img 
                  src={logo} 
                  alt={`Media Partner ${index + 1}`} 
                  className="h-full w-auto object-contain max-w-[120px] opacity-60 hover:opacity-100"
                />
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {logos.map((logo, index) => (
              <div 
                key={`logo-2-${index}`} 
                className="h-12 flex items-center px-4 grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img 
                  src={logo} 
                  alt={`Media Partner ${index + 1}`} 
                  className="h-full w-auto object-contain max-w-[120px] opacity-60 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Gradient fade on the right */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>
    </section>
  );
}

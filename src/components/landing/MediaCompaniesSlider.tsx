
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

  // Logos of reputable media companies - using the provided images
  const logos = [
    "/lovable-uploads/1ce04543-bc90-4942-acea-8c81bad6ae3f.png",
    "/lovable-uploads/1d0ef951-adaa-4412-b67b-811febbc95ed.png",
    "/lovable-uploads/206886bf-f31d-4473-b8a3-8d0f94fa4053.png",
    "/lovable-uploads/22d2707f-3f03-4638-84b1-49b1590703ea.png",
    "/lovable-uploads/276230cc-79a0-425a-9ba4-49526346f543.png",
    "/lovable-uploads/7a601aa7-1a0d-4cf6-85d6-91081a7788cb.png"
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

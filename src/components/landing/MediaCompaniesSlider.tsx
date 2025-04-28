
import * as React from "react";
import { useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useLanguage } from "@/contexts/LanguageContext";

const mediaCompanies = [
  {
    name: "Grupo SOICO",
    logo: "/lovable-uploads/bc849af4-1ce1-4029-aa25-78e5ed23cec5.png",
    alt: "Logo do Grupo SOICO - Sociedade Independente de Comunicação"
  },
  {
    name: "Savana",
    logo: "/lovable-uploads/addb7fcf-e45d-445a-977b-b2bd1cc7a6e6.png",
    alt: "Logo do Jornal Savana - Independência e Integridade"
  },
  {
    name: "BBC News",
    logo: "/lovable-uploads/276230cc-79a0-425a-9ba4-49526346f543.png",
    alt: "Logo da BBC News"
  }
];

export function MediaCompaniesSlider() {
  const { t } = useLanguage();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Auto-rotation setup
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const scrollAmount = carouselRef.current.offsetWidth / 3;
        carouselRef.current.scrollLeft += scrollAmount;
        
        // Reset scroll position when reaching the end
        if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth - carouselRef.current.offsetWidth) {
          carouselRef.current.scrollLeft = 0;
        }
      }
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-playfair text-center mb-8 text-black">
          {t('mediaCompaniesTitle')}
        </h2>
        
        <Carousel 
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
            containScroll: false,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4" ref={carouselRef}>
            {mediaCompanies.map((company, index) => (
              <CarouselItem 
                key={index} 
                className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/3"
                role="group"
                aria-label={company.name}
              >
                <div className="flex flex-col items-center justify-center p-6 h-32 rounded-lg bg-white shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                  <img 
                    src={company.logo}
                    alt={company.alt}
                    className="w-auto h-14 object-contain transition-all duration-300"
                  />
                  <span className="mt-3 text-sm font-medium text-gray-600">{company.name}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

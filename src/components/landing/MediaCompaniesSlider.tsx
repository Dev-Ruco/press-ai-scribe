
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
    name: "Reuters",
    logo: "/lovable-uploads/1d0ef951-adaa-4412-b67b-811febbc95ed.png",
    alt: "Reuters logo in black and white"
  },
  {
    name: "Associated Press",
    logo: "/lovable-uploads/1ff1d7aa-25da-4e1c-b84c-ea8cf5609e77.png",
    alt: "Associated Press (AP) logo in monochrome"
  },
  {
    name: "Bloomberg",
    logo: "/lovable-uploads/206886bf-f31d-4473-b8a3-8d0f94fa4053.png",
    alt: "Bloomberg News logo in black and white"
  },
  {
    name: "The Guardian",
    logo: "/lovable-uploads/22d2707f-3f03-4638-84b1-49b1590703ea.png",
    alt: "The Guardian logo in monochrome"
  },
  {
    name: "Financial Times",
    logo: "/lovable-uploads/7a5a4cf3-53ba-4fe2-ba09-a5230b2641df.png",
    alt: "Financial Times logo in black and white"
  },
  {
    name: "Al Jazeera",
    logo: "/lovable-uploads/7a601aa7-1a0d-4cf6-85d6-91081a7788cb.png",
    alt: "Al Jazeera logo in monochrome"
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-playfair text-center mb-12 text-gray-900">
          {t('mediaCompaniesTitle')}
        </h2>
        
        <Carousel 
          className="w-full max-w-6xl mx-auto"
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
                className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4"
                role="group"
                aria-label={company.name}
              >
                <div className="flex flex-col items-center justify-center p-8 h-40 rounded-lg bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                  <img 
                    src={company.logo}
                    alt={company.alt}
                    className="w-auto h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <span className="mt-4 text-sm font-medium text-gray-600">{company.name}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

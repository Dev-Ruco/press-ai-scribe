
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const screenshots = [
  "/lovable-uploads/7a601aa7-1a0d-4cf6-85d6-91081a7788cb.png",
  "/lovable-uploads/206886bf-f31d-4473-b8a3-8d0f94fa4053.png",
  "/lovable-uploads/d8eacc65-d63b-4f96-b540-c0794bd2322c.png"
];

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold leading-tight text-black">
          Jornalismo Inteligente para a Era Digital
        </h1>
        <p className="text-base text-gray-600">
          Transforme suas ideias em artigos profissionais em minutos com a nossa IA especializada em jornalismo.
        </p>
        <div className="pt-4">
          <Link to="/dashboard">
            <Button size="lg" className="bg-black text-white hover:bg-gray-900 font-medium rounded-md px-6 flex items-center gap-2">
              Experimente Agora
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="relative rounded-lg shadow-lg overflow-hidden">
          <img 
            src="/lovable-uploads/206886bf-f31d-4473-b8a3-8d0f94fa4053.png" 
            alt="PRESS AI Interface" 
            className="w-full rounded-lg"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {screenshots.slice(1).map((screenshot, index) => (
            <div key={index} className="rounded-lg shadow-md overflow-hidden">
              <img 
                src={screenshot} 
                alt={`PRESS AI Interface ${index + 2}`}
                className="w-full rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

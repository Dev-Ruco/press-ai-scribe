
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const screenshot = "/lovable-uploads/fcaefddb-58c6-4858-be28-f816d438a65b.png";

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

      <div className="flex-1">
        <div 
          className="relative rounded-lg shadow-xl overflow-hidden transition-transform duration-300"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'perspective(2000px) rotateY(-8deg)',
          }}
        >
          <img 
            src={screenshot} 
            alt="PRESS AI Interface" 
            className="w-full rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.1)] border border-black/5"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.07] to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

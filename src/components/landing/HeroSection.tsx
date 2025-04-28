import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 space-y-6">
        <h1 className="text-5xl md:text-6xl font-playfair font-bold leading-tight text-black">
          Revoluciona a tua Redação com IA
        </h1>
        <p className="text-xl text-gray-600">
          Do material bruto ao artigo publicado em minutos. Descobre a próxima geração de jornalismo assistido por IA.
        </p>
      <div className="pt-4">
        <Link to="/dashboard">
          <Button size="lg" className="bg-black text-white hover:bg-gray-900 font-medium rounded-md text-lg px-8 flex items-center gap-2">
            Experimenta Gratuitamente
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
      </div>
      <div className="flex-1">
        <img 
          src="/lovable-uploads/7a601aa7-1a0d-4cf6-85d6-91081a7788cb.png" 
          alt="PRESS AI Interface" 
          className="rounded-lg border border-gray-200 shadow-2xl"
        />
      </div>
    </section>
  );
}

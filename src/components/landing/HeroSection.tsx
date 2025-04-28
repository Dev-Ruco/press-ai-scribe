
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 space-y-4">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold leading-tight text-black">
          Jornalismo Inteligente para a Era Digital
        </h1>
        <p className="text-lg text-gray-600">
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
        <img 
          src="/lovable-uploads/7a601aa7-1a0d-4cf6-85d6-91081a7788cb.png" 
          alt="PRESS AI Interface" 
          className="rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Newspaper, Sparkles } from 'lucide-react';

const screenshot = "/lovable-uploads/fcaefddb-58c6-4858-be28-f816d438a65b.png";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12">
      <div 
        className={`flex-1 space-y-6 transition-all duration-1000 delay-300 transform ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" /> Revolucionando o jornalismo
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold leading-tight text-black">
          Transforma ideias em <span className="relative inline-block">
            <span className="relative z-10">artigos</span>
            <span className="absolute bottom-2 left-0 right-0 h-3 bg-black/5 -z-10 transform -rotate-1"></span>
          </span> em segundos
        </h1>
        <p className="text-lg text-gray-600 max-w-xl">
          Crie conteúdo jornalístico profissional 10x mais rápido com PRESS AI, a ferramenta que combina a inteligência artificial 
          com a sua expertise editorial para redefinir o seu fluxo de trabalho.
        </p>
        <div className="flex gap-4 items-center pt-4">
          <Link to="/dashboard">
            <Button 
              size="lg" 
              className="bg-black text-white hover:bg-gray-900 font-medium rounded-md px-6 flex items-center gap-2 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-14"
            >
              Experimente Agora
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">JM</div>
              <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs">AS</div>
              <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-xs">+</div>
            </div>
            <span>300+ jornalistas já utilizam</span>
          </div>
        </div>
      </div>

      <div 
        className={`flex-1 transition-all duration-1000 delay-500 transform ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}
      >
        <div 
          className="relative rounded-lg shadow-xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
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
          
          <div className="absolute -bottom-2 -right-2 bg-black text-white rounded-full p-2 shadow-lg transform rotate-12 animate-pulse">
            <Newspaper className="w-6 h-6" />
          </div>
        </div>
      </div>
    </section>
  );
}

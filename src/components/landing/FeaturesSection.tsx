import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function FeaturesSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const isMobile = useIsMobile();

  return (
    <section ref={ref} className="bg-white py-12 md:py-16 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-8 md:mb-12 text-center">
          <h2 className={`text-2xl md:text-3xl font-playfair font-bold mb-3 md:mb-4 text-black transition-all duration-700 transform ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            Da Ideia ao Artigo Final em Minutos
          </h2>
          <p className={`text-sm md:text-base text-gray-600 transition-all duration-700 delay-100 transform ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            Um fluxo de trabalho inteligente que transforma qualquer material em conteúdo jornalístico impecável, 
            mantendo a sua voz editorial e economizando horas do seu dia.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              number: 1,
              title: "Ingestão Inteligente",
              description: "Carrega qualquer tipo de conteúdo — áudio, vídeo, imagem, PDF ou texto — e deixe a nossa IA fazer o trabalho pesado da extração e organização do material."
            },
            {
              number: 2,
              title: "Processamento Otimizado",
              description: "Transcrição automática via Whisper e OCR de última geração transformam qualquer formato em texto estruturado pronto para ser trabalhado."
            },
            {
              number: 3,
              title: "Criação Editorial",
              description: "Receba sugestões de títulos impactantes e um artigo completo com lead, corpo e conclusão, preservando sempre o estilo único da sua publicação."
            }
          ].map((feature, index) => (
            <FeatureStep 
              key={index} 
              {...feature} 
              delay={index * 200} 
              isVisible={inView}
            />
          ))}
        </div>

        <div className={`mt-12 md:mt-16 flex justify-center transition-all duration-700 delay-500 transform ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-black/5 p-4 md:p-6 rounded-xl max-w-2xl">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">A Jornada de um Correspondente</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  "Antes do PRESS AI, eu passava 3 horas diárias apenas transcrevendo entrevistas e organizando notas. 
                  Agora tenho esse tempo de volta para investigar e aprofundar minhas reportagens. 
                  O resultado? Três vezes mais artigos publicados e conteúdo de maior qualidade."
                </p>
                <div className="mt-4 font-medium">— Carlos Mendes, Correspondente Internacional</div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-12 text-center transition-all duration-700 delay-700 transform ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Link to="/dashboard">
            <Button 
              size={isMobile ? "default" : "lg"} 
              className="bg-black text-white hover:bg-gray-900 font-medium rounded-md px-6 flex items-center gap-2 mx-auto transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-12 md:h-14"
            >
              Experimente Agora
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

interface FeatureStepProps {
  number: number;
  title: string;
  description: string;
  delay: number;
  isVisible: boolean;
}

function FeatureStep({ number, title, description, delay, isVisible }: FeatureStepProps) {
  return (
    <div 
      className={`bg-gray-50 p-6 md:p-8 rounded-lg border border-gray-200 text-center transition-all duration-700 transform ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 md:w-16 md:h-16 bg-black text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-4 transform transition-transform duration-500 hover:scale-110 relative">
        {number}
        <div className="absolute w-full h-full border-2 border-black rounded-full animate-ping opacity-20"></div>
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-black">{title}</h3>
      <p className="text-gray-600 text-sm md:text-base">{description}</p>
    </div>
  );
}

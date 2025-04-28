
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

export function FeaturesSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="bg-white py-24 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className={`text-4xl font-playfair font-bold mb-6 text-black transition-all duration-700 transform ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            Da Ideia ao Artigo Final em Minutos
          </h2>
          <p className={`text-lg text-gray-600 transition-all duration-700 delay-100 transform ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            Um fluxo de trabalho inteligente que transforma qualquer material em conteúdo jornalístico impecável, 
            mantendo a sua voz editorial e economizando horas do seu dia.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

        <div className={`mt-16 flex justify-center transition-all duration-700 delay-700 transform ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-black/5 p-6 rounded-xl max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">A Jornada de um Correspondente</h3>
                <p className="text-gray-600">
                  "Antes do PRESS AI, eu passava 3 horas diárias apenas transcrevendo entrevistas e organizando notas. 
                  Agora tenho esse tempo de volta para investigar e aprofundar minhas reportagens. 
                  O resultado? Três vezes mais artigos publicados e conteúdo de maior qualidade."
                </p>
                <div className="mt-4 font-medium">— Carlos Mendes, Correspondente Internacional</div>
              </div>
            </div>
          </div>
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
      className={`bg-gray-50 p-8 rounded-lg border border-gray-200 text-center transition-all duration-700 transform ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 transform transition-transform duration-500 hover:scale-110 relative">
        {number}
        <div className="absolute w-full h-full border-2 border-black rounded-full animate-ping opacity-20"></div>
      </div>
      <h3 className="text-xl font-bold mb-4 text-black">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

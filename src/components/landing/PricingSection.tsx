
import React from 'react';
import { PricingCard } from './pricing/PricingCard';
import { useInView } from 'react-intersection-observer';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function PricingSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const isMobile = useIsMobile();

  const pricingPlans = [
    {
      title: "Iniciação",
      price: "10",
      description: "créditos mensais grátis",
      features: [
        "Upload de conteúdo em qualquer formato",
        "Transcrição automática básica",
        "Artigos até 500 palavras",
        "Exportação em texto simples"
      ]
    },
    {
      title: "Profissional",
      price: "50",
      description: "créditos por 19€/mês",
      features: [
        "Todas as funcionalidades básicas",
        "Transcrição avançada multilíngue",
        "Artigos até 2000 palavras",
        "Personalização de estilo editorial",
        "Exportação para WordPress e múltiplos formatos",
        "Suporte prioritário"
      ],
      popular: true
    },
    {
      title: "Redação",
      price: "200",
      description: "créditos por 49€/mês",
      features: [
        "Todas as funcionalidades profissionais",
        "Artigos sem limite de palavras",
        "Acesso para múltiplos utilizadores (até 5)",
        "Treino avançado de estilo editorial",
        "API para integrações personalizadas",
        "Gestor de conta dedicado"
      ]
    }
  ];

  return (
    <section ref={ref} className="bg-white py-16 md:py-24 border-y border-gray-200 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className={`max-w-3xl mx-auto text-center mb-12 md:mb-16 transition-all duration-1000 transform ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 md:mb-6 text-black">Invista no Futuro do Seu Jornalismo</h2>
          <p className="text-base md:text-lg text-gray-600">
            Escolha o plano que melhor se adapta ao tamanho e necessidades da sua operação editorial.
            Cada crédito corresponde a um artigo completo gerado pela plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent opacity-50 -skew-y-6 -z-10"></div>
          
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`transition-all duration-700 transform ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <PricingCard {...plan} />
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
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

        <div className={`mt-12 max-w-4xl mx-auto bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 transition-all duration-1000 delay-700 transform ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h3 className="text-xl font-bold mb-6 text-center">Perguntas Frequentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
                O que é um crédito?
              </h4>
              <p className="text-gray-600 text-xs md:text-sm">Um crédito permite gerar um artigo completo a partir do conteúdo que você fornecer, incluindo transcrição, geração de títulos e corpo do texto.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
                Os créditos acumulam?
              </h4>
              <p className="text-gray-600 text-xs md:text-sm">Sim! Os créditos não utilizados em um mês são transferidos para o mês seguinte, até um máximo de três vezes o seu plano mensal.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
                Como funciona o treino de estilo?
              </h4>
              <p className="text-gray-600 text-xs md:text-sm">Você fornece exemplos do seu estilo editorial ideal, e nossa IA aprende a replicar esse tom e abordagem em todo o conteúdo gerado.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
                Posso mudar de plano?
              </h4>
              <p className="text-gray-600 text-xs md:text-sm">Absolutamente! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento, com os ajustes refletidos na sua próxima fatura.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

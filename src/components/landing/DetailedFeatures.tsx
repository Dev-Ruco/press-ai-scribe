
import React from 'react';
import { Upload, FileText, MessageSquare, Newspaper, Link as LinkIcon, Sparkles, Rocket, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';
import { FeatureItem } from './features/FeatureItem';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function DetailedFeatures() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const isMobile = useIsMobile();

  const features = [
    {
      icon: <Upload />,
      title: "Upload Universal",
      description: "Carrega instantaneamente qualquer formato de mídia — áudio de entrevistas, vídeos de eventos, documentos PDF ou imagens de texto — com um simples arrastar e soltar."
    },
    {
      icon: <FileText />,
      title: "Transcrição Perfeita",
      description: "Tecnologia de ponta que converte fala em texto com precisão incrível, incluindo reconhecimento de idiomas e dialetos com suporte específico para Português Europeu."
    },
    {
      icon: <MessageSquare />,
      title: "Brainstorming de Títulos",
      description: "Algoritmo especializado que gera várias opções de títulos impactantes, adaptados ao estilo editorial da sua publicação e otimizados para engajamento."
    },
    {
      icon: <Newspaper />,
      title: "Estruturação Editorial",
      description: "Artigos instantâneos com estrutura profissional — lead preciso, desenvolvimento organizado e conclusão impactante, tudo seguindo os melhores princípios jornalísticos."
    },
    {
      icon: <LinkIcon />,
      title: "Integração Perfeita",
      description: "Publique diretamente no WordPress ou exporte em múltiplos formatos (.docx, .pdf, .html) sem perder formatação, mantendo a consistência visual da sua marca."
    },
    {
      icon: <Sparkles />,
      title: "Personalização Avançada",
      description: "IA que aprende o estilo característico da sua publicação, adaptando-se às suas preferências de tom, formato e abordagem para criar conteúdo verdadeiramente autêntico."
    },
    {
      icon: <Rocket />,
      title: "Aceleração do Fluxo",
      description: "Reduza em até 70% o tempo de produção de conteúdo, permitindo que sua equipe foque mais em investigação, análises aprofundadas e valor editorial único."
    },
    {
      icon: <Lightbulb />,
      title: "Sugestões Contextuais",
      description: "Receba recomendações inteligentes de ângulos alternativos, fontes relacionadas e dados complementares que enriquecem a narrativa dos seus artigos."
    }
  ];

  return (
    <section ref={ref} className="container mx-auto px-4 py-16 md:py-24">
      <div className={`transition-all duration-1000 transform ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-4 md:mb-6 text-black">Recursos Que Transformam o Seu Jornalismo</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 md:mb-16 text-base md:text-lg">
          Cada funcionalidade foi desenhada para superar um desafio específico do fluxo de trabalho jornalístico, 
          economizando tempo e ampliando a qualidade editorial.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-x-8 md:gap-y-12">
          {features.map((feature, index) => (
            <div
              key={index} 
              className={`transition-all duration-700 transform ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <FeatureItem {...feature} />
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-20 bg-black rounded-xl p-6 md:p-8 text-white max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <TrendingUp className="h-10 h-10 md:h-12 md:w-12 mb-4" />
              <h3 className="text-xl md:text-2xl font-bold mb-4">Impacto Comprovado</h3>
              <p className="text-sm md:text-base mb-6">
                Redatores que utilizam o PRESS AI relatam um aumento médio de 65% na produtividade 
                e uma melhoria de 40% na qualidade editorial após apenas um mês de uso.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl md:text-3xl font-bold">3x</div>
                  <div className="text-xs md:text-sm text-white/70">mais artigos</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold">-70%</div>
                  <div className="text-xs md:text-sm text-white/70">tempo de produção</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold">+40%</div>
                  <div className="text-xs md:text-sm text-white/70">engajamento</div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative h-32 w-full rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-white rounded-full"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span>PRESS AI</span>
                    <span>Métodos Tradicionais</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/dashboard">
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="bg-white text-black hover:bg-gray-100 font-medium rounded-md px-6 flex items-center gap-2 mx-auto transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-12 md:h-14"
              >
                Experimente Agora
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

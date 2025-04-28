
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "O PRESS AI não apenas acelerou a produção de conteúdo — revolucionou todo o nosso fluxo editorial. O que antes levava um dia inteiro, agora é concluído em uma hora com qualidade superior.",
    author: "Ana Silva",
    role: "Editora-Chefe, Jornal Diário",
    rating: 5,
    image: "/lovable-uploads/7a5a4cf3-53ba-4fe2-ba09-a5230b2641df.png"
  },
  {
    quote: "A integração com WordPress e a personalização de estilo são diferenciadores incríveis. Conseguimos manter a identidade da nossa publicação enquanto escalamos a produção de conteúdo em mais de 300%.",
    author: "João Santos",
    role: "Diretor Digital, Tech News",
    rating: 5,
    image: "/lovable-uploads/206886bf-f31d-4473-b8a3-8d0f94fa4053.png"
  },
  {
    quote: "Como jornalista freelancer, o PRESS AI tornou-se minha vantagem competitiva. Agora entrego mais conteúdo, com maior profundidade e em prazos que impressionam meus clientes.",
    author: "Maria Costa",
    role: "Jornalista Independente",
    rating: 5,
    image: "/lovable-uploads/abb0c56c-9d9a-411f-8379-a6301b7a5875.png"
  }
];

export function TestimonialsSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const isMobile = useIsMobile();

  return (
    <section ref={ref} className="container mx-auto px-4 py-16 md:py-24 overflow-hidden">
      <div className={`transition-all duration-1000 transform ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-4 md:mb-6 text-black">A Voz de Quem Transformou Seu Trabalho</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 md:mb-16 text-base md:text-lg">
          Descubra como profissionais de todo o setor jornalístico estão redefinindo seus fluxos de trabalho 
          e alcançando novos patamares de produtividade e qualidade editorial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard 
            key={testimonial.author} 
            {...testimonial} 
            isVisible={inView} 
            delay={index * 200}
          />
        ))}
      </div>

      <div className={`mt-10 md:mt-16 text-center transition-all duration-1000 delay-700 transform ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="inline-flex items-center gap-2 text-gray-600 font-medium mb-8">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 md:w-5 md:h-5 fill-current text-yellow-500" />
            ))}
          </div>
          <span className="text-base md:text-lg">4.9/5 baseado em mais de 200 avaliações</span>
        </div>

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
    </section>
  );
}

interface TestimonialCardProps extends Testimonial {
  isVisible: boolean;
  delay: number;
}

function TestimonialCard({ quote, author, role, rating, image, isVisible, delay }: TestimonialCardProps) {
  return (
    <div 
      className={`bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200 h-full flex flex-col transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current text-yellow-500" />
        ))}
      </div>
      <p className="text-gray-600 mb-6 flex-grow text-sm md:text-base">{quote}</p>
      <div className="flex items-center gap-4">
        {image && (
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-200">
            <img src={image} alt={author} className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <div className="font-bold text-black text-sm md:text-base">{author}</div>
          <div className="text-gray-600 text-xs md:text-sm">{role}</div>
        </div>
      </div>
    </div>
  );
}

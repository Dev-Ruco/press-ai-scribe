
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Star, ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote: "PRESS AI didn't just speed up content production — it revolutionized our entire editorial workflow. What used to take a full day is now completed in an hour with superior quality.",
    author: "Ana Silva",
    role: "Editor-in-Chief, Daily Journal",
    rating: 5
  },
  {
    quote: "WordPress integration and style customization are incredible differentiators. We've maintained our publication's identity while scaling content production by over 300%.",
    author: "João Santos",
    role: "Digital Director, Tech News",
    rating: 5
  },
  {
    quote: "As a freelance journalist, PRESS AI has become my competitive advantage. I now deliver more content, with greater depth, on timelines that impress my clients.",
    author: "Maria Costa",
    role: "Independent Journalist",
    rating: 5
  }
];

export function TestimonialsSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const isMobile = useIsMobile();

  return (
    <section ref={ref} className="container mx-auto px-4 py-12 md:py-16 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className={`transition-all duration-1000 transform ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-center mb-3 md:mb-4 text-black">
          The Voice of Transformed Workflows
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8 md:mb-12 text-sm md:text-base">
          Discover how professionals across the journalism industry are redefining their workflows 
          and reaching new levels of productivity and editorial quality.
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

      <div className="mt-8 md:mt-12 text-center">
        <div className="inline-flex items-center gap-2 text-gray-600 font-medium mb-6">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 md:w-5 md:h-5 fill-current text-yellow-500" />
            ))}
          </div>
          <span className="text-base md:text-lg">4.9/5 based on over 200 reviews</span>
        </div>

        <Link to="/dashboard">
          <Button 
            size={isMobile ? "default" : "lg"} 
            className="bg-black text-white hover:bg-gray-900 font-medium rounded-md px-6 flex items-center gap-2 mx-auto transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-12 md:h-14"
          >
            Try It Now
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

function TestimonialCard({ quote, author, role, rating, isVisible, delay }: TestimonialCardProps) {
  return (
    <div 
      className={`bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col relative transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute top-6 right-6 opacity-10">
        <Quote className="w-10 h-10 text-gray-400" />
      </div>
      
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current text-yellow-500" />
        ))}
      </div>
      
      <p className="text-gray-600 mb-6 flex-grow text-sm md:text-base relative z-10">{quote}</p>
      
      <div>
        <div className="h-px w-12 bg-gray-300 mb-4"></div>
        <div className="font-bold text-black text-sm md:text-base">{author}</div>
        <div className="text-gray-600 text-xs md:text-sm">{role}</div>
      </div>
    </div>
  );
}

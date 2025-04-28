
import React from 'react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "O PRESS AI revolucionou a forma como produzo conteúdo. A rapidez e precisão são impressionantes.",
    author: "Ana Silva",
    role: "Editora-Chefe, Jornal Diário"
  },
  {
    quote: "A integração com WordPress e a personalização de estilo tornam o processo incrivelmente eficiente.",
    author: "João Santos",
    role: "Jornalista, Tech News"
  },
  {
    quote: "A transcrição automática e sugestão de títulos poupam-me horas de trabalho todos os dias.",
    author: "Maria Costa",
    role: "Redactora, Portal de Notícias"
  }
];

export function TestimonialsSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-4xl font-playfair font-bold text-center mb-16 text-black">O Que Dizem os Jornalistas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.author} {...testimonial} />
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({ quote, author, role }: Testimonial) {
  return (
    <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
      <div className="text-3xl text-black mb-4">"</div>
      <p className="text-gray-600 mb-6">{quote}</p>
      <div className="font-bold text-black">{author}</div>
      <div className="text-gray-600">{role}</div>
    </div>
  );
}

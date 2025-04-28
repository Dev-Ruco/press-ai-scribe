
import React from 'react';

export function FeaturesSection() {
  return (
    <section className="bg-white py-20 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-playfair font-bold text-center mb-16 text-black">Como Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureStep 
            number={1}
            title="Ingestão de Material"
            description="Carrega áudio, vídeo, imagem, PDF ou texto. Aceitamos todos os formatos populares."
          />
          <FeatureStep 
            number={2}
            title="Transcrição e Extração"
            description="O sistema processa automaticamente os materiais com transcrição via Whisper e OCR integrado."
          />
          <FeatureStep 
            number={3}
            title="Geração de Conteúdo"
            description="Recebe cinco sugestões de títulos e gera um artigo completo com estrutura profissional."
          />
        </div>
      </div>
    </section>
  );
}

interface FeatureStepProps {
  number: number;
  title: string;
  description: string;
}

function FeatureStep({ number, title, description }: FeatureStepProps) {
  return (
    <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
      <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-4 text-black">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

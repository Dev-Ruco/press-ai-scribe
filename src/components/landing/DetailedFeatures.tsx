
import React from 'react';
import { Upload, FileText, MessageSquare, Newspaper, Link as LinkIcon, Sparkles } from 'lucide-react';
import { FeatureItem } from './features/FeatureItem';

export function DetailedFeatures() {
  const features = [
    {
      icon: <Upload />,
      title: "Upload Simples",
      description: "Arrasta ficheiros ou utiliza o selector para fazer upload de áudio, vídeo, imagem, PDF ou texto."
    },
    {
      icon: <FileText />,
      title: "Transcrição Automática",
      description: "Utiliza o poder do Whisper e OCR para extrair texto de qualquer formato com precisão."
    },
    {
      icon: <MessageSquare />,
      title: "Sugestão de Títulos",
      description: "Recebe cinco sugestões de títulos em Português Europeu (AO1945) para escolheres."
    },
    {
      icon: <Newspaper />,
      title: "Geração de Artigo Completo",
      description: "Produz artigos com lead, corpo estruturado e conclusão, mantendo a tua voz editorial."
    },
    {
      icon: <LinkIcon />,
      title: "Integração WordPress",
      description: "Exporta diretamente para o WordPress ou descarrega em formatos comuns como .docx, .pdf ou .html."
    },
    {
      icon: <Sparkles />,
      title: "Personalização de Estilo",
      description: "Treina o sistema para adotar o estilo editorial da tua publicação com materiais exemplares."
    }
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-4xl font-playfair font-bold text-center mb-16 text-black">Funcionalidades em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          {features.slice(0, 3).map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </div>
        <div className="space-y-8">
          {features.slice(3).map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

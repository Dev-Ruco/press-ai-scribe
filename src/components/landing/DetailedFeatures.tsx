
import React from 'react';
import { Upload, FileText, MessageSquare, Newspaper, Link as LinkIcon, Sparkles } from 'lucide-react';

export function DetailedFeatures() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-4xl font-playfair font-bold text-center mb-16 text-black">Funcionalidades em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <FeatureItem
            icon={<Upload />}
            title="Upload Simples"
            description="Arrasta ficheiros ou utiliza o selector para fazer upload de áudio, vídeo, imagem, PDF ou texto."
          />
          <FeatureItem
            icon={<FileText />}
            title="Transcrição Automática"
            description="Utiliza o poder do Whisper e OCR para extrair texto de qualquer formato com precisão."
          />
          <FeatureItem
            icon={<MessageSquare />}
            title="Sugestão de Títulos"
            description="Recebe cinco sugestões de títulos em Português Europeu (AO1945) para escolheres."
          />
        </div>
        <div className="space-y-8">
          <FeatureItem
            icon={<Newspaper />}
            title="Geração de Artigo Completo"
            description="Produz artigos com lead, corpo estruturado e conclusão, mantendo a tua voz editorial."
          />
          <FeatureItem
            icon={<LinkIcon />}
            title="Integração WordPress"
            description="Exporta diretamente para o WordPress ou descarrega em formatos comuns como .docx, .pdf ou .html."
          />
          <FeatureItem
            icon={<Sparkles />}
            title="Personalização de Estilo"
            description="Treina o sistema para adotar o estilo editorial da tua publicação com materiais exemplares."
          />
        </div>
      </div>
    </section>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-black">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

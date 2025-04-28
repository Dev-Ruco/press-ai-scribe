import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Header com Login/Registro */}
      <header className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/db3d147e-9c95-4af5-bbeb-9c68dcc60353.png" 
            alt="Press AI Logo" 
            className="h-10 w-auto"
          />
          <span className="font-playfair text-xl font-bold">PRESS AI</span>
        </div>
        <div className="flex gap-4">
          <Link to="/auth" className="text-gray-400 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/auth?mode=signup" className="text-gray-400 hover:text-white transition-colors">
            Regista-te
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold leading-tight">
            Revoluciona a tua Redação com IA
          </h1>
          <p className="text-xl text-gray-300">
            Do material bruto ao artigo publicado em minutos. Descobre a próxima geração de jornalismo assistido por IA.
          </p>
          <div className="pt-4">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-medium rounded-md text-lg px-8 flex items-center gap-2">
                Experimenta Gratuitamente
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <img 
            src="/lovable-uploads/7a601aa7-1a0d-4cf6-85d6-91081a7788cb.png" 
            alt="PRESS AI Interface" 
            className="rounded-lg border border-gray-800 shadow-2xl"
          />
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-gray-900/50 backdrop-blur-lg py-20 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-playfair font-bold text-center mb-16">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Steps using consistent styling */}
            <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800 text-center">
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-4">Ingestão de Material</h3>
              <p className="text-gray-400">Carrega áudio, vídeo, imagem, PDF ou texto. Aceitamos todos os formatos populares.</p>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800 text-center">
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-4">Transcrição e Extração</h3>
              <p className="text-gray-400">O sistema processa automaticamente os materiais com transcrição via Whisper e OCR integrado.</p>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800 text-center">
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-4">Geração de Conteúdo</h3>
              <p className="text-gray-400">Recebe cinco sugestões de títulos e gera um artigo completo com estrutura profissional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-playfair font-bold text-center mb-16">Funcionalidades em Destaque</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {/* Features with consistent icons and styling */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Upload Simples</h3>
                <p className="text-gray-400">Arrasta ficheiros ou utiliza o selector para fazer upload de áudio, vídeo, imagem, PDF ou texto.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Transcrição Automática</h3>
                <p className="text-gray-400">Utiliza o poder do Whisper e OCR para extrair texto de qualquer formato com precisão.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Sugestão de Títulos</h3>
                <p className="text-gray-400">Recebe cinco sugestões de títulos em Português Europeu (AO1945) para escolheres.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Geração de Artigo Completo</h3>
                <p className="text-gray-400">Produz artigos com lead, corpo estruturado e conclusão, mantendo a tua voz editorial.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Integração WordPress</h3>
                <p className="text-gray-400">Exporta diretamente para o WordPress ou descarrega em formatos comuns como .docx, .pdf ou .html.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Personalização de Estilo</h3>
                <p className="text-gray-400">Treina o sistema para adotar o estilo editorial da tua publicação com materiais exemplares.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-900/50 backdrop-blur-lg py-20 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-playfair font-bold text-center mb-16">Planos de Crédito</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pricing cards with consistent styling */}
            <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800">
              <h3 className="text-2xl font-bold mb-4">Gratuito</h3>
              <div className="text-4xl font-bold mb-2">10</div>
              <div className="text-gray-400 mb-6">créditos mensais grátis</div>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Funcionalidades básicas
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Artigos até 500 palavras
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Exportação em texto
                </li>
              </ul>
              <Link to="/auth?mode=signup">
                <Button className="w-full bg-white text-black hover:bg-gray-200">
                  Começar Grátis
                </Button>
              </Link>
            </div>
            
            {/* Personal Plan */}
            <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-white relative transform hover:scale-105 transition-transform duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-bold">
                Mais Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Pessoal</h3>
              <div className="text-4xl font-bold mb-2">50</div>
              <div className="text-gray-400 mb-6">créditos por 19 USD/mês</div>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Todas as funcionalidades
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Artigos até 2000 palavras
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Exportação para WordPress
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Treino de estilo básico
                </li>
              </ul>
              <Link to="/auth?mode=signup">
                <Button className="w-full bg-white text-black hover:bg-gray-200">
                  Escolher Plano
                </Button>
              </Link>
            </div>
            
            {/* Collaborative Plan */}
            <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800">
              <h3 className="text-2xl font-bold mb-4">Colaborativo</h3>
              <div className="text-4xl font-bold mb-2">200</div>
              <div className="text-gray-400 mb-6">créditos por 49 USD/mês</div>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Todas as funcionalidades
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Artigos sem limite de palavras
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Múltiplos utilizadores (até 5)
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Treino avançado de estilo
                </li>
              </ul>
              <Link to="/auth?mode=signup">
                <Button className="w-full bg-white text-black hover:bg-gray-200">
                  Escolher Plano
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-900/50 backdrop-blur-lg py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-playfair font-bold text-center mb-16">A Nossa Equipa</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Team members with consistent styling */}
            <div className="text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-6 border-2 border-white/20">
                <img src="/lovable-uploads/206886bf-f31d-4473-b8a3-8d0f94fa4053.png" alt="Felisberto Ruco" className="w-full h-full object-cover grayscale" />
              </div>
              <h3 className="text-2xl font-bold">Felisberto Ruco</h3>
              <div className="text-gray-400">Director Executivo</div>
            </div>
            
            <div className="text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-6 border-2 border-white/20">
                <img src="/lovable-uploads/d8eacc65-d63b-4f96-b540-c0794bd2322c.png" alt="Adriana Victor" className="w-full h-full object-cover grayscale" />
              </div>
              <h3 className="text-2xl font-bold">Adriana Victor</h3>
              <div className="text-gray-400">Directora de Marketing</div>
            </div>
            
            <div className="text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-6 border-2 border-white/20">
                <img src="/lovable-uploads/1d0ef951-adaa-4412-b67b-811febbc95ed.png" alt="Lito Malanzelo" className="w-full h-full object-cover grayscale" />
              </div>
              <h3 className="text-2xl font-bold">Lito Malanzelo</h3>
              <div className="text-gray-400">Director Operacional</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-playfair font-bold text-center mb-16">O Que Dizem os Jornalistas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800">
            <div className="text-3xl text-gray

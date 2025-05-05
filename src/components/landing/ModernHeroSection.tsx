
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Shield, Star, Monitor } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { WaitlistForm } from './WaitlistForm';
import { Separator } from '@/components/ui/separator';

interface ModernHeroSectionProps {
  onExploreClick?: () => void;
}

export function ModernHeroSection({ onExploreClick }: ModernHeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [daysLeft, setDaysLeft] = useState(7);
  const isMobile = useIsMobile();
  const { t, language } = useLanguage();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const screenshot = "/lovable-uploads/fcaefddb-58c6-4858-be28-f816d438a65b.png";

  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const getWaitlistCopyByLanguage = () => {
    if (language === 'pt') {
      return {
        badge: "Acesso exclusivo",
        title1: "Economize 70% do tempo",
        title2: "no seu fluxo editorial",
        description: "De entrevistas a artigos completos em minutos, não horas. PRESS AI automatiza as tarefas repetitivas e permite que você se concentre no que realmente importa: criação de conteúdo de qualidade.",
        cta: "Entrar para lista de espera",
        subtitle: `Lançamento em ${daysLeft} dias • Apenas 200 vagas restantes`,
        stat1: "Tempo economizado",
        stat2: "Produtividade",
        stat3: "Aprovação",
        benefits: [
          "Transcrição automática de entrevistas",
          "Estruturação inteligente de artigos", 
          "Integração com WordPress e outros CMS"
        ]
      };
    }

    return {
      badge: "Exclusive Beta Access",
      title1: "Save 70% of time",
      title2: "in your editorial workflow",
      description: "From interviews to complete articles in minutes, not hours. PRESS AI automates repetitive tasks and lets you focus on what really matters: creating quality content.",
      cta: "Join the waitlist",
      subtitle: `Launching in ${daysLeft} days • Only 200 spots remaining`,
      stat1: "Time saved",
      stat2: "Productivity",
      stat3: "Approval rate",
      benefits: [
        "Automatic interview transcription", 
        "Intelligent article structuring", 
        "WordPress and CMS integration"
      ]
    };
  };

  const copy = getWaitlistCopyByLanguage();

  // Background pattern elements
  const BackgroundPattern = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top right pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/20 to-blue-100/20 rounded-full blur-xl -mr-32 -mt-32"></div>
      
      {/* Bottom left pattern */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100/20 to-blue-100/20 rounded-full blur-xl -ml-48 -mb-48"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] bg-[length:40px_40px] opacity-[0.15]"></div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <BackgroundPattern />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <motion.div
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Small banner */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full text-sm font-medium border border-gray-200 shadow-sm mb-6">
            <Shield className="w-4 h-4 text-gray-700" /> 
            <span>{copy.badge}</span> <span className="text-black font-bold">BETA</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-playfair font-bold leading-tight text-black mb-6"
          >
            <span className="bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent block">
              {copy.title1}
            </span>
            <span className="block">{copy.title2}</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-lg text-gray-600 max-w-2xl mb-8"
          >
            {copy.description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-xl"
          >
            {copy.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 bg-white rounded-lg border border-gray-100 shadow-sm p-3 transition-all hover:shadow-md">
                <div className="rounded-full bg-gray-100 p-1 flex-shrink-0">
                  <Star className="w-3 h-3 text-gray-800" fill="black" />
                </div>
                <span className="text-gray-700 text-sm">{benefit}</span>
              </div>
            ))}
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-md mb-10"
          >
            {!showWaitlistForm ? (
              <div className="flex flex-col space-y-4 items-center">
                <Button 
                  size={isMobile ? "default" : "lg"} 
                  className="bg-black text-white hover:bg-gray-800 font-medium rounded-md w-full sm:max-w-xs flex items-center justify-center gap-2 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg py-6"
                  onClick={() => setShowWaitlistForm(true)}
                >
                  {copy.cta}
                  <ArrowRight className="w-5 h-5 animate-pulse" />
                </Button>
                
                <div className="flex items-center gap-3 text-sm text-red-600">
                  <span>{copy.subtitle}</span>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                <WaitlistForm />
              </motion.div>
            )}
          </motion.div>
          
          {/* Stats row */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center items-center gap-8 md:gap-16 pt-2 mb-12"
          >
            <div className="flex flex-col items-center">
              <span className="font-bold text-2xl md:text-3xl">70%</span>
              <span className="text-xs text-gray-600">{copy.stat1}</span>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-2xl md:text-3xl">3x</span>
              <span className="text-xs text-gray-600">{copy.stat2}</span>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-2xl md:text-3xl">94%</span>
              <span className="text-xs text-gray-600">{copy.stat3}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Browser mockup */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="perspective-1000">
            <div className="relative bg-gray-800 rounded-t-lg p-1 overflow-hidden">
              {/* Browser top bar */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-grow mx-2">
                  <div className="w-full h-6 bg-gray-700 rounded-md flex items-center justify-center">
                    <span className="text-gray-400 text-xs">app.pressai.com</span>
                  </div>
                </div>
                <Monitor className="w-4 h-4 text-gray-400" />
              </div>
              
              {/* Browser content */}
              <div className="relative overflow-hidden bg-white">
                <img 
                  src={screenshot} 
                  alt="PRESS AI Interface" 
                  className="w-full h-auto rounded-b-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.05] to-transparent pointer-events-none"></div>
              </div>
            </div>
            
            {/* Shadow effect */}
            <div className="absolute inset-0 shadow-2xl opacity-20 blur-xl -z-10 transform translate-y-8 scale-95 rounded-lg"></div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-purple-100 rounded-full blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-12 -right-12 w-24 h-24 bg-blue-100 rounded-full blur-xl opacity-40 animate-pulse delay-700"></div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <button 
            onClick={onExploreClick}
            className="flex flex-col items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <span className="text-sm">{t('exploreFeatures')}</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

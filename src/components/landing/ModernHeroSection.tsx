
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, ChevronDown, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { WaitlistForm } from './WaitlistForm';

interface ModernHeroSectionProps {
  onExploreClick?: () => void;
}

export function ModernHeroSection({ onExploreClick }: ModernHeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
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
        title1: "Revolucione seu",
        title2: "fluxo editorial",
        description: "Transforme entrevistas em artigos completos em minutos, não horas. PRESS AI reduz 70% do tempo de produção jornalística com IA avançada.",
        cta: "Entrar para lista de espera",
        subtitle: "Lançamento em breve • Vagas limitadas",
        stat1: "Tempo economizado",
        stat2: "Produtividade",
        stat3: "Equipes aprovam"
      };
    }

    return {
      badge: "Exclusive access",
      title1: "Revolutionize your",
      title2: "editorial workflow",
      description: "Transform interviews into complete articles in minutes, not hours. PRESS AI reduces 70% of journalistic production time with advanced AI.",
      cta: "Join the waitlist",
      subtitle: "Launching soon • Limited spots",
      stat1: "Time saved",
      stat2: "Productivity",
      stat3: "Teams approve"
    };
  };

  const copy = getWaitlistCopyByLanguage();

  return (
    <section className="container mx-auto px-4 py-12 md:py-20 overflow-hidden">
      <motion.div 
        className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex-1 space-y-6"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-sm font-medium">
            <Users className="w-4 h-4 text-gray-700" /> 
            <span>{copy.badge}</span> <span className="text-black font-bold">BETA</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold leading-tight text-black"
          >
            {copy.title1} <span className="bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
              {copy.title2}
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-lg text-gray-600 max-w-xl"
          >
            {copy.description}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-center pt-4"
          >
            {!showWaitlistForm && (
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="bg-gradient-to-r from-gray-900 to-black text-white hover:from-black hover:to-gray-800 font-medium rounded-md px-6 py-6 flex items-center gap-2 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg w-full sm:w-auto"
                onClick={() => setShowWaitlistForm(true)}
              >
                {copy.cta}
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </Button>
            )}
            
            {!showWaitlistForm && (
              <div className="flex items-center gap-3 text-gray-600 mt-2 sm:mt-0">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{copy.subtitle}</span>
              </div>
            )}
          </motion.div>

          {showWaitlistForm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg overflow-hidden"
            >
              <WaitlistForm />
            </motion.div>
          )}
          
          <motion.div 
            variants={itemVariants}
            className="flex items-center pt-6 gap-6"
          >
            <div className="flex flex-col items-center">
              <span className="font-bold text-2xl md:text-3xl">70%</span>
              <span className="text-xs text-gray-600">{copy.stat1}</span>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-2xl md:text-3xl">3x</span>
              <span className="text-xs text-gray-600">{copy.stat2}</span>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-2xl md:text-3xl">94%</span>
              <span className="text-xs text-gray-600">{copy.stat3}</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex-1 relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="perspective-1000">
            <div 
              className="relative transform transition-all duration-500 hover:scale-[1.02]"
              style={{
                transformStyle: 'preserve-3d',
                transform: isMobile ? 'none' : 'perspective(2000px) rotateY(-5deg) rotateX(5deg)',
              }}
            >
              {/* Laptop frame */}
              <div className="relative">
                {/* Laptop top bezel */}
                <div className="w-[102%] h-8 bg-gray-800 rounded-t-lg absolute -top-6 left-1/2 transform -translate-x-1/2"></div>
                
                {/* Screen */}
                <div className="relative rounded-lg overflow-hidden border-[12px] border-gray-800">
                  <img 
                    src={screenshot} 
                    alt="PRESS AI Interface" 
                    className="w-full h-auto rounded-sm shadow-inner"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.05] to-transparent pointer-events-none" />
                </div>
                
                {/* Laptop base */}
                <div className="w-[102%] h-3 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-lg absolute -bottom-3 left-1/2 transform -translate-x-1/2"></div>
                
                {/* Laptop shadow */}
                <div className="absolute inset-0 bg-black opacity-20 blur-xl -z-10 transform translate-y-8 scale-90 rounded-lg"></div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-gray-100 rounded-full blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-12 -right-12 w-24 h-24 bg-gray-100 rounded-full blur-xl opacity-40 animate-pulse delay-700"></div>
        </motion.div>
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
    </section>
  );
}

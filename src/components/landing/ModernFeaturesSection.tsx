
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { 
  FileText, 
  Mic, 
  FileCode, 
  BookOpen, 
  Newspaper, 
  Check,
  ArrowRight,
  Upload,
  MoveHorizontal,
  Edit,
  Share
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
import { ModernFeatureCard } from './features/ModernFeatureCard';

interface ModernFeaturesSectionProps {
  forwardedRef?: React.RefObject<HTMLElement>;
}

export const ModernFeaturesSection: React.FC<ModernFeaturesSectionProps> = ({ forwardedRef }) => {
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Combine the forwarded ref with the intersection observer ref
  const setRefs = React.useCallback(
    (node: HTMLElement | null) => {
      // for react-intersection-observer
      inViewRef(node);
      // for forwarded ref
      if (forwardedRef && node) {
        // Use a non-null assertion since we know node is not null here
        forwardedRef.current = node;
      }
    },
    [inViewRef, forwardedRef]
  );
  
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  const featuresData = [
    {
      icon: <Upload />,
      title: t('featureIntelligentIngestion'),
      description: t('featureIntelligentIngestionDesc'),
      delay: 0
    },
    {
      icon: <Mic />,
      title: t('featureTranscription'),
      description: t('featureTranscriptionDesc'),
      delay: 100
    },
    {
      icon: <MoveHorizontal />,
      title: t('featureProcessing'),
      description: t('featureProcessingDesc'),
      delay: 200
    },
    {
      icon: <Newspaper />,
      title: t('featureArticleCreation'),
      description: t('featureArticleCreationDesc'),
      delay: 300
    },
    {
      icon: <Edit />,
      title: t('featureEditing'),
      description: t('featureEditingDesc'),
      delay: 400
    },
    {
      icon: <Share />,
      title: t('featureExport'),
      description: t('featureExportDesc'),
      delay: 500
    }
  ];

  return (
    <section ref={setRefs} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div 
          className={`max-w-3xl mx-auto mb-10 md:mb-16 text-center transition-all duration-700 transform ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 text-black">
            {t('featuresSectionTitle')}
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            {t('featuresSectionDescription')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuresData.map((feature, index) => (
            <ModernFeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              isVisible={inView}
              delay={feature.delay}
            />
          ))}
        </div>

        <div 
          className={`text-center transition-all duration-700 delay-500 transform ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <Button 
            size={isMobile ? "default" : "lg"} 
            className="bg-gradient-to-r from-gray-900 to-black text-white hover:from-black hover:to-gray-800 font-medium rounded-md px-8 py-6 flex items-center gap-2 mx-auto transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg"
            onClick={() => window.location.href = '#waitlist'}
          >
            {t('startNow')}
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </Button>
        </div>
      </div>
    </section>
  );
};

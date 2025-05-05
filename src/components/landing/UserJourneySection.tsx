
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Upload, 
  FileSearch, 
  Sparkles, 
  Edit3, 
  Share2, 
  Clock 
} from 'lucide-react';

export function UserJourneySection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { t } = useLanguage();

  const journeySteps = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: t('journeyStep1Title'),
      description: t('journeyStep1Desc'),
      timeOld: '60 min',
      timeNew: '2 min',
      color: 'bg-gray-700'
    },
    {
      icon: <FileSearch className="w-6 h-6" />,
      title: t('journeyStep2Title'),
      description: t('journeyStep2Desc'),
      timeOld: '120 min',
      timeNew: '10 min',
      color: 'bg-gray-800'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: t('journeyStep3Title'),
      description: t('journeyStep3Desc'),
      timeOld: '90 min',
      timeNew: '15 min',
      color: 'bg-gray-900'
    },
    {
      icon: <Edit3 className="w-6 h-6" />,
      title: t('journeyStep4Title'),
      description: t('journeyStep4Desc'),
      timeOld: '60 min',
      timeNew: '20 min',
      color: 'bg-gray-600'
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: t('journeyStep5Title'),
      description: t('journeyStep5Desc'),
      timeOld: '30 min',
      timeNew: '5 min',
      color: 'bg-black'
    }
  ];

  return (
    <section ref={ref} className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-4 text-black">
            {t('userJourneyTitle')}
          </h2>
          <p className="text-gray-600">
            {t('userJourneyDescription')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 md:translate-x-0"></div>

          {/* Journey steps */}
          {journeySteps.map((step, index) => (
            <div 
              key={index}
              className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} mb-16 last:mb-0`}
            >
              {/* Timeline dot */}
              <div 
                className={`absolute left-8 md:left-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 ${step.color} transition-all duration-700 ${
                  inView ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              ></div>

              {/* Content */}
              <div 
                className={`pl-20 md:pl-0 md:w-5/12 transition-all duration-700 transform ${
                  inView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                } ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${step.color} text-white`}>
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm line-through text-gray-500">{step.timeOld}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-900" />
                      <span className="text-sm font-bold">{step.timeNew}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Total time saved */}
          <div 
            className={`mt-8 max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center transition-all duration-700 delay-1000 transform ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
          >
            <h3 className="font-bold text-lg mb-2">{t('totalTimeSaved')}</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{t('traditional')}</p>
                <p className="text-xl font-bold text-gray-500 line-through opacity-70">6+ {t('hours')}</p>
              </div>
              
              <div className="text-2xl font-bold">→</div>
              
              <div>
                <p className="text-sm text-gray-500">{t('withPressAi')}</p>
                <p className="text-xl font-bold text-black">~1 {t('hour')}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              {t('timeIsMoney')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

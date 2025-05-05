
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Clock, FileText, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function BeforeAfterSection() {
  const { ref: leftRef, inView: leftInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  
  const { ref: rightRef, inView: rightInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  
  const { t } = useLanguage();
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-4">
            {t('beforeAfterTitle')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('beforeAfterDescription')}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-6 max-w-5xl mx-auto">
          {/* Before Column */}
          <div 
            ref={leftRef}
            className={`flex-1 bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-700 transform ${
              leftInView ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-xl -z-10 opacity-60"></div>
            
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gray-200 text-gray-700 p-2 rounded-full">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">{t('beforeTitle')}</h3>
            </div>
            
            <ul className="space-y-4 mb-6">
              {[
                { icon: Clock, text: t('beforePoint1'), time: '3h' },
                { icon: FileText, text: t('beforePoint2'), time: '2h' },
                { icon: Clock, text: t('beforePoint3'), time: '1h' }
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-700">{item.text}</p>
                    <p className="text-gray-800 text-sm font-semibold">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600">{t('totalTimeSpent')}</p>
                <p className="text-2xl font-bold text-gray-800">6+ {t('hours')}</p>
                <p className="text-xs text-gray-500 mt-1">{t('perArticle')}</p>
              </div>
            </div>
            
            <div className="w-16 h-16 bg-gray-50 rounded-full blur-xl absolute bottom-4 left-8 -z-10 opacity-60"></div>
          </div>
          
          {/* Center Arrow (only visible on larger screens) */}
          <div className="hidden md:flex items-center justify-center">
            <div className="p-3 bg-black rounded-full shadow-lg">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Mobile Arrow (only visible on mobile) */}
          <div className="flex md:hidden items-center justify-center py-2">
            <div className="p-2 bg-black rounded-full shadow-md rotate-90">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* After Column */}
          <div 
            ref={rightRef}
            className={`flex-1 bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-700 transform ${
              rightInView ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-gray-50 rounded-full blur-xl -z-10 opacity-60"></div>
            
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-black text-white p-2 rounded-full">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">{t('afterTitle')}</h3>
            </div>
            
            <ul className="space-y-4 mb-6">
              {[
                { icon: Clock, text: t('afterPoint1'), time: '30min' },
                { icon: FileText, text: t('afterPoint2'), time: '15min' },
                { icon: Clock, text: t('afterPoint3'), time: '15min' }
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-gray-900 text-white flex-shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-700">{item.text}</p>
                    <p className="text-black text-sm font-semibold">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-300">{t('totalTimeSpent')}</p>
                <p className="text-2xl font-bold text-white">1 {t('hour')}</p>
                <p className="text-xs text-gray-400 mt-1">{t('perArticle')}</p>
              </div>
            </div>
            
            <div className="w-16 h-16 bg-gray-50 rounded-full blur-xl absolute bottom-4 right-8 -z-10 opacity-60"></div>
          </div>
        </div>
        
        <div className="mt-10 md:mt-16 text-center">
          <p className="text-2xl md:text-3xl font-playfair font-bold mb-4 bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
            {t('timeRecoveryTitle')}
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('timeRecoveryDescription')}
          </p>
        </div>
      </div>
    </section>
  );
}


import React, { useState } from 'react';
import { PricingCard } from './pricing/PricingCard';
import { useInView } from 'react-intersection-observer';
import { Check, ArrowRight, MessageSquareMore } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';

export function PricingSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  const pricingPlans = [
    {
      title: t('planFree'),
      price: {
        usd: "$0",
        mzn: "0 MZN"
      },
      description: t('freeForever'),
      features: [
        t('freeCredits5Daily'),
        t('uploadAnyFormat'),
        t('basicTranscription'),
        t('articlesUpTo300'),
        t('plainTextExport')
      ],
      isFree: true
    },
    {
      title: t('planPro'),
      price: {
        usd: "$20",
        mzn: "1 200,00 MZN"
      },
      description: t('perMonth'),
      features: [
        t('proCredits30Monthly'),
        t('allBasicFeatures'),
        t('advancedTranscription'),
        t('articlesUpTo1000'),
        t('styleCustomization'),
        t('wordpressExport'),
        t('prioritySupport')
      ],
      popular: true
    },
    {
      title: t('planTeam'),
      price: {
        usd: "$192",
        mzn: "12 000,00 MZN"
      },
      description: t('perMonth'),
      features: [
        t('teamCredits200Monthly'),
        t('allProFeatures'),
        t('noWordLimit'),
        t('multiUserAccess'),
        t('advancedStyleTraining'),
        t('apiIntegration'),
        t('dedicatedManager')
      ]
    },
    {
      title: t('planEnterprise'),
      price: {
        usd: t('custom'),
        mzn: t('custom')
      },
      description: t('tailoredPlan'),
      features: [
        t('customizedSolution'),
        t('unlimitedCredits'),
        t('unlimitedTeamAccess'),
        t('dedicatedTraining'),
        t('customIntegrations'),
        t('vipSupport')
      ],
      isCustom: true
    }
  ];

  return (
    <section ref={ref} className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 border-y border-gray-200 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className={`max-w-3xl mx-auto text-center mb-12 md:mb-16 transition-all duration-1000 transform ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 md:mb-6 text-black">{t('investInJournalism')}</h2>
          <p className="text-base md:text-lg text-gray-600">
            {t('choosePlanDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent opacity-50 -skew-y-6 -z-10"></div>
          
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`transition-all duration-700 transform ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <PricingCard {...plan} />
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <Link to="/dashboard">
            <Button 
              size={isMobile ? "default" : "lg"} 
              className="bg-black text-white hover:bg-gray-900 font-medium rounded-md px-6 flex items-center gap-2 mx-auto transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-12 md:h-14"
            >
              {t('tryItNow')}
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </Button>
          </Link>
        </div>

        <div className={`mt-12 max-w-4xl mx-auto bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm transition-all duration-1000 delay-700 transform ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h3 className="text-xl font-bold mb-6 text-center">{t('faqTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
                {t('whatIsCredit')}
              </h4>
              <p className="text-gray-600 text-xs md:text-sm">{t('creditDesc')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
                {t('doCreditsAccumulate')}
              </h4>
              <p className="text-gray-600 text-xs md:text-sm">{t('creditsAccDesc')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
                {t('howStyleWorks')}
              </h4>
              <p className="text-gray-600 text-xs md:text-sm">{t('styleDesc')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
                {t('canChangePlans')}
              </h4>
              <p className="text-gray-600 text-xs md:text-sm">{t('changePlansDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

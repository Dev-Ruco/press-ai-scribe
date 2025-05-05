
import React, { useRef } from 'react';
import { Header } from '@/components/landing/Header';
import { ModernHeroSection } from '@/components/landing/ModernHeroSection';
import { MediaCompaniesSlider } from '@/components/landing/MediaCompaniesSlider';
import { BeforeAfterSection } from '@/components/landing/BeforeAfterSection';
import { ModernFeaturesSection } from '@/components/landing/ModernFeaturesSection';
import { UserJourneySection } from '@/components/landing/UserJourneySection';
import { DetailedFeatures } from '@/components/landing/DetailedFeatures';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { TeamSection } from '@/components/landing/TeamSection';
import { Footer } from '@/components/landing/Footer';
import { WaitlistForm } from '@/components/landing/WaitlistForm';
import { PricingSection } from '@/components/landing/PricingSection';

export default function LandingPage() {
  // Create refs for each section for potential scroll handling
  const featuresRef = useRef<HTMLElement>(null);
  const waitlistRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-20">
        <ModernHeroSection onExploreClick={() => scrollToSection(featuresRef)} />
        <MediaCompaniesSlider />
        <BeforeAfterSection />
        <ModernFeaturesSection forwardedRef={featuresRef} />
        <UserJourneySection />
        <DetailedFeatures />
        <PricingSection />
        <TestimonialsSection />
        
        {/* Waitlist Section */}
        <section id="waitlist" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-10 md:mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 text-black">
                Seja um dos primeiros a testar
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                Estamos selecionando um grupo limitado de profissionais para testar a versão beta do PRESS AI. Garanta sua vaga!
              </p>
            </div>
            
            <WaitlistForm />
          </div>
        </section>
        
        {/* Team Section */}
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}

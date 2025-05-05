
import React, { useRef } from 'react';
import { Header } from '@/components/landing/Header';
import { ModernHeroSection } from '@/components/landing/ModernHeroSection';
import { MediaCompaniesSlider } from '@/components/landing/MediaCompaniesSlider';
import { BeforeAfterSection } from '@/components/landing/BeforeAfterSection';
import { ModernFeaturesSection } from '@/components/landing/ModernFeaturesSection';
import { UserJourneySection } from '@/components/landing/UserJourneySection';
import { DetailedFeatures } from '@/components/landing/DetailedFeatures';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  // Create refs for each section for potential scroll handling
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-24">
        <ModernHeroSection onExploreClick={() => scrollToSection(featuresRef)} />
        <MediaCompaniesSlider />
        <BeforeAfterSection />
        <ModernFeaturesSection forwardedRef={featuresRef} />
        <UserJourneySection />
        <DetailedFeatures />
        <TestimonialsSection />
        <PricingSection ref={pricingRef} />
      </main>
      <Footer />
    </div>
  );
}

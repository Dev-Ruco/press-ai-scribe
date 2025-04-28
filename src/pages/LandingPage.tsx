
import React from 'react';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { MediaCompaniesSlider } from '@/components/landing/MediaCompaniesSlider';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { DetailedFeatures } from '@/components/landing/DetailedFeatures';
import { PricingSection } from '@/components/landing/PricingSection';
import { TeamSection } from '@/components/landing/TeamSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <MediaCompaniesSlider />
        <FeaturesSection />
        <DetailedFeatures />
        <TestimonialsSection />
        <PricingSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}

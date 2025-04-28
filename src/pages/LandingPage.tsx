
import React from 'react';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
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
        <div className="max-w-5xl mx-auto px-4">
          <HeroSection />
          <FeaturesSection />
          <DetailedFeatures />
          <PricingSection />
          <TeamSection />
          <TestimonialsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}

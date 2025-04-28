
import React from 'react';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { DetailedFeatures } from '@/components/landing/DetailedFeatures';
import { PricingSection } from '@/components/landing/PricingSection';
import { TeamSection } from '@/components/landing/TeamSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4">
          <HeroSection />
          <FeaturesSection />
          <DetailedFeatures />
          <PricingSection />
          <TeamSection />
          <TestimonialsSection />
        </div>
      </main>
    </div>
  );
}

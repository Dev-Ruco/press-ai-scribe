
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
      <main className="flex-1 pt-24">
        <HeroSection />
        <MediaCompaniesSlider />
        <FeaturesSection />
        <DetailedFeatures />
        <div className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <img 
              src="/lovable-uploads/fcaefddb-58c6-4858-be28-f816d438a65b.png" 
              alt="PRESS AI Platform Dashboard" 
              className="w-full max-w-5xl mx-auto rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300" 
            />
          </div>
        </div>
        <TestimonialsSection />
        <PricingSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}

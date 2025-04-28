
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, FileText, Mic, FileCode, BookOpen, Newspaper, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { FeatureItem } from './features/FeatureItem';

export function FeaturesSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const isMobile = useIsMobile();

  return (
    <section ref={ref} className="bg-white py-12 md:py-16 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-8 md:mb-12 text-center">
          <h2 className={`text-2xl md:text-3xl font-playfair font-bold mb-3 md:mb-4 text-black transition-all duration-700 transform ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            From Idea to Final Article in Minutes
          </h2>
          <p className={`text-sm md:text-base text-gray-600 transition-all duration-700 delay-100 transform ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            An intelligent workflow that transforms any material into impeccable journalistic content, 
            maintaining your editorial voice and saving hours of your day.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          <div className={`flex flex-col transition-all duration-700 transform ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`} style={{ transitionDelay: '0ms' }}>
            <FeatureItem 
              icon={<FileText className="w-6 h-6" />} 
              title="Intelligent Ingestion" 
              description="Upload any type of content — audio, video, image, PDF, or text — and let our AI do the heavy lifting of extracting and organizing the material."
            />
            <img 
              src="/lovable-uploads/fcaefddb-58c6-4858-be28-f816d438a65b.png" 
              alt="Content upload interface" 
              className="mt-6 rounded-lg shadow-md border border-gray-200 w-full object-cover h-40 md:h-48"
            />
          </div>
          
          <div className={`flex flex-col transition-all duration-700 transform ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`} style={{ transitionDelay: '200ms' }}>
            <FeatureItem 
              icon={<Mic className="w-6 h-6" />} 
              title="Optimized Processing" 
              description="Automatic transcription via Whisper and state-of-the-art OCR transform any format into structured text ready to be worked on."
            />
            <div className="mt-6 rounded-lg shadow-md border border-gray-200 p-4 bg-gray-50 h-40 md:h-48">
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="h-16 bg-black/10 rounded-md mt-2 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-gray-500" />
                </div>
                <div className="space-y-2 mt-2">
                  <div className="h-2 bg-gray-300 rounded w-full"></div>
                  <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`flex flex-col transition-all duration-700 transform ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`} style={{ transitionDelay: '400ms' }}>
            <FeatureItem 
              icon={<Newspaper className="w-6 h-6" />} 
              title="Editorial Creation" 
              description="Receive suggestions for impactful headlines and a complete article with lead, body, and conclusion, always preserving your publication's unique style."
            />
            <div className="mt-6 rounded-lg shadow-md border border-gray-200 overflow-hidden h-40 md:h-48">
              <div className="bg-gray-900 text-white p-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2">article-generator.ai</span>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                </div>
                <div className="mt-4 h-6 bg-black/80 rounded w-24 flex items-center justify-center">
                  <span className="text-white text-xs">Generate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-8 md:mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-700 delay-500 transform ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6 md:p-8">
              <h3 className="text-xl font-bold mb-4">The Complete Workflow</h3>
              <ul className="space-y-4">
                {[
                  "Upload audio, video, or text files",
                  "AI transcribes and processes content",
                  "Generate multiple headline options",
                  "Create full article with proper structure",
                  "Edit and refine with AI assistance",
                  "Export to your publishing platform"
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-600 text-sm">{step}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link to="/dashboard">
                  <Button 
                    className="bg-black text-white hover:bg-gray-800 font-medium"
                  >
                    Try It Now
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-800">
              <img 
                src="/lovable-uploads/fcaefddb-58c6-4858-be28-f816d438a65b.png" 
                alt="Platform interface" 
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>
        </div>

        <div className={`mt-12 md:mt-16 flex justify-center transition-all duration-700 delay-700 transform ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-5 md:p-8 rounded-xl max-w-2xl shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">A Correspondent's Journey</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  "Before PRESS AI, I spent 3 hours daily just transcribing interviews and organizing notes. 
                  Now I have that time back to investigate and deepen my reporting. 
                  The result? Three times more published articles and higher quality content."
                </p>
                <div className="mt-4 font-medium">— Carlos Mendes, International Correspondent</div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-12 text-center transition-all duration-700 delay-800 transform ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Link to="/dashboard">
            <Button 
              size={isMobile ? "default" : "lg"} 
              className="bg-black text-white hover:bg-gray-900 font-medium rounded-md px-6 flex items-center gap-2 mx-auto transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-12 md:h-14"
            >
              Try It Now
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

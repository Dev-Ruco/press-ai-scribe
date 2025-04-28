
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export function PricingCard({ title, price, description, features, popular }: PricingCardProps) {
  return (
    <div className={`bg-white rounded-xl border ${popular ? 'border-black' : 'border-gray-200'} overflow-hidden transition-all duration-300 hover:shadow-lg relative h-full flex flex-col`}>
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-black text-white text-xs font-bold px-3 py-1 transform rotate-0 origin-bottom-left">
            Mais popular
          </div>
        </div>
      )}
      <div className={`p-8 ${popular ? 'bg-black text-white' : 'bg-gray-50'}`}>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="flex items-end gap-1 mb-1">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-lg opacity-80">créditos</span>
        </div>
        <p className={`text-sm ${popular ? 'text-white/70' : 'text-gray-600'}`}>{description}</p>
      </div>
      <div className="p-8 flex-grow">
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`mt-0.5 ${popular ? 'text-black' : 'text-gray-400'}`}>
                <Check className="w-5 h-5" />
              </div>
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-8 pt-0">
        <Button 
          className={`w-full py-6 ${
            popular 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-gray-100 text-black hover:bg-gray-200'
          }`}
        >
          Escolher {title}
        </Button>
      </div>
    </div>
  );
}

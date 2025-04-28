
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, MessageSquareMore } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  isCustom?: boolean;
}

export function PricingCard({ title, price, description, features, popular, isCustom }: PricingCardProps) {
  return (
    <div className={`bg-white rounded-xl border ${popular ? 'border-black' : 'border-gray-200'} overflow-hidden transition-all duration-300 hover:shadow-lg relative h-full flex flex-col`}>
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-black text-white text-xs font-bold px-3 py-1">
            Mais popular
          </div>
        </div>
      )}
      <div className={`p-6 md:p-8 ${
        popular ? 'bg-black text-white' 
        : isCustom ? 'bg-[#0F172A] bg-gradient-to-br from-gray-900 to-black text-white' 
        : 'bg-gray-50'
      }`}>
        {isCustom ? (
          <>
            <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
            <p className="text-2xl md:text-3xl font-bold mb-2">Personalizado</p>
            <p className="text-base text-gray-300">plano à medida</p>
          </>
        ) : (
          <>
            <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-3xl md:text-4xl font-bold">{price}</span>
              <span className="text-base md:text-lg opacity-80">créditos</span>
            </div>
            <p className={`text-xs md:text-sm ${popular || isCustom ? 'text-gray-300' : 'text-gray-600'}`}>
              {description}
            </p>
          </>
        )}
      </div>
      
      <div className="p-6 md:p-8 flex-grow">
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`mt-1 ${popular || isCustom ? 'text-black' : 'text-gray-400'}`}>
                <Check className="w-4 h-4" />
              </div>
              <span className="text-gray-600 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-6 md:p-8 pt-0">
        {isCustom ? (
          <Link to="/contact">
            <Button 
              className="w-full py-6 bg-black text-white hover:bg-gray-900 group"
            >
              Fale Conosco
              <MessageSquareMore className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
          </Link>
        ) : (
          <Link to="/dashboard">
            <Button 
              className={`w-full py-6 ${
                popular 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              Escolher {title}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

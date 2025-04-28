
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
    <div className={`bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg relative h-full flex flex-col ${
      popular ? 'border-2 border-black shadow-md' : 'border border-gray-200'
    }`}>
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-black text-white text-xs font-bold px-3 py-1">
            Most popular
          </div>
        </div>
      )}
      <div className={`p-6 md:p-8 ${
        popular ? 'bg-gradient-to-br from-gray-900 to-black text-white' 
        : isCustom ? 'bg-gradient-to-br from-indigo-900 to-purple-900 text-white' 
        : 'bg-gray-50'
      }`}>
        {isCustom ? (
          <>
            <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
            <p className="text-2xl md:text-3xl font-bold mb-2">Custom</p>
            <p className="text-base text-gray-300">tailored plan</p>
          </>
        ) : (
          <>
            <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl md:text-4xl font-bold">{price}</span>
            </div>
            <p className={`text-sm md:text-base ${popular || isCustom ? 'text-gray-300' : 'text-gray-500'}`}>
              {description}
            </p>
            <p className={`text-xs mt-1 ${popular || isCustom ? 'text-gray-400' : 'text-gray-500'}`}>
              {!isCustom && "Credits for AI-generated articles"}
            </p>
          </>
        )}
      </div>
      
      <div className="p-6 md:p-8 flex-grow">
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`mt-1 ${popular ? 'text-black' : isCustom ? 'text-purple-600' : 'text-gray-400'}`}>
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
              className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 group transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Contact Us
              <MessageSquareMore className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
          </Link>
        ) : (
          <Link to="/dashboard">
            <Button 
              className={`w-full py-6 ${
                popular 
                  ? 'bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg' 
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              } transition-all duration-300`}
            >
              Choose {title}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

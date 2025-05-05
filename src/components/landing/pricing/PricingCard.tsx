
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, MessageSquareMore } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import ReactCountryFlag from "react-country-flag";

interface PricingCardProps {
  title: string;
  price: {
    usd: string;
    mzn: string;
  };
  description: string;
  features: string[];
  popular?: boolean;
  isCustom?: boolean;
  isFree?: boolean;
}

export function PricingCard({ title, price, description, features, popular, isCustom, isFree }: PricingCardProps) {
  const { t } = useLanguage();

  return (
    <div className={`bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg relative h-full flex flex-col ${
      popular ? 'border-2 border-black shadow-md' : 'border border-gray-200'
    } ${isFree ? 'border-gray-400' : ''}`}>
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-black text-white text-xs font-bold px-3 py-1">
            {t('mostPopular')}
          </div>
        </div>
      )}
      {isFree && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white text-xs font-bold px-3 py-1">
            {t('free')}
          </div>
        </div>
      )}
      <div className={`p-6 md:p-8 ${
        popular ? 'bg-gradient-to-br from-gray-900 to-black text-white' 
        : isCustom ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
        : isFree ? 'bg-gradient-to-br from-gray-500 to-gray-600 text-white'
        : 'bg-gray-50'
      }`}>
        {isCustom ? (
          <>
            <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ReactCountryFlag countryCode="US" svg className="text-xl" />
                <p className="text-2xl md:text-3xl font-bold">{price.usd}</p>
              </div>
              <div className="flex items-center gap-2">
                <ReactCountryFlag countryCode="MZ" svg className="text-xl" />
                <p className="text-2xl md:text-3xl font-bold">{price.mzn}</p>
              </div>
            </div>
            <p className="text-base text-gray-300 mt-2">{description}</p>
          </>
        ) : (
          <>
            <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex items-center gap-2">
                <ReactCountryFlag countryCode="US" svg className="text-xl" />
                <span className="text-3xl md:text-4xl font-bold">{price.usd}</span>
              </div>
              <div className="flex items-center gap-2">
                <ReactCountryFlag countryCode="MZ" svg className="text-xl" />
                <span className="text-3xl md:text-4xl font-bold">{price.mzn}</span>
              </div>
            </div>
            <p className={`text-sm md:text-base ${popular || isCustom || isFree ? 'text-gray-300' : 'text-gray-500'}`}>
              {description}
            </p>
          </>
        )}
      </div>
      
      <div className="p-6 md:p-8 flex-grow">
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`mt-1 ${
                popular ? 'text-black' 
                : isCustom ? 'text-gray-600' 
                : isFree ? 'text-gray-600'
                : 'text-gray-400'
              }`}>
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
              className="w-full py-6 bg-gradient-to-r from-gray-700 to-black text-white hover:from-gray-800 hover:to-black group transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {t('contactUs')}
              <MessageSquareMore className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
          </Link>
        ) : isFree ? (
          <Link to="/dashboard">
            <Button 
              className="w-full py-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {t('startFree')} {title}
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
              {t('chooseThis')} {title}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}


import React from 'react';
import { Link } from 'react-router-dom';
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
    <div className={`bg-gray-50 p-8 rounded-lg border ${popular ? 'border-gray-800' : 'border-gray-200'} relative`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-bold">
          Mais Popular
        </div>
      )}
      <h3 className="text-2xl font-bold mb-4 text-black">{title}</h3>
      <div className="text-4xl font-bold mb-2 text-black">{price}</div>
      <div className="text-gray-600 mb-6">{description}</div>
      <ul className="space-y-2 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-600">
            <Check className="h-5 w-5 text-black" />
            {feature}
          </li>
        ))}
      </ul>
      <Link to="/auth?mode=signup">
        <Button className="w-full bg-black text-white hover:bg-gray-900">
          {price === "10" ? "Começar Grátis" : "Escolher Plano"}
        </Button>
      </Link>
    </div>
  );
}

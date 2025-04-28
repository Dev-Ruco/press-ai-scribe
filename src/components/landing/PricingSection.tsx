
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export function PricingSection() {
  return (
    <section className="bg-white py-20 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-playfair font-bold text-center mb-16 text-black">Planos de Crédito</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            title="Gratuito"
            price="10"
            description="créditos mensais grátis"
            features={[
              "Funcionalidades básicas",
              "Artigos até 500 palavras",
              "Exportação em texto"
            ]}
          />
          <PricingCard
            title="Pessoal"
            price="50"
            description="créditos por 19 USD/mês"
            features={[
              "Todas as funcionalidades",
              "Artigos até 2000 palavras",
              "Exportação para WordPress",
              "Treino de estilo básico"
            ]}
            popular
          />
          <PricingCard
            title="Colaborativo"
            price="200"
            description="créditos por 49 USD/mês"
            features={[
              "Todas as funcionalidades",
              "Artigos sem limite de palavras",
              "Múltiplos utilizadores (até 5)",
              "Treino avançado de estilo"
            ]}
          />
        </div>
      </div>
    </section>
  );
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

function PricingCard({ title, price, description, features, popular }: PricingCardProps) {
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

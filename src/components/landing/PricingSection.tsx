
import React from 'react';
import { PricingCard } from './pricing/PricingCard';

export function PricingSection() {
  const pricingPlans = [
    {
      title: "Gratuito",
      price: "10",
      description: "créditos mensais grátis",
      features: [
        "Funcionalidades básicas",
        "Artigos até 500 palavras",
        "Exportação em texto"
      ]
    },
    {
      title: "Pessoal",
      price: "50",
      description: "créditos por 19 USD/mês",
      features: [
        "Todas as funcionalidades",
        "Artigos até 2000 palavras",
        "Exportação para WordPress",
        "Treino de estilo básico"
      ],
      popular: true
    },
    {
      title: "Colaborativo",
      price: "200",
      description: "créditos por 49 USD/mês",
      features: [
        "Todas as funcionalidades",
        "Artigos sem limite de palavras",
        "Múltiplos utilizadores (até 5)",
        "Treino avançado de estilo"
      ]
    }
  ];

  return (
    <section className="bg-white py-20 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-playfair font-bold text-center mb-16 text-black">Planos de Crédito</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

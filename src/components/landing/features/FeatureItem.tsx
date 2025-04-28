
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-black transition-all duration-300 group-hover:-translate-y-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}


import { ReactNode } from 'react';

interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mb-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <h3 className="text-base md:text-lg font-bold mb-2 text-black transition-all duration-300 group-hover:-translate-y-1">{title}</h3>
      <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

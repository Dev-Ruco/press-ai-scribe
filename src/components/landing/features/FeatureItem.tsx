
import { ReactNode } from 'react';

interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center flex-shrink-0 mb-4 shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <h3 className="text-base md:text-lg font-bold mb-2 text-black transition-all duration-300 group-hover:-translate-y-1">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

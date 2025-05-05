
import { ReactNode } from 'react';

interface ModernFeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  isVisible: boolean;
  delay?: number;
}

export function ModernFeatureCard({ 
  icon, 
  title, 
  description, 
  isVisible,
  delay = 0 
}: ModernFeatureCardProps) {
  return (
    <div 
      className={`bg-white rounded-xl p-8 border border-gray-100 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      } hover:-translate-y-2 group`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center mb-5 shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      
      <h3 className="text-lg md:text-xl font-semibold mb-3 text-black transition-all duration-300 group-hover:translate-x-1">
        {title}
      </h3>
      
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
      
      <div className="w-0 h-1 bg-gradient-to-r from-gray-900 to-black mt-4 transition-all duration-300 group-hover:w-1/3"></div>
    </div>
  );
}


import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';

export function Header() {
  return (
    <header className="container mx-auto p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Logo className="h-10 w-auto" />
        <span className="font-playfair text-xl font-bold text-black">PRESS AI</span>
      </div>
      <div className="flex gap-4">
        <Link to="/auth" className="text-gray-600 hover:text-black transition-colors">
          Login
        </Link>
        <Link to="/auth?mode=signup" className="text-gray-600 hover:text-black transition-colors">
          Regista-te
        </Link>
      </div>
    </header>
  );
}

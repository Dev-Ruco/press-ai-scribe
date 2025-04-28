
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';

export function Header() {
  return (
    <header className="container mx-auto p-4 flex items-center justify-between animate-fade-in">
      <Link to="/" className="hover:opacity-80 transition-opacity">
        <Logo />
      </Link>
      <div className="flex gap-4">
        <Link 
          to="/auth" 
          className="text-black hover:text-gray-800 transition-all transform hover:-translate-y-0.5"
        >
          Login
        </Link>
        <Link 
          to="/auth?mode=signup" 
          className="text-black hover:text-gray-800 transition-all transform hover:-translate-y-0.5"
        >
          Regista-te
        </Link>
      </div>
    </header>
  );
}

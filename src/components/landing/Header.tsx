
import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="container mx-auto p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-playfair text-xl font-bold text-black">PRESS AI</span>
      </div>
      <div className="flex gap-4">
        <Link to="/auth" className="text-black hover:text-gray-800 transition-colors">
          Login
        </Link>
        <Link to="/auth?mode=signup" className="text-black hover:text-gray-800 transition-colors">
          Regista-te
        </Link>
      </div>
    </header>
  );
}

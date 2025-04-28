
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-auto" />
              <span className="font-playfair text-lg font-bold">PRESS AI</span>
            </div>
            <p className="text-sm text-gray-600">
              Transformando o jornalismo com inteligência artificial.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Produto</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-sm text-gray-600 hover:text-black">Dashboard</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-600 hover:text-black">Preços</Link></li>
              <li><Link to="/features" className="text-sm text-gray-600 hover:text-black">Funcionalidades</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-black">Sobre</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-black">Contacto</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-600 hover:text-black">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-black">Privacidade</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-600 hover:text-black">Termos</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} PRESS AI. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

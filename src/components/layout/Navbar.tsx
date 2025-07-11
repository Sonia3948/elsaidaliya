import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/55d7e20f-5825-427e-b3c2-7d1ad83d0df5.png" 
                alt="El Saidaliya Logo" 
                className="h-8 w-auto mr-3" 
              />
              <span className="text-xl font-bold text-pharmacy-dark">El Saidaliya</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="text-gray-700 hover:text-pharmacy-dark px-3 py-2 text-sm font-medium">
                Accueil
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-pharmacy-dark px-3 py-2 text-sm font-medium">
                À propos
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-pharmacy-dark px-3 py-2 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex md:space-x-4">
              <Link
                to="/login"
                className="text-pharmacy-dark hover:text-pharmacy-accent px-3 py-2 text-sm font-medium"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-pharmacy-dark text-white hover:bg-pharmacy-accent px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                S'inscrire
              </Link>
              <Link
                to="/admin/login"
                className="text-xs text-gray-500 hover:text-pharmacy-dark px-2 py-1 border border-gray-300 rounded text-sm font-medium transition-colors"
              >
                Admin
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pharmacy-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pharmacy-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pharmacy-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-pharmacy-dark hover:text-pharmacy-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-base font-medium bg-pharmacy-dark text-white hover:bg-pharmacy-accent rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                S'inscrire
              </Link>
              <Link
                to="/admin/login"
                className="block px-3 py-2 text-sm font-medium text-gray-500 hover:text-pharmacy-dark border border-gray-300 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Accès Administrateur
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

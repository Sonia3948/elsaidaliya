
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Info, Phone, LogIn, UserPlus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return <nav className="shadow-md w-full rounded-md bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Elsaidaliya Logo" className="h-10 w-10" />
              <span className="ml-2 font-bold text-pharmacy-accent text-2xl">Elsaidaliya</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-pharmacy hover:bg-pharmacy-light transition-colors">
              <Home size={20} className="mr-1" />
              Accueil
            </Link>
            <Link to="/about" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-pharmacy hover:bg-pharmacy-light transition-colors">
              <Info size={20} className="mr-1" />
              À propos
            </Link>
            <Link to="/contact" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-pharmacy hover:bg-pharmacy-light transition-colors">
              <Phone size={20} className="mr-1" />
              Contact
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2 flex items-center">
                  <LogIn size={18} className="mr-1" /> Se connecter <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/login" className="w-full flex items-center">
                    <LogIn size={16} className="mr-2" />
                    Se connecter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/register" className="w-full flex items-center">
                    <UserPlus size={16} className="mr-2" />
                    S'inscrire
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pharmacy hover:bg-pharmacy-light">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pharmacy hover:bg-pharmacy-light" onClick={() => setIsMenuOpen(false)}>
              <Home size={20} className="mr-2" />
              Accueil
            </Link>
            <Link to="/about" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pharmacy hover:bg-pharmacy-light" onClick={() => setIsMenuOpen(false)}>
              <Info size={20} className="mr-2" />
              À propos
            </Link>
            <Link to="/contact" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pharmacy hover:bg-pharmacy-light" onClick={() => setIsMenuOpen(false)}>
              <Phone size={20} className="mr-2" />
              Contact
            </Link>
            <Link to="/login" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-pharmacy hover:bg-pharmacy-light" onClick={() => setIsMenuOpen(false)}>
              <LogIn size={20} className="mr-2" />
              Se connecter
            </Link>
            <Link to="/register" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-pharmacy hover:bg-pharmacy-light" onClick={() => setIsMenuOpen(false)}>
              <UserPlus size={20} className="mr-2" />
              S'inscrire
            </Link>
          </div>
        </div>}
    </nav>;
};
export default Navbar;

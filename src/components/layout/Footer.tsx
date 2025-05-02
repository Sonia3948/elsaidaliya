
import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone } from "lucide-react";

const Footer = () => {
  return <footer className="bg-white shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-pharmacy-dark">Elsaidaliya</h3>
            <p className="text-gray-600">
              Votre plateforme pour l'approvisionnement pharmaceutique en Algérie.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-pharmacy-dark">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-pharmacy-accent">Accueil</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-pharmacy-accent">À propos</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-pharmacy-accent">Contact</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-pharmacy-accent">Politique de confidentialité</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-pharmacy-dark">Réseaux Sociaux</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pharmacy-accent">
                <Facebook size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pharmacy-accent">
                <Instagram size={24} />
              </a>
              <a href="https://wa.me/+213553720952" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pharmacy-accent">
                <Phone size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-medical-dark flex items-center justify-center">
              <span className="text-white font-bold text-sm">ES</span>
            </div>
            <span className="ml-2 text-lg font-bold text-gray-700">Elsaidaliya</span>
          </div>
          <p className="mt-4 md:mt-0 text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Elsaidaliya tout droit reservé.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;

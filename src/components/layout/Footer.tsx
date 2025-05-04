import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-white px-4 py-8 border-t">
      <div className="container mx-auto">
        <div className="md:flex md:justify-between mb-8">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/416db742-a6a0-481e-8bf5-91b997537eae.png" alt="Elsaidaliya Logo" className="h-8 mr-3" />
            </Link>
            <p className="mt-2 text-sm text-gray-600 max-w-sm">
              La première plateforme qui connecte pharmaciens et fournisseurs en Algérie
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:grid-cols-3">
            <div>
              
              <ul className="text-gray-600 space-y-2">
                <li>
                  
                </li>
                <li>
                  
                </li>
                <li>
                  
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Suivez-nous</h2>
              <ul className="text-gray-600 space-y-2">
                <li>
                  <a href="https://www.facebook.com/" className="hover:underline" target="_blank" rel="noopener noreferrer">Facebook</a>
                </li>
                <li>
                  <a href="https://www.instagram.com/" className="hover:underline" target="_blank" rel="noopener noreferrer">Instagram</a>
                </li>
                
              </ul>
            </div>
            
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Support</h2>
              <ul className="text-gray-600 space-y-2">
                <li>
                  <a href="tel:+213553720952" className="hover:underline">+213 553 720 952</a>
                </li>
                <li>
                  <a href="mailto:contact@elsaidaliya.com" className="hover:underline">contact@elsaidaliya.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <hr className="my-6 border-gray-200 sm:mx-auto" />
        
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © {new Date().getFullYear()} <Link to="/" className="hover:underline">Elsaidaliya™</Link>. Tous droits réservés.
          </span>
          <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            <Link to="/legal?tab=terms" className="text-sm text-gray-500 hover:underline">Conditions d'Utilisation</Link>
            <Link to="/legal?tab=privacy" className="text-sm text-gray-500 hover:underline">Politique de Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
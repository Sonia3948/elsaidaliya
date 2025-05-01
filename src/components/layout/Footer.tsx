import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-white shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">À propos</h3>
            <div className="mt-4 space-y-2">
              <Link to="/about" className="text-base text-gray-600 hover:text-medical-dark block">
                Notre mission
              </Link>
              <Link to="/about" className="text-base text-gray-600 hover:text-medical-dark block">
                Comment ça marche
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Support</h3>
            <div className="mt-4 space-y-2">
              <Link to="/contact" className="text-base text-gray-600 hover:text-medical-dark block">
                Contact
              </Link>
              <Link to="/about" className="text-base text-gray-600 hover:text-medical-dark block">
                FAQ
              </Link>
            </div>
          </div>
          
          <div>
            
            <div className="mt-4 space-y-2">
              <Link to="/about" className="text-base text-gray-600 hover:text-medical-dark block">
                Conditions d'utilisation
              </Link>
              <Link to="/about" className="text-base text-gray-600 hover:text-medical-dark block">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-medical-dark flex items-center justify-center">
              <span className="text-white font-bold text-sm">MS</span>
            </div>
            <span className="ml-2 text-lg font-bold text-gray-700">Med-Supply-Link</span>
          </div>
          <p className="mt-4 md:mt-0 text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Med-Supply-Link. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;
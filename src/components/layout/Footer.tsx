import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-white shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        
        <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-medical-dark flex items-center justify-center">
              <span className="text-white font-bold text-sm">MS</span>
            </div>
            <span className="ml-2 text-lg font-bold text-gray-700">Elsaidaliya</span>
          </div>
          <p className="mt-4 md:mt-0 text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Med-Supply-Link. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;
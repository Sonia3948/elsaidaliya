import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import OffersSection from "@/components/offers/OffersSection";
const Index = () => {
  return <Layout>
      <section className="bg-gradient-to-b from-pharmacy-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Approvisionnement Pharmaceutique en un Clic!</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connectez-vous avec des fournisseurs de médicaments fiables et trouvez rapidement les produits dont vous avez besoin.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-pharmacy hover:bg-pharmacy-dark">
                  S'inscrire maintenant <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça fonctionne</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="h-12 w-12 bg-pharmacy-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-pharmacy-dark font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Inscription</h3>
              <p className="text-gray-600">
                Inscrivez-vous en tant que pharmacien ou fournisseur et complétez votre profil.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="h-12 w-12 bg-pharmacy-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-pharmacy-dark font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connexion</h3>
              <p className="text-gray-600">
                Les fournisseurs publient leurs listings et offres, les pharmaciens recherchent les produits.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="h-12 w-12 bg-pharmacy-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-pharmacy-dark font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Approvisionnement</h3>
              <p className="text-gray-600">
                Trouvez facilement les produits et contactez les fournisseurs pour passer commande.
              </p>
            </div>
          </div>
        </div>
      </section>

      <OffersSection />

      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pour qui est cette plateforme ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Elsaidaliya est conçu pour faciliter les connexions entre les acteurs du secteur pharmaceutique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-pharmacy-dark">Pour les pharmaciens</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-pharmacy-light flex items-center justify-center mt-1">
                    <span className="text-pharmacy-dark font-bold text-xs">✓</span>
                  </div>
                  <p className="ml-2 text-gray-600">Recherchez des médicaments rapidement</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-pharmacy-light flex items-center justify-center mt-1">
                    <span className="text-pharmacy-dark font-bold text-xs">✓</span>
                  </div>
                  <p className="ml-2 text-gray-600">Trouvez des fournisseurs fiables</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-pharmacy-light flex items-center justify-center mt-1">
                    <span className="text-pharmacy-dark font-bold text-xs">✓</span>
                  </div>
                  <p className="ml-2 text-gray-600">Accédez aux offres spéciales</p>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-pharmacy-dark">Pour les fournisseurs</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-pharmacy-light flex items-center justify-center mt-1">
                    <span className="text-pharmacy-dark font-bold text-xs">✓</span>
                  </div>
                  <p className="ml-2 text-gray-600">Partagez votre catalogue de produits</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-pharmacy-light flex items-center justify-center mt-1">
                    <span className="text-pharmacy-dark font-bold text-xs">✓</span>
                  </div>
                  <p className="ml-2 text-gray-600">Publiez vos offres spéciales</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-pharmacy-light flex items-center justify-center mt-1">
                    <span className="text-pharmacy-dark font-bold text-xs">✓</span>
                  </div>
                  <p className="ml-2 text-gray-600">Élargissez votre réseau de clients</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-pharmacy-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à rejoindre Elsaidaliya ?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Inscrivez-vous aujourd'hui et commencez à optimiser votre chaîne d'approvisionnement pharmaceutique.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-pharmacy-dark hover:bg-gray-100">
              S'inscrire maintenant
            </Button>
          </Link>
        </div>
      </section>
    </Layout>;
};
export default Index;
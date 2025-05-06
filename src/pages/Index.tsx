
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import UsersCarousel from "@/components/home/UsersCarousel";
import OffersSection from "@/components/offers/OffersSection";
import { Pill, Package, Store } from "lucide-react";

const Index = () => {
  return <Layout>
      <section className="bg-gradient-to-b from-pharmacy-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-gray-900 mb-6 font-bold md:text-5xl py-0 mx-0 my-0 px-0 text-4xl">Approvisionnement Pharmaceutique en un Clic!</h1>
            <p className="md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-medium text-lg">Le trait d'union entre pharmacien et fournisseur. </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="rounded-xl bg-pharmacy-dark hover:bg-pharmacy text-white font-medium">
                  S'inscrire maintenant
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-xl bg-pharmacy-accent text-white hover:bg-pharmacy my-0">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Users Carousel - replacing "Comment ça fonctionne" section */}
      <UsersCarousel />

      {/* Updated OffersSection will be rendered here */}
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
              <div className="flex items-center mb-4">
                <div className="bg-pharmacy-light rounded-full p-2 mr-4">
                  <Pill size={24} className="text-pharmacy-dark" />
                </div>
                <h3 className="text-xl font-semibold text-pharmacy-dark">Pour les pharmaciens</h3>
              </div>
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
              <div className="flex items-center mb-4">
                <div className="bg-pharmacy-light rounded-full p-2 mr-4">
                  <Store size={24} className="text-pharmacy-dark" />
                </div>
                <h3 className="text-xl font-semibold text-pharmacy-dark">Pour les fournisseurs</h3>
              </div>
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

      <section className="py-12 text-white md:py-20 bg-pharmacy-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à rejoindre Elsaidaliya ?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Inscrivez-vous aujourd'hui et commencez à optimiser votre chaîne d'approvisionnement pharmaceutique.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-pharmacy-dark hover:bg-gray-100 rounded-xl">
                S'inscrire maintenant
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 rounded-xl">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>;
};

export default Index;

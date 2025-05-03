
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import UsersCarousel from "@/components/home/UsersCarousel";
import OffersSection from "@/components/offers/OffersSection";

// Featured suppliers (gold subscription)
const featuredSuppliers = [{
  id: 1,
  name: "MediStock Algérie",
  wilaya: "Alger",
  description: "Distributeur leader de produits pharmaceutiques en Algérie",
  imageUrl: "/placeholder.svg"
}, {
  id: 2,
  name: "PharmaSupply",
  wilaya: "Oran",
  description: "Plus de 2000 références de médicaments disponibles",
  imageUrl: "/placeholder.svg"
}, {
  id: 3,
  name: "AlgéPharm",
  wilaya: "Constantine",
  description: "Spécialiste en produits dermatologiques et cosmétiques",
  imageUrl: "/placeholder.svg"
}];

const Index = () => {
  return (
    <Layout>
      <section className="bg-gradient-to-b from-pharmacy-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl text-gray-900 mb-6 font-bold md:text-6xl mx-0 py-[10px] my-0 px-[5px]">Approvisionnement Pharmaceutique en un Clic!</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connectez-vous avec des fournisseurs de médicaments fiables et trouvez rapidement les produits dont vous avez besoin.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="rounded-xl bg-pharmacy-accent my-0">
                  S'inscrire maintenant
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-xl bg-pharmacy-accent my-0">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Users Carousel - replacing "Comment ça fonctionne" section */}
      <UsersCarousel />

      {/* Featured Suppliers Section (replacing "Nos Utilisateurs") */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fournisseurs Vedette</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez nos fournisseurs premium qui proposent une large gamme de produits pharmaceutiques.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {featuredSuppliers.map(supplier => (
              <div key={supplier.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 transition-transform transform hover:scale-105">
                <div className="h-48 bg-gray-100 relative">
                  <img src={supplier.imageUrl} alt={supplier.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2">{supplier.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">Wilaya: {supplier.wilaya}</p>
                  <p className="text-gray-600 mb-4">{supplier.description}</p>
                  <Link to={`/supplier/${supplier.id}`}>
                    <Button className="w-full bg-pharmacy-accent hover:bg-pharmacy-dark">
                      Voir le profil
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <section className="py-12 text-white md:py-[25px] bg-pharmacy-accent">
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
    </Layout>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Store, MapPin, Award } from "lucide-react";
type FeaturedSupplier = {
  id: string;
  name: string;
  image: string;
  wilaya: string;
  description: string;
};

// Dummy featured suppliers with gold subscription
const dummyFeaturedSuppliers = [{
  id: "1",
  name: "MediStock Algérie",
  image: "/placeholder.svg",
  wilaya: "Alger",
  description: "Distributeur leader de produits pharmaceutiques en Algérie"
}, {
  id: "2",
  name: "PharmaSupply",
  image: "/placeholder.svg",
  wilaya: "Oran",
  description: "Plus de 2000 références de médicaments disponibles"
}, {
  id: "3",
  name: "AlgéPharm",
  image: "/placeholder.svg",
  wilaya: "Constantine",
  description: "Spécialiste en produits dermatologiques et cosmétiques"
}, {
  id: "4",
  name: "MedPlus Solutions",
  image: "/placeholder.svg",
  wilaya: "Annaba",
  description: "Fournisseur de matériel médical et produits pharmaceutiques"
}, {
  id: "5",
  name: "Pharma Nord",
  image: "/placeholder.svg",
  wilaya: "Tlemcen",
  description: "Expert en compléments alimentaires et vitamines"
}];
const UsersCarousel = () => {
  const [featuredSuppliers, setFeaturedSuppliers] = useState<FeaturedSupplier[]>(dummyFeaturedSuppliers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    toast
  } = useToast();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % featuredSuppliers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [featuredSuppliers]);

  // This would normally fetch from a backend API
  useEffect(() => {
    // In a real app, we'd fetch featured suppliers with gold subscription from the backend
    // For now, we'll use our dummy data
    const fetchFeaturedSuppliers = async () => {
      try {
        // Simulating API call
        // In a real implementation, we would call:
        // const response = await fetch('http://localhost:8080/api/users?subscription=or');
        // const data = await response.json();
        // setFeaturedSuppliers(data.users);

        setFeaturedSuppliers(dummyFeaturedSuppliers);
      } catch (error) {
        console.error("Error fetching featured suppliers:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les fournisseurs vedettes",
          variant: "destructive"
        });
      }
    };
    fetchFeaturedSuppliers();
  }, [toast]);
  const visibleSuppliers = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const idx = (currentIndex + i) % featuredSuppliers.length;
      result.push(featuredSuppliers[idx]);
    }
    return result;
  };

  // Return the actual JSX component
  return <section className="py-12 bg-pharmacy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-pharmacy-dark">Nos Fournisseurs Vedettes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos fournisseurs premium avec abonnement Or qui proposent une large gamme de produits pharmaceutiques.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleSuppliers().map(supplier => <Card key={supplier.id} className="overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="h-3 bg-pharmacy-accent"></div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-pharmacy-light flex items-center justify-center">
                      <Store size={24} className="text-pharmacy-dark" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-lg text-gray-900">{supplier.name}</h3>
                      
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mt-2 line-clamp-2">{supplier.description}</p>
                
                <div className="flex items-center text-gray-600 mt-3">
                  <MapPin size={16} className="mr-1 text-pharmacy-accent" />
                  <span className="text-sm">{supplier.wilaya}</span>
                </div>
              </CardContent>
            </Card>)}
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
          {featuredSuppliers.map((_, idx) => <button key={idx} onClick={() => setCurrentIndex(idx)} className={`w-3 h-3 rounded-full ${currentIndex === idx || (currentIndex + 1) % featuredSuppliers.length === idx || (currentIndex + 2) % featuredSuppliers.length === idx ? 'bg-pharmacy-accent' : 'bg-gray-300'}`} aria-label={`Slide ${idx + 1}`} />)}
        </div>
      </div>
    </section>;
};
export default UsersCarousel;
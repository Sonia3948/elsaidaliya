
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Store, MapPin } from "lucide-react";
import { userService } from "@/services/user";

type FeaturedSupplier = {
  id: string;
  businessName: string;
  image: string;
  wilaya: string;
  description: string;
};

const UsersCarousel = () => {
  const [featuredSuppliers, setFeaturedSuppliers] = useState<FeaturedSupplier[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % featuredSuppliers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [featuredSuppliers]);

  useEffect(() => {
    const fetchFeaturedSuppliers = async () => {
      try {
        console.log("Fetching featured suppliers...");
        const response = await userService.getFeaturedSuppliers();
        console.log("Featured suppliers response:", response);

        if (response && response.suppliers && Array.isArray(response.suppliers)) {
          const mappedSuppliers = response.suppliers.map((supplier: any) => ({
            id: supplier.id,
            businessName: supplier.businessName || supplier.name || "Fournisseur",
            image: supplier.image || "",
            wilaya: supplier.wilaya || "",
            description: supplier.description || "Fournisseur de produits pharmaceutiques"
          }));
          setFeaturedSuppliers(mappedSuppliers);
        } else {
          console.log("No suppliers found or invalid response format");
          setFeaturedSuppliers([]);
        }
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
      if (featuredSuppliers[idx]) {
        result.push(featuredSuppliers[idx]);
      }
    }
    return result;
  };

  if (featuredSuppliers.length === 0) {
    return (
      <section className="py-12 bg-pharmacy-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-pharmacy-dark">Nos Fournisseurs Vedettes</h2>
            <p className="text-gray-600">Aucun fournisseur vedette disponible pour le moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-pharmacy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-pharmacy-dark">Nos Fournisseurs Vedettes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos fournisseurs premium qui proposent une large gamme de produits pharmaceutiques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleSuppliers().map(supplier => (
            <Card key={supplier.id} className="overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="h-3 bg-pharmacy-accent"></div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-pharmacy-light flex items-center justify-center">
                      <Store size={24} className="text-pharmacy-dark" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-lg text-gray-900">{supplier.businessName}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mt-2 line-clamp-2">{supplier.description}</p>

                <div className="flex items-center text-gray-600 mt-3">
                  <MapPin size={16} className="mr-1 text-pharmacy-accent" />
                  <span className="text-sm">{supplier.wilaya}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {featuredSuppliers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === idx ||
                (currentIndex + 1) % featuredSuppliers.length === idx ||
                (currentIndex + 2) % featuredSuppliers.length === idx
                  ? 'bg-pharmacy-accent'
                  : 'bg-gray-300'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsersCarousel;

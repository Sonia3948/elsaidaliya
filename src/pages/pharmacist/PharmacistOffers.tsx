
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { offerService } from "@/services/offer";

interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  supplier: {
    id: string;
    name: string;
  };
  expiresAt: string;
  createdAt: string;
}

const PharmacistOffers = () => {
  const { data: offers, isLoading, isError } = useQuery({
    queryKey: ["recentOffers"],
    queryFn: async () => {
      const response = await offerService.getAllOffers({ sort: "createdAt", limit: "20" });
      return response.offers || [];
    },
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Offres Disponibles</h1>
          <p className="text-gray-600 mt-1">
            Découvrez les dernières offres publiées par les fournisseurs
          </p>
        </div>

        {isLoading ? (
          <p className="text-center my-8">Chargement des offres...</p>
        ) : isError ? (
          <p className="text-center my-8 text-red-500">Erreur lors du chargement des offres</p>
        ) : offers && offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer: Offer) => (
              <Card key={offer.id} className="overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-100">
                  {offer.imageUrl ? (
                    <img 
                      src={offer.imageUrl} 
                      alt={offer.title} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <p className="text-gray-500">Pas d'image</p>
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-grow">
                  <h3 className="font-semibold text-lg">{offer.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{offer.description}</p>
                  
                  <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <span>Par: {offer.supplier ? offer.supplier.name : "Fournisseur"}</span>
                    <span>{formatDate(offer.createdAt)}</span>
                  </div>
                  
                  {offer.expiresAt && (
                    <div className="mt-2 text-xs text-red-500">
                      Expire le: {new Intl.DateTimeFormat('fr-FR').format(new Date(offer.expiresAt))}
                    </div>
                  )}
                </CardContent>
                <div className="p-4 pt-0 border-t mt-auto">
                  <div className="flex space-x-2">
                    <Button 
                      variant="default" 
                      className="w-full" 
                      asChild
                    >
                      <Link to={`/pharmacist/offers/${offer.id}`}>
                        Voir les détails
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      asChild
                    >
                      <Link to={`/pharmacist/suppliers/${offer.supplier?.id}`}>
                        Voir fournisseur
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center my-8">
            <p>Aucune offre disponible pour le moment.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PharmacistOffers;

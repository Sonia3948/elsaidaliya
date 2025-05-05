
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, Image, Search, Calendar, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample offer data structure
interface Offer {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  supplier: {
    id: number;
    name: string;
    wilaya: string;
  };
  category: string;
  expiresAt: string;
  published: string;
}

const PharmacistOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch offers
    setTimeout(() => {
      const mockOffers = [
        { 
          id: 1, 
          title: "Promotion sur les antibiotiques", 
          description: "20% de réduction sur toute la gamme d'antibiotiques. Disponible pour les pharmacies avec un historique d'achat minimum de 100,000 DA.",
          imageUrl: "/placeholder.svg", 
          supplier: { 
            id: 1, 
            name: "MediStock Algérie",
            wilaya: "Alger", 
          },
          category: "Promotions",
          expiresAt: "2025-06-30",
          published: "2025-05-01",
        },
        { 
          id: 2, 
          title: "Offre spéciale antihistaminiques", 
          description: "Achetez 10 boîtes, obtenez-en 2 gratuites. Valable sur toute la gamme d'antihistaminiques de notre catalogue.",
          imageUrl: "/placeholder.svg", 
          supplier: { 
            id: 2, 
            name: "PharmaSupply",
            wilaya: "Oran", 
          },
          category: "Promotions",
          expiresAt: "2025-06-15",
          published: "2025-05-02",
        },
        { 
          id: 3, 
          title: "Nouveaux produits dermatologiques", 
          description: "Découvrez notre nouvelle gamme de produits dermatologiques importés d'Europe. Testés cliniquement et approuvés par les dermatologues.",
          imageUrl: "/placeholder.svg", 
          supplier: { 
            id: 3, 
            name: "MedProvision",
            wilaya: "Constantine", 
          },
          category: "Nouveautés",
          expiresAt: "2025-08-01",
          published: "2025-05-03",
        },
        { 
          id: 4, 
          title: "Gamme complète de vitamines", 
          description: "Notre nouvelle gamme de vitamines et compléments alimentaires est maintenant disponible avec des prix spéciaux pour les commandes en gros.",
          imageUrl: "/placeholder.svg", 
          supplier: { 
            id: 4, 
            name: "HealthDistributors",
            wilaya: "Annaba", 
          },
          category: "Nouveautés",
          expiresAt: "2025-07-20",
          published: "2025-04-28",
        },
        { 
          id: 5, 
          title: "Matériel médical en promotion", 
          description: "Réduction de 15% sur tout notre matériel médical. Stocks limités, commandez rapidement!",
          imageUrl: "/placeholder.svg", 
          supplier: { 
            id: 5, 
            name: "PharmaMed Algérie",
            wilaya: "Sétif", 
          },
          category: "Matériel médical",
          expiresAt: "2025-06-10",
          published: "2025-05-05",
        },
      ];
      
      setOffers(mockOffers);
      setFilteredOffers(mockOffers);
      setLoading(false);
    }, 1000);
  }, []);

  // Get unique categories from offers
  const categories = [...new Set(offers.map(offer => offer.category))];

  // Filter offers based on search and category
  const handleSearch = () => {
    let filtered = offers;
    
    if (searchQuery) {
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(offer => offer.category === categoryFilter);
    }
    
    setFilteredOffers(filtered);
  };

  // Reset filters
  const handleReset = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setFilteredOffers(offers);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Offres Disponibles</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtres de recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="offerSearch" className="block text-sm font-medium mb-1">Rechercher des offres</label>
                <Input
                  id="offerSearch"
                  placeholder="Titre, description, fournisseur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-full"
                />
              </div>
              
              <div>
                <label htmlFor="categorySelect" className="block text-sm font-medium mb-1">Catégorie</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="categorySelect" className="w-full">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end space-x-2">
                <Button onClick={handleSearch} className="flex-1">
                  <Search size={18} className="mr-2" /> Rechercher
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des offres...</p>
          </div>
        ) : filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-100">
                  <img src={offer.imageUrl} alt={offer.title} className="h-full w-full object-cover" />
                </div>
                <CardContent className="p-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{offer.title}</h3>
                    <Badge variant="outline">{offer.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{offer.description}</p>
                  
                  <div className="mt-3 text-xs text-gray-500 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>Expire le {formatDate(offer.expiresAt)}</span>
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <Building size={14} className="mr-1 text-gray-500" />
                    <Link to={`/pharmacist/suppliers/${offer.supplier.id}`} className="text-xs text-pharmacy-accent hover:underline">
                      {offer.supplier.name} • {offer.supplier.wilaya}
                    </Link>
                  </div>
                </CardContent>
                <div className="p-4 pt-0 border-t mt-auto">
                  <Button className="w-full" asChild>
                    <Link to={`/pharmacist/offers/${offer.id}`}>
                      Voir les détails
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune offre trouvée correspondant à vos critères.</p>
            <Button variant="outline" onClick={handleReset} className="mt-4">
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PharmacistOffers;

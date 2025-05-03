
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Search, User, ExternalLink, Star, Building } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { algeriasWilayas } from "@/data/wilayas";

// Mock data for suppliers and their listings
const mockSuppliers = [
  { 
    id: 1, 
    name: "MediStock", 
    wilaya: "Alger", 
    rating: 4.8,
    listingUrl: "/sample.pdf",
    subscription: "gold",
    isFavorite: true,
    medicines: ["Paracétamol", "Ibuprofène", "Amoxicilline", "Doliprane", "Aspirine", "Ventoline"]
  },
  { 
    id: 2, 
    name: "PharmaPro", 
    wilaya: "Oran", 
    rating: 4.5,
    listingUrl: "/sample.pdf",
    subscription: "silver",
    isFavorite: false,
    medicines: ["Paracétamol", "Ibuprofène", "Aspirine", "Augmentin", "Xanax", "Doliprane"]
  },
  { 
    id: 3, 
    name: "MedPlus", 
    wilaya: "Constantine", 
    rating: 4.2,
    listingUrl: "/sample.pdf",
    subscription: "bronze",
    isFavorite: true,
    medicines: ["Paracétamol", "Augmentin", "Doliprane", "Ventoline", "Lexomil"]
  },
  { 
    id: 4, 
    name: "AlgeriaMed", 
    wilaya: "Annaba", 
    rating: 4.7,
    listingUrl: "/sample.pdf",
    subscription: "gold",
    isFavorite: false,
    medicines: ["Ibuprofène", "Amoxicilline", "Doliprane", "Ventoline", "Aspirine"]
  },
  { 
    id: 5, 
    name: "MedSupply", 
    wilaya: "Sétif", 
    rating: 4.4,
    listingUrl: "/sample.pdf",
    subscription: "silver",
    isFavorite: true,
    medicines: ["Paracétamol", "Ibuprofène", "Ventoline", "Lexomil", "Xanax"]
  }
];

const PharmacistMedicines = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  useEffect(() => {
    // Extract search query from URL if present
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('query');
    if (queryParam) {
      setSearchQuery(queryParam);
      handleSearch(queryParam);
    }
  }, [location]);

  const handleSearch = (query: string = searchQuery) => {
    if (!query?.trim()) return;
    
    // Filter suppliers that have the medicine in their list
    let results = mockSuppliers.filter(supplier => 
      supplier.medicines.some(medicine => 
        medicine.toLowerCase().includes(query.toLowerCase())
      )
    );
    
    // Apply wilaya filter
    if (selectedWilaya !== "all") {
      results = results.filter(supplier => supplier.wilaya === selectedWilaya);
    }
    
    // Apply favorites filter
    if (showFavoritesOnly) {
      results = results.filter(supplier => supplier.isFavorite);
    }

    // Sort by subscription level: gold > silver > bronze
    results.sort((a, b) => {
      const subscriptionOrder: Record<string, number> = {
        gold: 3,
        silver: 2,
        bronze: 1
      };
      return subscriptionOrder[b.subscription] - subscriptionOrder[a.subscription];
    });
    
    setSearchResults(results);
    setHasSearched(true);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  const toggleFavorite = (supplierId: number) => {
    // Update the mockSuppliers list
    const updatedSuppliers = mockSuppliers.map(supplier => 
      supplier.id === supplierId ? { ...supplier, isFavorite: !supplier.isFavorite } : supplier
    );
    
    // Update search results if they exist
    if (hasSearched) {
      const updatedResults = searchResults.map(supplier => 
        supplier.id === supplierId ? { ...supplier, isFavorite: !supplier.isFavorite } : supplier
      );
      setSearchResults(updatedResults);
    }
  };

  const getSubscriptionBadgeClass = (subscription: string) => {
    switch (subscription) {
      case "gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "silver":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "bronze":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Recherche de Médicaments</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Rechercher un médicament
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="medicineSearch" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du médicament
                </label>
                <div className="flex">
                  <Input
                    id="medicineSearch"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Paracétamol, Ibuprofène..."
                    className="rounded-r-none"
                    onKeyDown={handleKeyDown}
                  />
                  <Button 
                    onClick={() => handleSearch()}
                    className="rounded-l-none bg-medical hover:bg-medical-dark"
                  >
                    <Search className="h-4 w-4 mr-2" /> Rechercher
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Entrez le nom exact ou partiel du médicament que vous recherchez
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                <div>
                  <label htmlFor="wilayaFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrer par wilaya
                  </label>
                  <Select 
                    value={selectedWilaya} 
                    onValueChange={(value) => {
                      setSelectedWilaya(value);
                      if (hasSearched) handleSearch();
                    }}
                  >
                    <SelectTrigger id="wilayaFilter" className="w-full">
                      <SelectValue placeholder="Filtrer par wilaya" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les wilayas</SelectItem>
                      {algeriasWilayas.map(wilaya => (
                        <SelectItem key={wilaya.code} value={wilaya.name}>{wilaya.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant={showFavoritesOnly ? "default" : "outline"}
                    onClick={() => {
                      setShowFavoritesOnly(!showFavoritesOnly);
                      if (hasSearched) handleSearch();
                    }}
                    className={showFavoritesOnly ? "bg-medical hover:bg-medical-dark" : ""}
                  >
                    <Star className={`mr-2 h-4 w-4 ${showFavoritesOnly ? "fill-white" : ""}`} />
                    {showFavoritesOnly ? "Affichage des favoris" : "Afficher les favoris uniquement"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {hasSearched && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Résultats de recherche pour "{searchQuery}"
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.length > 0 ? (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">
                    {searchResults.length} fournisseur(s) trouvé(s) avec ce médicament.
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                          <th scope="col" className="px-6 py-3">Fournisseur</th>
                          <th scope="col" className="px-6 py-3">Wilaya</th>
                          <th scope="col" className="px-6 py-3">Évaluation</th>
                          <th scope="col" className="px-6 py-3">Favoris</th>
                          <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map(supplier => (
                          <tr key={supplier.id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">
                              <Link 
                                to={`/pharmacist/suppliers/${supplier.id}`}
                                className="text-medical hover:text-medical-dark flex items-center"
                              >
                                <User size={16} className="mr-2" /> 
                                <span className="mr-2">{supplier.name}</span>
                                <span className={`text-xs px-2 py-1 rounded-full border ${getSubscriptionBadgeClass(supplier.subscription)}`}>
                                  {supplier.subscription === "gold" ? "🥇" : 
                                   supplier.subscription === "silver" ? "🥈" : "🥉"}
                                </span>
                              </Link>
                            </td>
                            <td className="px-6 py-4">{supplier.wilaya}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <span className="font-medium">{supplier.rating}</span>
                                <div className="ml-1 flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < Math.floor(supplier.rating) 
                                          ? "text-yellow-400" 
                                          : "text-gray-300"
                                      }`}
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                      />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Button 
                                onClick={() => toggleFavorite(supplier.id)}
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                              >
                                <Star 
                                  size={20} 
                                  className={supplier.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} 
                                />
                              </Button>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <Button 
                                  asChild
                                  variant="default" 
                                  size="sm" 
                                  className="bg-medical hover:bg-medical-dark"
                                >
                                  <a href={supplier.listingUrl} target="_blank" rel="noopener noreferrer">
                                    <FileText size={14} className="mr-1" /> PDF
                                  </a>
                                </Button>
                                <Button 
                                  asChild
                                  variant="outline" 
                                  size="sm"
                                >
                                  <Link to={`/pharmacist/suppliers/${supplier.id}`}>
                                    <Building size={14} className="mr-1" /> Profil
                                  </Link>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun résultat trouvé</h3>
                  <p className="text-gray-500">
                    Aucun fournisseur ne semble proposer "{searchQuery}" dans son listing.<br />
                    Essayez avec un autre nom ou vérifiez l'orthographe.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PharmacistMedicines;

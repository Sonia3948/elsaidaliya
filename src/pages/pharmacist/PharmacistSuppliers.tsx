
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Star, Building, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { algeriasWilayas } from "@/data/wilayas";
import SupplierRating from "@/components/pharmacist/SupplierRating";
import { userService } from "@/services/user";

interface Supplier {
  id: string;
  name: string;
  wilaya: string;
  rating: number;
  isFavorite: boolean;
}

const PharmacistSuppliers = () => {
  const [nameQuery, setNameQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [activeTab, setActiveTab] = useState("name");
  const [searchResults, setSearchResults] = useState<Supplier[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Get top suppliers
  const { data: topSuppliers, isLoading } = useQuery({
    queryKey: ["topSuppliers"],
    queryFn: async () => {
      const response = await userService.getAllUsers({ 
        role: "fournisseur", 
        sort: "rating", 
        limit: "10" 
      });
      
      // Get favorites from local storage
      const storedFavorites = localStorage.getItem("favoriteSuppliers");
      const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
      setFavorites(favoriteIds);
      
      // Mark favorites
      const suppliers = response.users || [];
      return suppliers.map((supplier: any) => ({
        ...supplier,
        isFavorite: favoriteIds.includes(supplier.id)
      }));
    },
  });

  // Handle search by name
  const handleNameSearch = async () => {
    if (!nameQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await userService.getAllUsers({ 
        role: "fournisseur", 
        name: nameQuery 
      });
      
      if (response && response.users) {
        // Mark favorites
        const results = response.users.map((supplier: any) => ({
          ...supplier,
          isFavorite: favorites.includes(supplier.id)
        }));
        
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search by wilaya
  const handleWilayaSearch = async () => {
    if (!selectedWilaya) return;
    
    setIsSearching(true);
    try {
      const response = await userService.getAllUsers({ 
        role: "fournisseur", 
        wilaya: selectedWilaya 
      });
      
      if (response && response.users) {
        // Mark favorites
        const results = response.users.map((supplier: any) => ({
          ...supplier,
          isFavorite: favorites.includes(supplier.id)
        }));
        
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = (supplierId: string) => {
    let newFavorites = [...favorites];
    
    if (newFavorites.includes(supplierId)) {
      newFavorites = newFavorites.filter(id => id !== supplierId);
    } else {
      newFavorites.push(supplierId);
    }
    
    setFavorites(newFavorites);
    localStorage.setItem("favoriteSuppliers", JSON.stringify(newFavorites));
    
    // Update search results
    setSearchResults(searchResults.map(supplier => 
      supplier.id === supplierId 
        ? { ...supplier, isFavorite: !supplier.isFavorite } 
        : supplier
    ));
  };

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Rechercher Fournisseurs</h1>
          <p className="text-gray-600 mt-1">
            Trouvez des fournisseurs par nom ou wilaya
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="name">Par Nom</TabsTrigger>
            <TabsTrigger value="wilaya">Par Wilaya</TabsTrigger>
            <TabsTrigger value="popular">Populaires</TabsTrigger>
          </TabsList>
          
          <TabsContent value="name" className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Nom du fournisseur..."
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleNameSearch} 
                  disabled={isSearching || !nameQuery.trim()}
                  className="md:w-auto w-full"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
              </div>
              
              {isSearching && <p className="text-center my-4">Recherche en cours...</p>}
              
              {searchResults.length > 0 && activeTab === "name" && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Résultats de recherche</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((supplier) => (
                      <SupplierCard 
                        key={supplier.id} 
                        supplier={supplier} 
                        toggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {nameQuery && !isSearching && searchResults.length === 0 && activeTab === "name" && (
                <p className="text-center my-4">Aucun résultat trouvé pour "{nameQuery}"</p>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="wilaya" className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionner une wilaya" />
                  </SelectTrigger>
                  <SelectContent>
                    {algeriasWilayas.map((wilaya) => (
                      <SelectItem key={wilaya.code} value={wilaya.name}>
                        {wilaya.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleWilayaSearch} 
                  disabled={isSearching || !selectedWilaya}
                  className="md:w-auto w-full"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Filtrer
                </Button>
              </div>
              
              {isSearching && <p className="text-center my-4">Recherche en cours...</p>}
              
              {searchResults.length > 0 && activeTab === "wilaya" && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Fournisseurs dans {selectedWilaya}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((supplier) => (
                      <SupplierCard 
                        key={supplier.id} 
                        supplier={supplier} 
                        toggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {selectedWilaya && !isSearching && searchResults.length === 0 && activeTab === "wilaya" && (
                <p className="text-center my-4">Aucun fournisseur trouvé dans {selectedWilaya}</p>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="popular" className="space-y-4">
            {isLoading ? (
              <p className="text-center my-4">Chargement des fournisseurs populaires...</p>
            ) : topSuppliers && topSuppliers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topSuppliers.map((supplier: any) => (
                  <SupplierCard 
                    key={supplier.id} 
                    supplier={supplier} 
                    toggleFavorite={() => toggleFavorite(supplier.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center my-4">Aucun fournisseur disponible</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

interface SupplierCardProps {
  supplier: Supplier;
  toggleFavorite: (id: string) => void;
}

const SupplierCard = ({ supplier, toggleFavorite }: SupplierCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{supplier.name?.charAt(0) || 'F'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between">
              <h4 className="font-semibold">{supplier.name}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(supplier.id)}
                className={supplier.isFavorite ? "text-yellow-500" : "text-gray-400"}
              >
                <Star
                  size={16}
                  className={supplier.isFavorite ? "fill-yellow-500" : ""}
                />
              </Button>
            </div>
            {supplier.wilaya && (
              <p className="text-sm text-gray-600">
                <MapPin className="inline h-4 w-4 mr-1" />
                {supplier.wilaya}
              </p>
            )}
            <div className="my-2">
              <SupplierRating 
                supplierId={parseInt(supplier.id)} 
                initialRating={supplier.rating} 
              />
            </div>
            <div className="mt-3">
              <Button size="sm" asChild>
                <Link to={`/pharmacist/suppliers/${supplier.id}`}>
                  <Building className="mr-1 h-4 w-4" /> Voir profil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PharmacistSuppliers;

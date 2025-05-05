
import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { wilayas } from "@/data/wilayas";

interface Supplier {
  id: number;
  name: string;
  wilaya: string;
  rating: number;
  isFavorite: boolean;
  productCount: number;
}

const WilayaSearch = () => {
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Simuler une recherche de fournisseurs
  const searchSuppliers = () => {
    setLoading(true);
    setHasSearched(true);
    
    // Simuler une requête API avec un délai
    setTimeout(() => {
      const mockSuppliers: Supplier[] = [
        { id: 1, name: "MediStock Algérie", wilaya: "Alger", rating: 4.8, isFavorite: true, productCount: 245 },
        { id: 2, name: "PharmaSupply", wilaya: "Oran", rating: 4.6, isFavorite: false, productCount: 198 },
        { id: 3, name: "MedProvision", wilaya: "Constantine", rating: 4.5, isFavorite: true, productCount: 176 },
        { id: 4, name: "HealthDistributors", wilaya: "Annaba", rating: 4.3, isFavorite: false, productCount: 154 },
        { id: 5, name: "PharmaPlus", wilaya: "Oran", rating: 4.2, isFavorite: false, productCount: 132 },
        { id: 6, name: "MedPharma", wilaya: "Alger", rating: 4.7, isFavorite: true, productCount: 210 },
      ];
      
      // Filtrer par wilaya si sélectionnée
      let filteredSuppliers = selectedWilaya 
        ? mockSuppliers.filter(s => s.wilaya === selectedWilaya)
        : mockSuppliers;
      
      // Filtrer par terme de recherche si saisi
      if (searchTerm.trim() !== "") {
        filteredSuppliers = filteredSuppliers.filter(s => 
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setSuppliers(filteredSuppliers);
      setLoading(false);
    }, 800);
  };

  // Toggle favoris
  const toggleFavorite = (id: number) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === id ? { ...supplier, isFavorite: !supplier.isFavorite } : supplier
    ));
  };

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Recherche par Wilaya</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rechercher des fournisseurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Wilaya</label>
                <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une wilaya" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les wilayas</SelectItem>
                    {wilayas.map((wilaya) => (
                      <SelectItem key={wilaya.code} value={wilaya.nom}>
                        {wilaya.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nom du fournisseur</label>
                <Input 
                  placeholder="Rechercher un fournisseur..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={searchSuppliers} 
                  className="bg-pharmacy-accent hover:bg-pharmacy-dark w-full md:w-auto"
                  disabled={loading}
                >
                  {loading ? "Recherche en cours..." : "Rechercher"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Résultats de la recherche</h2>
          
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">Recherche en cours...</p>
            </div>
          ) : hasSearched && suppliers.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">Aucun fournisseur trouvé. Veuillez essayer avec d'autres critères.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map((supplier) => (
                <Card key={supplier.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{supplier.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{supplier.name}</h3>
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
                        
                        <p className="text-sm text-gray-600">Wilaya: {supplier.wilaya}</p>
                        <p className="text-sm text-gray-600">{supplier.productCount} produits</p>
                        
                        <div className="flex items-center mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(supplier.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                            />
                          ))}
                          <span className="ml-1 text-sm">{supplier.rating}</span>
                        </div>
                        
                        <div className="mt-3">
                          <Button size="sm" asChild>
                            <Link to={`/pharmacist/suppliers/${supplier.id}`} className="flex items-center">
                              <Building size={16} className="mr-1" /> Voir profil
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WilayaSearch;


import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, Search, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { algeriasWilayas } from "@/data/wilayas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SupplierRating from "@/components/pharmacist/SupplierRating";

// Sample supplier data structure
interface Supplier {
  id: number;
  name: string;
  wilaya: string;
  rating: number;
  productCount: number;
  specialties: string[];
  isFavorite: boolean;
}

const PharmacistSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [nameQuery, setNameQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch suppliers
    setTimeout(() => {
      const mockSuppliers = [
        { id: 1, name: "MediStock Algérie", wilaya: "Alger", rating: 4.8, productCount: 245, specialties: ["Génériques", "Antibiotiques"], isFavorite: true },
        { id: 2, name: "PharmaSupply", wilaya: "Oran", rating: 4.6, productCount: 198, specialties: ["Médicaments importés", "Matériel médical"], isFavorite: false },
        { id: 3, name: "MedProvision", wilaya: "Constantine", rating: 4.5, productCount: 176, specialties: ["Cardiologie", "Diabète"], isFavorite: true },
        { id: 4, name: "HealthDistributors", wilaya: "Annaba", rating: 4.3, productCount: 154, specialties: ["Génériques", "Dermatologie"], isFavorite: false },
        { id: 5, name: "PharmaMed Algérie", wilaya: "Sétif", rating: 4.7, productCount: 210, specialties: ["Respiratoire", "Antibiotiques"], isFavorite: false },
        { id: 6, name: "AlgéMed Distribution", wilaya: "Batna", rating: 4.2, productCount: 122, specialties: ["Pédiatrie", "Vitamines"], isFavorite: false },
        { id: 7, name: "TéleMed Pharma", wilaya: "Tlemcen", rating: 4.4, productCount: 167, specialties: ["Orthopédie", "Génériques"], isFavorite: false },
      ];
      
      setSuppliers(mockSuppliers);
      setFilteredSuppliers(mockSuppliers);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle supplier rating change
  const handleRatingChange = (supplierId: number, newRating: number) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === supplierId ? { ...supplier, rating: newRating } : supplier
    ));
    
    setFilteredSuppliers(filteredSuppliers.map(supplier => 
      supplier.id === supplierId ? { ...supplier, rating: newRating } : supplier
    ));
  };

  // Filter suppliers based on search criteria
  const handleSearch = () => {
    let filtered = suppliers;
    
    // Filter by name if search query is provided
    if (nameQuery) {
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(nameQuery.toLowerCase())
      );
    }
    
    // Filter by selected wilaya if any
    if (selectedWilaya) {
      filtered = filtered.filter(supplier => supplier.wilaya === selectedWilaya);
    }
    
    setFilteredSuppliers(filtered);
  };

  // Reset filters
  const handleReset = () => {
    setNameQuery("");
    setSelectedWilaya("");
    setFilteredSuppliers(suppliers);
  };

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    const updatedSuppliers = suppliers.map(supplier =>
      supplier.id === id ? { ...supplier, isFavorite: !supplier.isFavorite } : supplier
    );
    
    setSuppliers(updatedSuppliers);
    
    // Also update filtered list
    setFilteredSuppliers(filteredSuppliers.map(supplier =>
      supplier.id === id ? { ...supplier, isFavorite: !supplier.isFavorite } : supplier
    ));
  };

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Recherche de Fournisseurs</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtres de recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="nameSearch" className="block text-sm font-medium mb-1">Nom du fournisseur</label>
                <div className="flex items-center">
                  <Input
                    id="nameSearch"
                    placeholder="Rechercher par nom..."
                    value={nameQuery}
                    onChange={(e) => setNameQuery(e.target.value)}
                    className="max-w-full"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="wilayaSelect" className="block text-sm font-medium mb-1">Wilaya</label>
                <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
                  <SelectTrigger id="wilayaSelect" className="w-full">
                    <SelectValue placeholder="Sélectionner une wilaya" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les wilayas</SelectItem>
                    {algeriasWilayas.map((wilaya) => (
                      <SelectItem key={wilaya.code} value={wilaya.name}>
                        {wilaya.name}
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
            <p className="text-gray-500">Chargement des fournisseurs...</p>
          </div>
        ) : filteredSuppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{supplier.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-lg">{supplier.name}</h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin size={14} className="mr-1" />
                        <span>{supplier.wilaya}</span>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">{supplier.productCount} produits</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {supplier.specialties.map((specialty, i) => (
                            <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3">
                        <SupplierRating 
                          supplierId={supplier.id} 
                          initialRating={supplier.rating}
                          onRatingChange={(rating) => handleRatingChange(supplier.id, rating)}
                        />
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <Button variant="outline" size="sm" asChild>
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun fournisseur trouvé correspondant à vos critères.</p>
            <Button variant="outline" onClick={handleReset} className="mt-4">
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PharmacistSuppliers;

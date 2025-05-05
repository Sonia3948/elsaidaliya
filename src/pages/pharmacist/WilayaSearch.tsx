
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { algeriasWilayas } from "@/data/wilayas";

const WilayaSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter wilayas based on search term
  const filteredWilayas = algeriasWilayas.filter(wilaya =>
    wilaya.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWilayaSelect = async (wilayaCode: string, wilayaName: string) => {
    setSelectedWilaya(wilayaName);
    setLoading(true);
    
    // Simulate API call to fetch suppliers by wilaya
    setTimeout(() => {
      // Mock data - in a real app, we would fetch from backend
      const mockSuppliers = [
        { id: 1, name: "MediStock Algérie", rating: 4.8, productCount: 245 },
        { id: 2, name: "PharmaSupply", rating: 4.6, productCount: 198 },
        { id: 3, name: "AlgéPharm", rating: 4.5, productCount: 176 },
      ];
      
      setSuppliers(mockSuppliers);
      setLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Recherche par Wilaya</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sélectionnez une wilaya</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Rechercher une wilaya..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              
              <div className="h-80 overflow-y-auto border rounded-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
                  {filteredWilayas.map((wilaya) => (
                    <Button
                      key={wilaya.code}
                      variant="outline"
                      className={`justify-start ${selectedWilaya === wilaya.name ? 'bg-pharmacy-light text-pharmacy-dark' : ''}`}
                      onClick={() => handleWilayaSelect(wilaya.code, wilaya.name)}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {wilaya.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedWilaya ? `Fournisseurs à ${selectedWilaya}` : "Fournisseurs"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-10">Chargement des fournisseurs...</p>
              ) : !selectedWilaya ? (
                <div className="text-center py-10 text-gray-500">
                  <MapPin className="mx-auto h-12 w-12 opacity-30 mb-2" />
                  <p>Veuillez sélectionner une wilaya pour voir les fournisseurs disponibles</p>
                </div>
              ) : suppliers.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p>Aucun fournisseur trouvé dans cette wilaya</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suppliers.map((supplier) => (
                    <div key={supplier.id} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{supplier.name}</h3>
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span>{supplier.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{supplier.productCount} produits</p>
                      <Button size="sm" className="mt-2" asChild>
                        <Link to={`/pharmacist/suppliers/${supplier.id}`}>
                          <Building className="mr-1 h-4 w-4" /> Voir le profil
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WilayaSearch;

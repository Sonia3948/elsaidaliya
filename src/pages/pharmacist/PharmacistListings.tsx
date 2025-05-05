
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, Building } from "lucide-react";
import { listingService } from "@/services/listing";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Medicine {
  id: string;
  name: string;
  supplier: {
    id: string;
    name: string;
    pdfUrl: string;
  };
}

interface Listing {
  id: string;
  title: string;
  supplierName: string;
  supplierID: string;
  medicationCount: number;
  pdfUrl: string;
}

const PharmacistListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [listingResults, setListingResults] = useState<Listing[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get popular listings
  const { data: popularListings, isLoading } = useQuery({
    queryKey: ["popularListings"],
    queryFn: async () => {
      const response = await listingService.getAllListings({ sort: "medicationCount", limit: "10" });
      return response.listings || [];
    },
  });

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await listingService.searchMedicines(searchQuery);
      
      if (response && response.listings) {
        // Transform data for display
        const medicines: Medicine[] = [];
        const listings: Listing[] = [];
        
        response.listings.forEach((listing: any) => {
          const matchingMeds = listing.medications.filter((med: any) => 
            med.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          matchingMeds.forEach((med: any) => {
            medicines.push({
              id: med.id,
              name: med.name,
              supplier: {
                id: listing.supplierID,
                name: listing.supplierName || "Fournisseur",
                pdfUrl: listing.pdfUrl,
              }
            });
          });
          
          listings.push({
            id: listing.id,
            title: listing.title,
            supplierName: listing.supplierName || "Fournisseur",
            supplierID: listing.supplierID,
            medicationCount: listing.medications.length,
            pdfUrl: listing.pdfUrl
          });
        });
        
        setSearchResults(medicines);
        setListingResults(listings);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Recherche de Médicaments</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Recherche</TabsTrigger>
            <TabsTrigger value="popular">Listings Populaires</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rechercher un médicament</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="Nom du médicament..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                  />
                  <Button 
                    onClick={handleSearch} 
                    disabled={isSearching || !searchQuery.trim()}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Rechercher
                  </Button>
                </div>
                
                {isSearching && <p className="text-center my-4">Recherche en cours...</p>}
                
                {searchResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Médicaments trouvés</h3>
                    <div className="space-y-4">
                      {searchResults.map((medicine, index) => (
                        <Card key={`${medicine.id}-${index}`} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{medicine.name}</h4>
                              <p className="text-sm text-gray-600">
                                Fournisseur: {medicine.supplier.name}
                              </p>
                            </div>
                            <div className="space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <a 
                                  href={medicine.supplier.pdfUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="flex items-center"
                                >
                                  <FileText size={16} className="mr-1" /> Catalogue
                                </a>
                              </Button>
                              <Button size="sm" asChild>
                                <Link 
                                  to={`/pharmacist/suppliers/${medicine.supplier.id}`}
                                  className="flex items-center"
                                >
                                  <Building size={16} className="mr-1" /> Profil
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {listingResults.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Listings contenant ce médicament</h3>
                    <div className="space-y-4">
                      {listingResults.map((listing) => (
                        <Card key={listing.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{listing.title}</h4>
                              <p className="text-sm text-gray-600">
                                Fournisseur: {listing.supplierName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {listing.medicationCount} médicaments dans ce catalogue
                              </p>
                            </div>
                            <div className="space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <a 
                                  href={listing.pdfUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="flex items-center"
                                >
                                  <FileText size={16} className="mr-1" /> Voir le PDF
                                </a>
                              </Button>
                              <Button size="sm" asChild>
                                <Link 
                                  to={`/pharmacist/suppliers/${listing.supplierID}`} 
                                  className="flex items-center"
                                >
                                  <Building size={16} className="mr-1" /> Voir fournisseur
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {searchQuery && !isSearching && searchResults.length === 0 && (
                  <p className="text-center my-4">Aucun résultat trouvé pour "{searchQuery}"</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="popular" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Listings Populaires</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center my-4">Chargement des listings populaires...</p>
                ) : popularListings && popularListings.length > 0 ? (
                  <div className="space-y-4">
                    {popularListings.map((listing: any) => (
                      <Card key={listing.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{listing.title}</h4>
                            <p className="text-sm text-gray-600">
                              {listing.medications ? listing.medications.length : 0} médicaments
                            </p>
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <a 
                                href={listing.pdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center"
                              >
                                <FileText size={16} className="mr-1" /> PDF
                              </a>
                            </Button>
                            <Button size="sm" asChild>
                              <Link 
                                to={`/pharmacist/suppliers/${listing.supplierID}`} 
                                className="flex items-center"
                              >
                                <Building size={16} className="mr-1" /> Fournisseur
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center my-4">Aucun listing disponible</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PharmacistListings;

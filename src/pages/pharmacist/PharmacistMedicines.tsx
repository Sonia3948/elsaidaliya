
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { FileText, Building, Search, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types for our data
interface Medicine {
  id: number;
  name: string;
  dosage: string;
  form: string;
  description: string;
  supplier: {
    id: number;
    name: string;
    rating: number;
    wilaya: string;
  };
}

interface Listing {
  id: number;
  title: string;
  pdfUrl: string;
  supplierName: string;
  supplierID: number;
  medicationCount: number;
}

const PharmacistMedicines = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [listingResults, setListingResults] = useState<Listing[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  // Handle medicine search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez saisir un terme de recherche.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Simulate API call to search for medicines
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock search results
      if (searchQuery.toLowerCase().includes("para") || 
          searchQuery.toLowerCase().includes("dol") || 
          searchQuery.toLowerCase().includes("ibu")) {
        const mockMedicineResults = [
          { 
            id: 1, 
            name: "Paracétamol 500mg", 
            dosage: "500mg", 
            form: "Comprimé",
            description: "Analgésique et antipyrétique",
            supplier: { 
              id: 1, 
              name: "MediStock Algérie",
              rating: 4.8,
              wilaya: "Alger" 
            } 
          },
          { 
            id: 2, 
            name: "Paracétamol 1g", 
            dosage: "1g", 
            form: "Comprimé",
            description: "Analgésique et antipyrétique à forte dose",
            supplier: { 
              id: 2, 
              name: "PharmaSupply",
              rating: 4.6,
              wilaya: "Oran" 
            } 
          },
          { 
            id: 3, 
            name: "Paracétamol sirop",
            dosage: "125mg/5ml", 
            form: "Sirop",
            description: "Pour usage pédiatrique",
            supplier: { 
              id: 3, 
              name: "MedProvision", 
              rating: 4.5,
              wilaya: "Constantine"
            } 
          },
          { 
            id: 4, 
            name: "Ibuprofène 400mg", 
            dosage: "400mg", 
            form: "Comprimé",
            description: "Anti-inflammatoire non stéroïdien",
            supplier: { 
              id: 1, 
              name: "MediStock Algérie", 
              rating: 4.8,
              wilaya: "Alger"
            } 
          },
        ];
        
        const mockListingResults = [
          { 
            id: 1, 
            title: "Catalogue Analgésiques 2025", 
            pdfUrl: "/sample.pdf", 
            supplierName: "MediStock Algérie", 
            supplierID: 1, 
            medicationCount: 120 
          },
          { 
            id: 2, 
            title: "Produits Génériques - Printemps 2025", 
            pdfUrl: "/sample.pdf", 
            supplierName: "PharmaSupply", 
            supplierID: 2, 
            medicationCount: 85 
          },
          { 
            id: 3, 
            title: "Catalogue Pédiatrique", 
            pdfUrl: "/sample.pdf", 
            supplierName: "MedProvision", 
            supplierID: 3, 
            medicationCount: 67 
          },
        ];
        
        setSearchResults(mockMedicineResults);
        setListingResults(mockListingResults);
      } else {
        // No results
        setSearchResults([]);
        setListingResults([]);
      }
    } catch (error) {
      toast({
        title: "Erreur de recherche",
        description: "Une erreur est survenue lors de la recherche. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Recherche de Médicaments</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Nom du médicament, DCI, classe thérapeutique..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Recherche en cours..." : (
                  <>
                    <Search size={18} className="mr-2" /> Rechercher
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {hasSearched && (
          <>
            {searchResults.length > 0 ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Médicaments trouvés</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {searchResults.map((medicine) => (
                      <Card key={medicine.id} className="p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div>
                            <h4 className="font-semibold">{medicine.name}</h4>
                            <div className="text-sm text-gray-600 mt-1">
                              <p>{medicine.dosage} | {medicine.form}</p>
                              <p>{medicine.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <Link to={`/pharmacist/suppliers/${medicine.supplier.id}`} className="flex items-center justify-center">
                                <Building size={16} className="mr-2" /> 
                                {medicine.supplier.name}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Catalogues contenant ce médicament</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {listingResults.map((listing) => (
                      <Card key={listing.id} className="p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div>
                            <h4 className="font-semibold">{listing.title}</h4>
                            <p className="text-sm text-gray-600">
                              Fournisseur: {listing.supplierName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {listing.medicationCount} médicaments dans ce catalogue
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button variant="outline" size="sm" asChild>
                              <a href={listing.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                <FileText size={16} className="mr-2" /> Voir le catalogue
                              </a>
                            </Button>
                            <Button size="sm" asChild>
                              <Link to={`/pharmacist/suppliers/${listing.supplierID}`} className="flex items-center justify-center">
                                <Building size={16} className="mr-2" /> Voir fournisseur
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 mb-4">Aucun résultat trouvé pour "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 mb-6">
                    Essayez avec d'autres termes ou consultez directement nos fournisseurs
                  </p>
                  <Link to="/pharmacist/suppliers">
                    <Button variant="outline">
                      Consulter tous les fournisseurs <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PharmacistMedicines;

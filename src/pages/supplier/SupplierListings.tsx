
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FilePlus, FileText, Trash2, FileUp, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SupplierListings = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Mock data for existing listings
  const [listings, setListings] = useState([
    { id: 1, name: "Listing_Janvier_2025.pdf", date: "2025-01-15", views: 45 },
    { id: 2, name: "Listing_Février_2025.pdf", date: "2025-02-15", views: 32 },
    { id: 3, name: "Listing_Mars_2025.pdf", date: "2025-03-15", views: 28 }
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast({
          title: "Format non supporté",
          description: "Veuillez télécharger un fichier PDF.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // In a real app, this would upload the file to a server
      const newListing = {
        id: listings.length + 1,
        name: selectedFile.name,
        date: new Date().toISOString().split("T")[0],
        views: 0
      };
      
      setListings([newListing, ...listings]);
      setSelectedFile(null);
      
      toast({
        title: "Listing téléchargé avec succès",
        description: "Votre nouveau listing est maintenant disponible pour les pharmaciens.",
      });
    } else {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner un fichier PDF à télécharger.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: number) => {
    setListings(listings.filter(listing => listing.id !== id));
    toast({
      title: "Listing supprimé",
      description: "Le listing a été supprimé avec succès.",
    });
  };

  return (
    <DashboardLayout userRole="supplier">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Listings</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FilePlus className="mr-2 h-5 w-5" />
              Télécharger un nouveau listing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                <FileUp className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-4">
                  Déposez votre fichier ici ou cliquez pour parcourir
                </p>
                <Input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange}
                  className="max-w-xs"
                />
                {selectedFile && (
                  <div className="mt-3 text-sm text-gray-600">
                    Fichier sélectionné: {selectedFile.name}
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleUpload} 
                  className="bg-medical hover:bg-medical-dark"
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Télécharger le listing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Vos listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3">Nom du fichier</th>
                    <th scope="col" className="px-6 py-3">Date d'ajout</th>
                    <th scope="col" className="px-6 py-3">Vues</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(listing => (
                    <tr key={listing.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{listing.name}</td>
                      <td className="px-6 py-4">{listing.date}</td>
                      <td className="px-6 py-4">{listing.views}</td>
                      <td className="px-6 py-4 flex space-x-2">
                        <Button variant="outline" size="icon" title="Voir">
                          <Eye size={16} />
                        </Button>
                        <Button variant="outline" size="icon" title="Télécharger">
                          <Download size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700" 
                          title="Supprimer"
                          onClick={() => handleDelete(listing.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SupplierListings;

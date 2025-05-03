
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Upload, Pencil, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SupplierListings = () => {
  const { toast } = useToast();
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [listingTitle, setListingTitle] = useState("");
  const [listingDescription, setListingDescription] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Mock data for existing listings
  const [listings, setListings] = useState([
    {
      id: 1,
      title: "Catalogue Antibiotiques 2025",
      description: "Liste complète des antibiotiques disponibles avec prix",
      fileUrl: "/sample.pdf",
      date: "2025-04-02",
      views: 45,
      published: true
    },
    {
      id: 2,
      title: "Médicaments génériques",
      description: "Catalogue des médicaments génériques avec équivalences",
      fileUrl: "/sample.pdf",
      date: "2025-03-20",
      views: 32,
      published: false
    },
    {
      id: 3,
      title: "Nouveautés Printemps 2025",
      description: "Découvrez les nouveaux produits disponibles ce printemps",
      fileUrl: "/sample.pdf",
      date: "2025-03-10",
      views: 28,
      published: true
    }
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is a PDF
      if (file.type !== 'application/pdf') {
        toast({
          title: "Format non supporté",
          description: "Veuillez télécharger uniquement des fichiers PDF.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedPDF(file);
    }
  };

  const handleCreateListing = (publish: boolean = false) => {
    if (!listingTitle.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez entrer un titre pour votre listing.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedPDF) {
      toast({
        title: "Fichier requis",
        description: "Veuillez télécharger un fichier PDF pour votre listing.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would upload the PDF to a server and save the listing details
    const newListing = {
      id: listings.length + 1,
      title: listingTitle,
      description: listingDescription,
      fileUrl: '/sample.pdf', // Just a placeholder
      date: new Date().toISOString().split("T")[0],
      views: 0,
      published: publish
    };
    
    setListings([newListing, ...listings]);
    
    // Reset form
    setListingTitle("");
    setListingDescription("");
    setSelectedPDF(null);
    
    toast({
      title: "Listing créé avec succès",
      description: publish 
        ? "Votre nouveau listing est maintenant disponible pour les pharmaciens."
        : "Votre nouveau listing a été créé. Vous pouvez le publier quand vous êtes prêt."
    });
  };

  const handleDelete = (id: number) => {
    setListings(listings.filter(listing => listing.id !== id));
    toast({
      title: "Listing supprimé",
      description: "Le listing a été supprimé avec succès."
    });
  };

  const handlePublish = (id: number) => {
    setIsPublishing(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, published: !listing.published } : listing
      ));
      
      setIsPublishing(false);
      toast({
        title: listings.find(l => l.id === id)?.published ? "Listing dépublié" : "Listing publié",
        description: listings.find(l => l.id === id)?.published 
          ? "Le listing n'est plus visible pour les pharmaciens." 
          : "Le listing est maintenant visible pour les pharmaciens."
      });
    }, 1000);
  };

  return (
    <DashboardLayout userRole="supplier">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Catalogues PDF</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileUp className="mr-2 h-5 w-5" />
              Ajouter un nouveau catalogue PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="listingTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Titre du catalogue
                </label>
                <Input 
                  id="listingTitle" 
                  value={listingTitle} 
                  onChange={e => setListingTitle(e.target.value)} 
                  placeholder="Ex: Catalogue Antibiotiques 2025" 
                />
              </div>
              
              <div>
                <label htmlFor="listingDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea 
                  id="listingDescription" 
                  value={listingDescription} 
                  onChange={e => setListingDescription(e.target.value)} 
                  placeholder="Décrivez brièvement le contenu de ce catalogue..." 
                  rows={3} 
                />
              </div>
              
              <div>
                <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-1">
                  Fichier PDF
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                  <FileUp className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-4">
                    Déposez votre fichier PDF ici ou cliquez pour parcourir
                  </p>
                  <Input id="pdfFile" type="file" accept="application/pdf" onChange={handleFileChange} className="max-w-xs" />
                  {selectedPDF && <p className="mt-2 text-sm text-gray-600">Fichier sélectionné: {selectedPDF.name}</p>}
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button onClick={() => handleCreateListing(false)} className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Pencil className="mr-2 h-4 w-4" />
                  Créer le listing
                </Button>
                <Button onClick={() => handleCreateListing(true)} className="bg-green-600 hover:bg-green-700 text-white">
                  <Upload className="mr-2 h-4 w-4" />
                  Créer et publier le listing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileUp className="mr-2 h-5 w-5" />
              Vos catalogues PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Titre</th>
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Vues</th>
                    <th className="py-2 px-4 text-left">Statut</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-gray-500">
                        Aucun catalogue PDF disponible. Ajoutez votre premier catalogue!
                      </td>
                    </tr>
                  ) : (
                    listings.map(listing => (
                      <tr key={listing.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{listing.title}</td>
                        <td className="py-3 px-4 max-w-[300px] truncate">{listing.description}</td>
                        <td className="py-3 px-4">{listing.date}</td>
                        <td className="py-3 px-4">{listing.views}</td>
                        <td className="py-3 px-4">
                          <span 
                            className={`px-2 py-1 rounded-full text-xs ${
                              listing.published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {listing.published ? 'Publié' : 'Non publié'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" title="Voir" className="h-8 w-8">
                              <Eye size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`h-8 w-8 ${listing.published ? 'text-amber-500' : 'text-green-500'}`}
                              title={listing.published ? 'Dépublier' : 'Publier'} 
                              onClick={() => handlePublish(listing.id)}
                              disabled={isPublishing}
                            >
                              <Upload size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500 hover:text-red-700" 
                              title="Supprimer" 
                              onClick={() => handleDelete(listing.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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

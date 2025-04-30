
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Image, Trash2, Edit, Eye, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SupplierOffers = () => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [offerText, setOfferText] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Mock data for existing offers
  const [offers, setOffers] = useState([
    { 
      id: 1, 
      title: "Promotion sur antibiotiques", 
      description: "Réduction de 15% sur toute la gamme d'antibiotiques", 
      imageUrl: null,
      date: "2025-04-01", 
      views: 78 
    },
    { 
      id: 2, 
      title: "Nouveaux produits disponibles", 
      description: "Découvrez notre nouvelle gamme de produits dermatologiques", 
      imageUrl: null,
      date: "2025-03-15", 
      views: 45 
    },
    { 
      id: 3, 
      title: "Offre spéciale fin de mois", 
      description: "Remise exceptionnelle sur les commandes de plus de 5000 DZD", 
      imageUrl: null,
      date: "2025-02-28", 
      views: 62 
    }
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.match('image.*')) {
        toast({
          title: "Format non supporté",
          description: "Veuillez télécharger une image (JPG, PNG, etc.).",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateOffer = () => {
    if (!offerTitle.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez entrer un titre pour votre offre.",
        variant: "destructive",
      });
      return;
    }

    if (!offerText.trim() && !selectedImage) {
      toast({
        title: "Contenu requis",
        description: "Veuillez ajouter une description ou une image à votre offre.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would upload the image to a server and save the offer details
    const newOffer = {
      id: offers.length + 1,
      title: offerTitle,
      description: offerText,
      imageUrl: previewUrl,
      date: new Date().toISOString().split("T")[0],
      views: 0
    };
    
    setOffers([newOffer, ...offers]);
    
    // Reset form
    setOfferTitle("");
    setOfferText("");
    setSelectedImage(null);
    setPreviewUrl(null);
    
    toast({
      title: "Offre créée avec succès",
      description: "Votre nouvelle offre est maintenant disponible pour les pharmaciens.",
    });
  };

  const handleDelete = (id: number) => {
    setOffers(offers.filter(offer => offer.id !== id));
    toast({
      title: "Offre supprimée",
      description: "L'offre a été supprimée avec succès.",
    });
  };

  return (
    <DashboardLayout userRole="supplier">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Offres</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ImagePlus className="mr-2 h-5 w-5" />
              Créer une nouvelle offre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="offerTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de l'offre
                </label>
                <Input
                  id="offerTitle"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="Ex: Promotion sur antibiotiques"
                />
              </div>
              
              <div>
                <label htmlFor="offerText" className="block text-sm font-medium text-gray-700 mb-1">
                  Description de l'offre
                </label>
                <Textarea
                  id="offerText"
                  value={offerText}
                  onChange={(e) => setOfferText(e.target.value)}
                  placeholder="Décrivez votre offre en détail..."
                  rows={4}
                />
              </div>
              
              <div>
                <label htmlFor="offerImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Image de l'offre (optionnel)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                  <FileUp className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-4">
                    Déposez votre image ici ou cliquez pour parcourir
                  </p>
                  <Input 
                    id="offerImage"
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="max-w-xs"
                  />
                </div>
                
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Aperçu:</p>
                    <img 
                      src={previewUrl} 
                      alt="Aperçu de l'offre" 
                      className="max-h-40 rounded-md"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateOffer} 
                  className="bg-medical hover:bg-medical-dark"
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Publier l'offre
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="mr-2 h-5 w-5" />
              Vos offres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map(offer => (
                <div key={offer.id} className="border rounded-lg overflow-hidden">
                  <div className="h-40 bg-gray-100 flex items-center justify-center">
                    {offer.imageUrl ? (
                      <img 
                        src={offer.imageUrl} 
                        alt={offer.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{offer.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {offer.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-xs text-gray-500">
                        {offer.date} · {offer.views} vues
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" title="Voir">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" title="Modifier">
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700" 
                          title="Supprimer"
                          onClick={() => handleDelete(offer.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SupplierOffers;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image as ImageIcon, Upload, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

const SupplierProfile = () => {
  const { id } = useParams<{ id?: string }>();
  const { toast: toastHook } = useToast();
  const [isOwnProfile] = useState(!id);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    id: "1",
    businessName: "MediStock Algérie",
    email: "contact@medistock.dz",
    phone: "0555123456",
    address: "123 Rue Ahmed Zabana, Alger",
    wilaya: "Alger",
    description: "Distributeur leader de produits pharmaceutiques en Algérie avec plus de 15 ans d'expérience dans le domaine. Nous collaborons avec les plus grands laboratoires nationaux et internationaux pour offrir une large gamme de médicaments et produits parapharmaceutiques.",
    logoUrl: "",
    website: "https://medistock.dz",
    registerNumber: "16/00-123456",
    subscription: "or",
    subscriptionExpiry: "2025-12-31",
    contactPersonName: "Mohammed Benali",
    contactPersonEmail: "m.benali@medistock.dz",
    contactPersonPhone: "0555789012",
    isEmailNotificationsEnabled: true,
    isSmsNotificationsEnabled: false,
    isPushNotificationsEnabled: true,
    specialties: ["Médicaments génériques", "Produits dermatologiques", "Dispositifs médicaux"],
    createdAt: "2023-05-15"
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from API
        // const response = await api.get(`/suppliers/${id || 'current'}`);
        // setProfileData(response.data);
        
        // Simulate API delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toastHook({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données du profil."
        });
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [id, toastHook]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5 Mo");
        return;
      }

      setProfileImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // In a real app, this would be an API call
      // await api.put(`/suppliers/profile`, profileData);
      
      // If there's an image to upload
      if (profileImage) {
        // In a real app, upload image to backend
        // const formData = new FormData();
        // formData.append("profileImage", profileImage);
        // await api.post("/suppliers/profile-image", formData);
        console.log("Uploading profile image:", profileImage.name);
      }
      
      // Simulate API call delay
      setTimeout(() => {
        setIsUploading(false);
        toast.success("Profil mis à jour avec succès");
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erreur lors de la mise à jour du profil");
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole="supplier">
        <div className="p-6 flex justify-center items-center min-h-[70vh]">
          <p>Chargement du profil...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="supplier">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isOwnProfile ? "Mon Profil" : `Profil de ${profileData.businessName}`}
        </h1>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="general">Informations</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Photo de Profil</CardTitle>
                <CardDescription>Cette image sera visible aux pharmaciens sur votre profil</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    {previewUrl ? (
                      <AvatarImage src={previewUrl} alt="Profile preview" />
                    ) : (
                      <>
                        <AvatarImage src={profileData.logoUrl || ""} alt={profileData.businessName} />
                        <AvatarFallback className="text-2xl">
                          {profileData.businessName.charAt(0)}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                </div>
                <div className="flex flex-col space-y-3">
                  <Label htmlFor="profileImage" className="cursor-pointer">
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        type="button" 
                        className="mr-3"
                        onClick={() => document.getElementById("profileImage")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Changer l'image
                      </Button>
                      {profileImage && <Check className="text-green-500 h-5 w-5" />}
                    </div>
                    <Input 
                      id="profileImage" 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={handleProfileImageChange}
                    />
                  </Label>
                  <p className="text-sm text-gray-500">JPG, PNG ou GIF. 5 MB max.</p>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleProfileUpdate}>
              <Card>
                <CardHeader>
                  <CardTitle>Informations de l'Entreprise</CardTitle>
                  <CardDescription>Informations principales de votre entreprise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Raison Sociale</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={profileData.businessName}
                        onChange={handleInputChange}
                        disabled={!isOwnProfile}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isOwnProfile}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isOwnProfile}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Site Web</Label>
                      <Input
                        id="website"
                        name="website"
                        value={profileData.website}
                        onChange={handleInputChange}
                        disabled={!isOwnProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!isOwnProfile}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wilaya">Wilaya</Label>
                      <Input
                        id="wilaya"
                        name="wilaya"
                        value={profileData.wilaya}
                        onChange={handleInputChange}
                        disabled={!isOwnProfile}
                        required
                      />
                    </div>
                    <div className="space-y-2 col-span-1 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={profileData.description}
                        onChange={handleInputChange}
                        disabled={!isOwnProfile}
                        className="min-h-32"
                      />
                      <p className="text-sm text-gray-500">
                        Décrivez votre entreprise, vos services et vos spécialités pour aider les pharmaciens à mieux vous connaître.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Personne à Contacter</CardTitle>
                  <CardDescription>Informations de la personne responsable</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactPersonName">Nom Complet</Label>
                      <Input
                        id="contactPersonName"
                        name="contactPersonName"
                        value={profileData.contactPersonName}
                        onChange={handleInputChange}
                        disabled={!isOwnProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPersonEmail">Email Direct</Label>
                      <Input
                        id="contactPersonEmail"
                        name="contactPersonEmail"
                        type="email"
                        value={profileData.contactPersonEmail}
                        onChange={handleInputChange}
                        disabled={!isOwnProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPersonPhone">Téléphone Direct</Label>
                      <Input
                        id="contactPersonPhone"
                        name="contactPersonPhone"
                        value={profileData.contactPersonPhone}
                        onChange={handleInputChange}
                        disabled={!isOwnProfile}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isOwnProfile && (
                <div className="mt-6 flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-pharmacy-accent hover:bg-pharmacy-dark"
                    disabled={isUploading}
                  >
                    {isUploading ? "Mise à jour..." : "Mettre à jour le profil"}
                  </Button>
                </div>
              )}
            </form>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du Compte</CardTitle>
                <CardDescription>Gérez les paramètres de sécurité de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    disabled={!isOwnProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    disabled={!isOwnProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    disabled={!isOwnProfile}
                  />
                </div>
                {isOwnProfile && (
                  <Button type="button" className="bg-pharmacy-accent hover:bg-pharmacy-dark">
                    Changer le mot de passe
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SupplierProfile;

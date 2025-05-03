
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Upload, User, Check } from "lucide-react";
import { toast } from "sonner";

const PharmacistProfile = () => {
  const { toast: toastHook } = useToast();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    businessName: "Pharmacie El Mouhid",
    email: "pharmacy@example.com",
    phone: "0555123456",
    wilaya: "Alger",
    address: "123 Rue Ahmed Zabana, Alger",
    subscription: "Gratuit",
    contactPersonName: "Ahmed Brahim",
    contactPersonEmail: "ahmed@example.com",
    contactPersonPhone: "0555789012",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toastHook({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès."
      });
    }, 1000);
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

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="container p-6 mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-pharmacy-dark">Mon Profil</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="general">Informations</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Info Card */}
              <div className="md:col-span-1">
                <Card>
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24">
                        {previewUrl ? (
                          <AvatarImage src={previewUrl} alt="Profile preview" />
                        ) : (
                          <>
                            <AvatarImage src="" alt={userData.businessName} />
                            <AvatarFallback className="bg-pharmacy-light text-pharmacy-dark text-2xl">
                              <User size={40} />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                    </div>
                    <CardTitle className="text-xl">{userData.businessName}</CardTitle>
                    <CardDescription>Pharmacien</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm mb-2">Email: {userData.email}</p>
                    <p className="text-sm mb-2">Téléphone: {userData.phone}</p>
                    <p className="text-sm mb-2">Wilaya: {userData.wilaya}</p>
                    <p className="text-sm mb-2">
                      <span className="font-bold">Abonnement: </span>
                      <span className="text-green-600 font-medium">{userData.subscription}</span>
                    </p>
                    <Label htmlFor="profileImage" className="cursor-pointer">
                      <Button variant="outline" size="sm" className="mt-4" onClick={() => document.getElementById("profileImage")?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Changer la photo
                      </Button>
                      <Input 
                        id="profileImage" 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleProfileImageChange}
                      />
                    </Label>
                    {profileImage && <p className="text-xs text-green-600 mt-2">Image sélectionnée</p>}
                  </CardContent>
                </Card>
              </div>

              {/* Edit Profile Form */}
              <div className="md:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations de la pharmacie</CardTitle>
                      <CardDescription>
                        Mettez à jour les informations de votre pharmacie
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Nom de la pharmacie</Label>
                          <Input 
                            id="businessName" 
                            name="businessName" 
                            value={userData.businessName} 
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={userData.email} 
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={userData.phone} 
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="wilaya">Wilaya</Label>
                          <Input 
                            id="wilaya" 
                            name="wilaya" 
                            value={userData.wilaya} 
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Adresse</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={userData.address} 
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Personne à contacter</CardTitle>
                      <CardDescription>Informations de la personne responsable</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactPersonName">Nom Complet</Label>
                          <Input
                            id="contactPersonName"
                            name="contactPersonName"
                            value={userData.contactPersonName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPersonEmail">Email Direct</Label>
                          <Input
                            id="contactPersonEmail"
                            name="contactPersonEmail"
                            type="email"
                            value={userData.contactPersonEmail}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPersonPhone">Téléphone Direct</Label>
                          <Input
                            id="contactPersonPhone"
                            name="contactPersonPhone"
                            value={userData.contactPersonPhone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-pharmacy-dark hover:bg-pharmacy text-white" disabled={loading}>
                      {loading ? (
                        "Sauvegarde..."
                      ) : (
                        <>
                          <Save className="mr-2" size={16} />
                          Sauvegarder
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                  />
                </div>
                <Button type="button" className="bg-pharmacy-accent hover:bg-pharmacy-dark">
                  Changer le mot de passe
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PharmacistProfile;

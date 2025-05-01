
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, User } from "lucide-react";

const SupplierProfile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    businessName: "Fournisseur MediPlus",
    email: "supplier@example.com",
    phone: "0660123456",
    wilaya: "Oran",
    subscription: "Bronze",
    registerImageURL: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSelectChange = (value: string) => {
    setUserData({
      ...userData,
      subscription: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès."
      });
    }, 1000);
  };

  return (
    <DashboardLayout userRole="supplier">
      <div className="container p-6 mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-pharmacy-dark">Mon Profil Fournisseur</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Info Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="" alt={userData.businessName} />
                    <AvatarFallback className="bg-pharmacy-light text-pharmacy-dark text-2xl">
                      <User size={40} />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{userData.businessName}</CardTitle>
                <CardDescription>Fournisseur</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm mb-2">Email: {userData.email}</p>
                <p className="text-sm mb-2">Téléphone: {userData.phone}</p>
                <p className="text-sm mb-2">Wilaya: {userData.wilaya}</p>
                <p className="text-sm mb-2">
                  <span className="font-bold">Abonnement: </span>
                  <span className={`font-medium ${
                    userData.subscription === "Or" 
                      ? "text-yellow-600" 
                      : userData.subscription === "Argent" 
                      ? "text-gray-500" 
                      : "text-amber-700"
                  }`}>
                    {userData.subscription}
                  </span>
                </p>
                <div className="mt-4 space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Changer la photo
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-yellow-600 hover:text-yellow-700">
                    Mettre à niveau l'abonnement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Modifier mes informations</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations professionnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nom de l'entreprise</Label>
                    <Input 
                      id="businessName" 
                      name="businessName" 
                      value={userData.businessName} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="subscription">Abonnement actuel</Label>
                      <Select 
                        value={userData.subscription}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger id="subscription">
                          <SelectValue placeholder="Sélectionnez votre abonnement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Or">Or</SelectItem>
                          <SelectItem value="Argent">Argent</SelectItem>
                          <SelectItem value="Bronze">Bronze</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registerImage">Registre de commerce (image)</Label>
                    <div className="border rounded-md p-4 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Déposez votre fichier ici ou cliquez pour télécharger</p>
                      <Input 
                        id="registerImage"
                        name="registerImage"
                        type="file"
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                    {userData.registerImageURL && (
                      <p className="text-sm text-gray-500">Fichier actuel: {userData.registerImageURL}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="bg-pharmacy-dark hover:bg-pharmacy text-white w-full" disabled={loading}>
                    {loading ? (
                      "Sauvegarde..."
                    ) : (
                      <>
                        <Save className="mr-2" size={16} />
                        Sauvegarder
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupplierProfile;

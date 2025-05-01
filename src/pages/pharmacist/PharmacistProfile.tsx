
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Save, User } from "lucide-react";

const PharmacistProfile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    businessName: "Pharmacie El Mouhid",
    email: "pharmacy@example.com",
    phone: "0555123456",
    wilaya: "Alger",
    subscription: "Gratuit"
  });

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
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès."
      });
    }, 1000);
  };

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="container p-6 mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-pharmacy-dark">Mon Profil</h1>
        
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
                <Button variant="outline" size="sm" className="mt-4">
                  Changer la photo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Modifier mes informations</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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

export default PharmacistProfile;


import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Save, ShieldCheck } from "lucide-react";

const AdminProfile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "Admin Principal",
    phone: "0770123456",
    email: "admin@elsaidaliya.dz",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
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
    
    // Validate password change if attempted
    if (userData.newPassword && userData.newPassword !== userData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès."
      });
      
      // Reset password fields after successful update
      setUserData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    }, 1000);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="container p-6 mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-pharmacy-dark">Profil Administrateur</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Info Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="" alt={userData.name} />
                    <AvatarFallback className="bg-pharmacy-light text-pharmacy-dark text-2xl">
                      <ShieldCheck size={40} />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{userData.name}</CardTitle>
                <CardDescription className="text-pharmacy">Administrateur</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm mb-2">Email: {userData.email}</p>
                <p className="text-sm mb-2">Téléphone: {userData.phone}</p>
                <p className="text-sm mb-4">Niveau d'accès: <span className="font-bold">Complet</span></p>
                <Button variant="outline" size="sm" className="mt-2">
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
                  Mettez à jour vos informations de compte administrateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={userData.name} 
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
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-4">Changer le mot de passe</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <Input 
                        id="currentPassword" 
                        name="currentPassword" 
                        type="password" 
                        value={userData.currentPassword} 
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <Input 
                          id="newPassword" 
                          name="newPassword" 
                          type="password" 
                          value={userData.newPassword} 
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <Input 
                          id="confirmPassword" 
                          name="confirmPassword" 
                          type="password" 
                          value={userData.confirmPassword} 
                          onChange={handleChange}
                        />
                      </div>
                    </div>
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

export default AdminProfile;

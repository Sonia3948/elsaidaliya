
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileUp, FilePlus, ImagePlus, BarChart2, Clock } from "lucide-react";

const SupplierDashboard = () => {
  const [stats, setStats] = useState({
    totalListings: 0,
    totalOffers: 0,
    viewsToday: 0,
    profileViews: 0,
  });

  useEffect(() => {
    // Simulate fetching data
    const mockStats = {
      totalListings: 12,
      totalOffers: 8,
      viewsToday: 45,
      profileViews: 124,
    };
    setStats(mockStats);
  }, []);

  return (
    <DashboardLayout userRole="supplier">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de Bord Fournisseur</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Listings Totaux</CardTitle>
              <FileUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalListings}</div>
              <p className="text-xs text-muted-foreground mt-1">+1 durant les dernières 24h</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offres Actives</CardTitle>
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOffers}</div>
              <p className="text-xs text-muted-foreground mt-1">+2 durant le dernier mois</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vues Aujourd'hui</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.viewsToday}</div>
              <p className="text-xs text-muted-foreground mt-1">+15% par rapport à hier</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vues du Profil</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.profileViews}</div>
              <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/supplier/listings">
                  <Button className="w-full bg-medical hover:bg-medical-dark">
                    <FilePlus className="mr-2 h-4 w-4" /> Ajouter un Listing
                  </Button>
                </Link>
                <Link to="/supplier/offers">
                  <Button className="w-full bg-medical hover:bg-medical-dark">
                    <ImagePlus className="mr-2 h-4 w-4" /> Créer une Offre
                  </Button>
                </Link>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Rappel</h3>
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-medium">Mise à jour du listing nécessaire</p>
                    <p className="text-sm">Votre dernier listing date d'il y a 24 heures.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "Pharmacie Centrale", action: "a consulté votre listing", time: "Il y a 1 heure" },
                  { user: "Pharmacie du Nord", action: "a visité votre profil", time: "Il y a 3 heures" },
                  { user: "Pharmacie Principale", action: "a consulté votre offre spéciale", time: "Il y a 5 heures" },
                  { user: "Pharmacie Santé", action: "a visité votre profil", time: "Il y a 1 jour" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-500">{activity.action}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupplierDashboard;

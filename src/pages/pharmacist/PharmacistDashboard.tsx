
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, FileText, Image, Users, Clock, ArrowRight } from "lucide-react";

const PharmacistDashboard = () => {
  const [stats, setStats] = useState({
    searchesThisMonth: 0,
    suppliersViewed: 0,
    offersViewed: 0,
  });

  useEffect(() => {
    // Simulate fetching data
    const mockStats = {
      searchesThisMonth: 28,
      suppliersViewed: 15,
      offersViewed: 22,
    };
    setStats(mockStats);
  }, []);

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de Bord Pharmacien</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recherches</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.searchesThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fournisseurs consultés</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.suppliersViewed}</div>
              <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offres consultées</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.offersViewed}</div>
              <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/pharmacist/medicines">
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover:border-medical">
                    <div className="h-12 w-12 bg-medical-light rounded-full flex items-center justify-center mb-4">
                      <Search className="h-6 w-6 text-medical-dark" />
                    </div>
                    <h3 className="font-medium text-gray-900">Rechercher des médicaments</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Trouvez rapidement les médicaments dont vous avez besoin
                    </p>
                  </div>
                </Link>
                
                <Link to="/pharmacist/offers">
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover:border-medical">
                    <div className="h-12 w-12 bg-medical-light rounded-full flex items-center justify-center mb-4">
                      <Image className="h-6 w-6 text-medical-dark" />
                    </div>
                    <h3 className="font-medium text-gray-900">Voir les offres</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Découvrez les offres spéciales des fournisseurs
                    </p>
                  </div>
                </Link>
                
                <Link to="/pharmacist/suppliers">
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover:border-medical">
                    <div className="h-12 w-12 bg-medical-light rounded-full flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-medical-dark" />
                    </div>
                    <h3 className="font-medium text-gray-900">Trouver des fournisseurs</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Recherchez des fournisseurs par nom ou par wilaya
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm">Vous avez recherché "Paracétamol"</p>
                    <p className="text-xs text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm">Vous avez consulté le profil de "MediStock"</p>
                    <p className="text-xs text-gray-500">Il y a 1 jour</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm">Vous avez consulté une offre spéciale</p>
                    <p className="text-xs text-gray-500">Il y a 2 jours</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link to="/pharmacist/history">
                    <Button variant="link" className="text-medical hover:text-medical-dark p-0 h-auto">
                      Voir toute l'historique <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Dernières offres disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover:border-medical">
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <Image className="h-10 w-10 text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">Offre Spéciale #{i}</h3>
                  <p className="text-sm text-gray-600 mt-1">Description courte de l'offre spéciale...</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">Fournisseur {i}</span>
                    <Link to={`/pharmacist/offers/${i}`}>
                      <Button variant="link" className="text-medical hover:text-medical-dark p-0 h-auto">
                        Voir détails
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/pharmacist/offers">
              <Button variant="outline">
                Voir toutes les offres <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PharmacistDashboard;

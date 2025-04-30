
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, Activity, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPharmacists: 0,
    totalSuppliers: 0,
    newRegistrations: 0,
  });

  useEffect(() => {
    // Simulate fetching data
    const mockStats = {
      totalUsers: 152,
      totalPharmacists: 98,
      totalSuppliers: 54,
      newRegistrations: 12,
    };
    setStats(mockStats);
  }, []);

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de Bord Administrateur</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{stats.newRegistrations} nouveaux ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pharmaciens</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPharmacists}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.totalPharmacists / stats.totalUsers) * 100)}% des utilisateurs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fournisseurs</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.totalSuppliers / stats.totalUsers) * 100)}% des utilisateurs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                Demandes d'assistance
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Nouveaux Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium">Utilisateur {i}</p>
                        <p className="text-sm text-gray-500">
                          {i % 2 === 0 ? "Pharmacien" : "Fournisseur"}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">Il y a {i} jours</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center border-b pb-2">
                  <Activity className="h-5 w-5 mr-2 text-medical" />
                  <div>
                    <p className="text-sm">Nouveau listing ajouté par <span className="font-medium">Fournisseur 1</span></p>
                    <p className="text-xs text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-center border-b pb-2">
                  <Activity className="h-5 w-5 mr-2 text-medical" />
                  <div>
                    <p className="text-sm">Nouvelle offre publiée par <span className="font-medium">Fournisseur 3</span></p>
                    <p className="text-xs text-gray-500">Il y a 5 heures</p>
                  </div>
                </div>
                <div className="flex items-center border-b pb-2">
                  <Activity className="h-5 w-5 mr-2 text-medical" />
                  <div>
                    <p className="text-sm">Nouveau pharmacien inscrit: <span className="font-medium">Pharmacie Centrale</span></p>
                    <p className="text-xs text-gray-500">Il y a 1 jour</p>
                  </div>
                </div>
                <div className="flex items-center border-b pb-2">
                  <Activity className="h-5 w-5 mr-2 text-medical" />
                  <div>
                    <p className="text-sm">Nouveau fournisseur inscrit: <span className="font-medium">MediStock</span></p>
                    <p className="text-xs text-gray-500">Il y a 1 jour</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

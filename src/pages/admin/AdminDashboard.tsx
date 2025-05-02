
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ShoppingBag, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  UserCheck, 
  TrendingUp,
  Calendar 
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for charts
const userGrowthData = [
  { name: "Jan", pharmacists: 10, suppliers: 5 },
  { name: "Feb", pharmacists: 15, suppliers: 8 },
  { name: "Mar", pharmacists: 18, suppliers: 12 },
  { name: "Avr", pharmacists: 25, suppliers: 15 },
  { name: "Mai", pharmacists: 30, suppliers: 18 },
  { name: "Juin", pharmacists: 40, suppliers: 25 },
  { name: "Juil", pharmacists: 50, suppliers: 32 },
  { name: "Août", pharmacists: 65, suppliers: 40 },
  { name: "Sep", pharmacists: 75, suppliers: 46 },
  { name: "Oct", pharmacists: 85, suppliers: 52 },
  { name: "Nov", pharmacists: 90, suppliers: 54 },
  { name: "Dec", pharmacists: 98, suppliers: 54 },
];

const subscriptionData = [
  { name: "Bronze", value: 65 },
  { name: "Argent", value: 25 },
  { name: "Or", value: 10 },
];

const recentActivities = [
  { id: 1, type: "registration", user: "Pharmacie du Sud", time: "Il y a 2 heures", status: "pending" },
  { id: 2, type: "subscription", user: "MediStock", time: "Il y a 5 heures", subscription: "or", status: "success" },
  { id: 3, type: "registration", user: "Pharmacie Centrale", time: "Il y a 1 jour", status: "success" },
  { id: 4, type: "subscription", user: "AlgéMed", time: "Il y a 1 jour", subscription: "argent", status: "pending" },
];

const pendingApprovals = [
  { id: 1, name: "Pharmacie du Sud", type: "pharmacist", date: "2025-05-01" },
  { id: 2, name: "AlgéMed", type: "supplier", date: "2025-05-01" },
  { id: 3, name: "Pharma Express", type: "pharmacist", date: "2025-04-30" },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPharmacists: 0,
    totalSuppliers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    newRegistrations: 0,
    totalSubscriptions: {
      bronze: 0,
      argent: 0,
      or: 0
    }
  });

  const [timeframe, setTimeframe] = useState("year");

  useEffect(() => {
    // Simulate fetching data
    const mockStats = {
      totalUsers: 152,
      totalPharmacists: 98,
      totalSuppliers: 54,
      activeUsers: 140,
      pendingUsers: 12,
      newRegistrations: 12,
      totalSubscriptions: {
        bronze: 65,
        argent: 25,
        or: 10
      }
    };
    setStats(mockStats);
  }, []);

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tableau de Bord Administrateur</h1>
          <div className="flex space-x-4">
            <Link to="/admin/users">
              <Button>
                <UserCheck className="mr-2 h-4 w-4" />
                Gérer les utilisateurs
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
              <CardTitle className="text-sm font-medium">En attente d'approbation</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Demandes d'activation
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Croissance des Utilisateurs</CardTitle>
              <Select 
                value={timeframe} 
                onValueChange={setTimeframe}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userGrowthData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="pharmacists" 
                      name="Pharmaciens"
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="suppliers" 
                      name="Fournisseurs"
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition des Abonnements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={subscriptionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name="Utilisateurs" 
                      fill="#8884d8" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center">
                  <div className="font-semibold">{stats.totalSubscriptions.bronze}</div>
                  <div className="text-xs text-muted-foreground">Bronze</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{stats.totalSubscriptions.argent}</div>
                  <div className="text-xs text-muted-foreground">Argent</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{stats.totalSubscriptions.or}</div>
                  <div className="text-xs text-muted-foreground">Or</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Approbations en Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune approbation en attente
                  </p>
                ) : (
                  pendingApprovals.map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          {approval.type === 'pharmacist' ? 'P' : 'F'}
                        </div>
                        <div>
                          <p className="font-medium">{approval.name}</p>
                          <p className="text-sm text-gray-500">
                            {approval.type === 'pharmacist' ? 'Pharmacien' : 'Fournisseur'}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/users">Voir tous</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center border-b pb-2">
                    {activity.type === "registration" ? (
                      <UserCheck className="h-5 w-5 mr-2 text-blue-500" />
                    ) : (
                      <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">
                        {activity.type === "registration" 
                          ? `Nouvelle inscription: ${activity.user}`
                          : `Nouvel abonnement ${activity.subscription}: ${activity.user}`
                        }
                      </p>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    {activity.status === "pending" ? (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">En attente</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Approuvé</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/activity">Voir toutes les activités</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

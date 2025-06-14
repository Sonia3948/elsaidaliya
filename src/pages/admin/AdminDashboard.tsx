
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, Trophy, Trash2, FileCheck, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import PendingApprovalsList from "@/components/admin/PendingApprovalsList";
import { userService } from "@/services/user";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    premiumUsers: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    rejectedPayments: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch only pending users for the new dashboard focus
      const pendingUsersResponse = await userService.getPendingUsers();
      
      if (pendingUsersResponse.users) {
        const pendingUsers = pendingUsersResponse.users;
        
        // Mock payment statistics - in real app, this would come from API
        setStats({
          totalUsers: 0, // Reset since we're focusing on new registrations only
          activeUsers: 0,
          pendingUsers: pendingUsers.length,
          premiumUsers: 0,
          pendingPayments: 2, // Mock data for pending supplier payments
          approvedPayments: 8, // Mock data for approved payments
          rejectedPayments: 1, // Mock data for rejected payments
          totalRevenue: 24000, // Mock revenue from subscriptions
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllUsers = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer tous les utilisateurs ? Cette action est irréversible.")) {
      try {
        const response = await userService.deleteAllUsers();
        if (response.message) {
          toast.success(response.message);
          // Refresh stats after deletion
          fetchDashboardStats();
        }
      } catch (error) {
        console.error("Error deleting all users:", error);
        toast.error("Erreur lors de la suppression des utilisateurs");
      }
    }
  };

  const handleUserApproved = () => {
    // Refresh stats when a user is approved
    fetchDashboardStats();
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tableau de Bord Administrateur</h1>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAllUsers}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer tous les utilisateurs
          </Button>
        </div>
        
        {/* Stats Cards - Enhanced with payment statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouvelles Inscriptions</CardTitle>
              <UserX className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {loading ? "..." : stats.pendingUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                En attente d'approbation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements en Attente</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {loading ? "..." : stats.pendingPayments}
              </div>
              <p className="text-xs text-muted-foreground">
                Bons de versement à valider
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements Approuvés</CardTitle>
              <FileCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? "..." : stats.approvedPayments}
              </div>
              <p className="text-xs text-muted-foreground">
                Ce mois-ci
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? "..." : `${stats.totalRevenue.toLocaleString()} DA`}
              </div>
              <p className="text-xs text-muted-foreground">
                Abonnements fournisseurs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Statistics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé des Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">En attente</span>
                  <span className="font-semibold text-yellow-600">{stats.pendingPayments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Approuvés</span>
                  <span className="font-semibold text-green-600">{stats.approvedPayments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rejetés</span>
                  <span className="font-semibold text-red-600">{stats.rejectedPayments}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total</span>
                    <span className="font-bold">{stats.pendingPayments + stats.approvedPayments + stats.rejectedPayments}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a 
                  href="/admin/payments" 
                  className="block p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Gérer les paiements</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.pendingPayments} en attente
                  </p>
                </a>
                <a 
                  href="/admin/users" 
                  className="block p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Gérer les utilisateurs</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Voir tous les comptes
                  </p>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Taux d'Approbation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Paiements</span>
                    <span className="text-sm font-medium">
                      {stats.approvedPayments + stats.rejectedPayments > 0 
                        ? `${Math.round((stats.approvedPayments / (stats.approvedPayments + stats.rejectedPayments)) * 100)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: stats.approvedPayments + stats.rejectedPayments > 0 
                          ? `${(stats.approvedPayments / (stats.approvedPayments + stats.rejectedPayments)) * 100}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Basé sur les dernières décisions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Only Pending Approvals */}
        <div className="grid grid-cols-1 gap-6">
          <PendingApprovalsList onUserApproved={handleUserApproved} />
          
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Nouvelles Inscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Cette section affiche uniquement les nouveaux utilisateurs qui s'inscrivent et qui attendent votre approbation. 
                Une fois approuvés, ils disparaîtront de cette liste et pourront accéder à leur compte.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  <span>Approuver l'utilisateur</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-red-600" />
                  <span>Rejeter l'utilisateur</span>
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

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, Trophy, Trash2, FileCheck, CreditCard, TrendingUp, AlertCircle, UserPlus, Calendar } from "lucide-react";
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
    // Nouvelles statistiques d'inscription
    totalPharmacists: 0,
    totalSuppliers: 0,
    pendingPharmacists: 0,
    pendingSuppliers: 0,
    activePharmacists: 0,
    activeSuppliers: 0,
    monthlyRegistrations: 0,
    weeklyRegistrations: 0
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

        // Calculer les statistiques d'inscription par rôle
        const pendingPharmacists = pendingUsers.filter(user => user.role === 'pharmacien').length;
        const pendingSuppliers = pendingUsers.filter(user => user.role === 'fournisseur').length;

        // Mock data pour les statistiques complètes d'inscription
        setStats({
          totalUsers: 0,
          // Reset since we're focusing on new registrations only
          activeUsers: 0,
          pendingUsers: pendingUsers.length,
          premiumUsers: 0,
          pendingPayments: 2,
          // Mock data for pending supplier payments
          approvedPayments: 8,
          // Mock data for approved payments
          rejectedPayments: 1,
          // Mock data for rejected payments
          totalRevenue: 24000,
          // Mock revenue from subscriptions
          // Statistiques d'inscription détaillées
          totalPharmacists: 45,
          // Mock: total pharmaciens inscrits
          totalSuppliers: 32,
          // Mock: total fournisseurs inscrits
          pendingPharmacists,
          pendingSuppliers,
          activePharmacists: 42,
          // Mock: pharmaciens actifs
          activeSuppliers: 28,
          // Mock: fournisseurs actifs
          monthlyRegistrations: 15,
          // Mock: inscriptions ce mois
          weeklyRegistrations: 4 // Mock: inscriptions cette semaine
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
  return <DashboardLayout userRole="admin">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tableau de Bord Administrateur</h1>
          
        </div>
        
        {/* Statistiques d'inscription principales */}
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
              <CardTitle className="text-sm font-medium">Inscriptions ce Mois</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? "..." : stats.monthlyRegistrations}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats.weeklyRegistrations} cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pharmaciens</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? "..." : stats.totalPharmacists}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.activePharmacists} actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fournisseurs</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {loading ? "..." : stats.totalSuppliers}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.activeSuppliers} actifs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques détaillées par rôle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Répartition des Inscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pharmaciens en attente</span>
                  <span className="font-semibold text-orange-600">{stats.pendingPharmacists}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fournisseurs en attente</span>
                  <span className="font-semibold text-orange-600">{stats.pendingSuppliers}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total en attente</span>
                    <span className="font-bold text-orange-600">{stats.pendingUsers}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Taux d'Activité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Pharmaciens</span>
                    <span className="text-sm font-medium">
                      {stats.totalPharmacists > 0 ? `${Math.round(stats.activePharmacists / stats.totalPharmacists * 100)}%` : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{
                    width: stats.totalPharmacists > 0 ? `${stats.activePharmacists / stats.totalPharmacists * 100}%` : '0%'
                  }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Fournisseurs</span>
                    <span className="text-sm font-medium">
                      {stats.totalSuppliers > 0 ? `${Math.round(stats.activeSuppliers / stats.totalSuppliers * 100)}%` : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{
                    width: stats.totalSuppliers > 0 ? `${stats.activeSuppliers / stats.totalSuppliers * 100}%` : '0%'
                  }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards - Paiements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                <a href="/admin/payments" className="block p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Gérer les paiements</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.pendingPayments} en attente
                  </p>
                </a>
                <a href="/admin/users" className="block p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
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
                      {stats.approvedPayments + stats.rejectedPayments > 0 ? `${Math.round(stats.approvedPayments / (stats.approvedPayments + stats.rejectedPayments) * 100)}%` : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{
                    width: stats.approvedPayments + stats.rejectedPayments > 0 ? `${stats.approvedPayments / (stats.approvedPayments + stats.rejectedPayments) * 100}%` : '0%'
                  }}></div>
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
    </DashboardLayout>;
};
export default AdminDashboard;
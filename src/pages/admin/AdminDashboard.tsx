import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, Trophy, Trash2 } from "lucide-react";
import PendingApprovalsList from "@/components/admin/PendingApprovalsList";
import { userService } from "@/services/user";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    premiumUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all users to calculate stats
      const allUsersResponse = await userService.getAllUsers();
      const pendingUsersResponse = await userService.getPendingUsers();
      
      if (allUsersResponse.users && pendingUsersResponse.users) {
        const allUsers = allUsersResponse.users;
        const pendingUsers = pendingUsersResponse.users;
        
        const activeUsers = allUsers.filter(user => user.isActive).length;
        const premiumUsers = allUsers.filter(user => 
          user.subscription === 'argent' || user.subscription === 'or'
        ).length;
        
        setStats({
          totalUsers: allUsers.length,
          activeUsers,
          pendingUsers: pendingUsers.length,
          premiumUsers,
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
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                Tous les utilisateurs inscrits
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? "..." : stats.activeUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                Comptes validés et actifs
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <UserX className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {loading ? "..." : stats.pendingUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                Demandes d'approbation
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abonnements Premium</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {loading ? "..." : stats.premiumUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                Argent et Or
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PendingApprovalsList onUserApproved={handleUserApproved} />
          
          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <a 
                  href="/admin/users" 
                  className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                >
                  <Users className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-blue-900">Gérer les Utilisateurs</div>
                    <div className="text-sm text-blue-600">Voir tous les utilisateurs</div>
                  </div>
                </a>
                
                <a 
                  href="/admin/payments" 
                  className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                >
                  <Trophy className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-medium text-green-900">Paiements</div>
                    <div className="text-sm text-green-600">Gérer les abonnements</div>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

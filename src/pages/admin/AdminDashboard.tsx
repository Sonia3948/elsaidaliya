
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, Trophy, Trash2, Store, Pill } from "lucide-react";
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
      
      // Fetch only pending users for the new dashboard focus
      const pendingUsersResponse = await userService.getPendingUsers();
      
      if (pendingUsersResponse.users) {
        const pendingUsers = pendingUsersResponse.users;
        
        setStats({
          totalUsers: 0, // Reset since we're focusing on new registrations only
          activeUsers: 0,
          pendingUsers: pendingUsers.length,
          premiumUsers: 0,
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
        
        {/* Stats Cards - Focused on new registrations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium">Gestion des Fournisseurs</CardTitle>
              <Store className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a 
                  href="/admin/suppliers" 
                  className="block text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Voir tous les fournisseurs
                </a>
                <p className="text-xs text-muted-foreground">
                  Gérer les comptes et abonnements
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gestion des Pharmaciens</CardTitle>
              <Pill className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a 
                  href="/admin/pharmacists" 
                  className="block text-sm text-green-600 hover:text-green-800 underline"
                >
                  Voir tous les pharmaciens
                </a>
                <p className="text-xs text-muted-foreground">
                  Gérer les comptes pharmaciens
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
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Actions Rapides</h4>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="/admin/users" 
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Gérer tous les utilisateurs
                  </a>
                  <a 
                    href="/admin/suppliers" 
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Gérer les fournisseurs
                  </a>
                  <a 
                    href="/admin/pharmacists" 
                    className="text-sm text-green-600 hover:text-green-800 underline"
                  >
                    Gérer les pharmaciens
                  </a>
                  <a 
                    href="/admin/payments" 
                    className="text-sm text-purple-600 hover:text-purple-800 underline"
                  >
                    Gérer les paiements
                  </a>
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

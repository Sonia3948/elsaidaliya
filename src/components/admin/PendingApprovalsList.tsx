
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { userService } from "@/services/user";

interface PendingUser {
  id: string;
  businessName: string;
  role: string;
  createdAt: string;
}

const PendingApprovalsList = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getPendingUsers();
      
      if (response.users) {
        setPendingUsers(response.users);
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
      toast.error("Erreur lors de la récupération des utilisateurs en attente");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      await userService.updateUserStatus(userId, true);
      toast.success("Utilisateur approuvé avec succès");
      // Remove the user from the list
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Erreur lors de l'approbation de l'utilisateur");
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      // For now, we just update the status to false, which is already the case
      // In a real implementation, you might want to delete the user or mark them as rejected
      await userService.updateUserStatus(userId, false);
      toast.success("Utilisateur rejeté");
      // Remove the user from the list
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Erreur lors du rejet de l'utilisateur");
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "pharmacien": return "Pharmacien";
      case "fournisseur": return "Fournisseur";
      default: return role;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approbations en Attente</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-4">Chargement...</p>
        ) : pendingUsers.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Aucune approbation en attente
          </p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{user.businessName}</p>
                    <p className="text-sm text-gray-500">
                      {getRoleDisplayName(user.role)} • {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleApproveUser(user.id)}
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleRejectUser(user.id)}
                  >
                    <XCircle className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={fetchPendingUsers} variant="outline" className="w-full">
          Actualiser
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendingApprovalsList;


import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, User, Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { pendingUsersAPI, type PendingUser } from "@/api/users";

interface PendingApprovalsListProps {
  onUserApproved?: () => void;
}

const PendingApprovalsList = ({ onUserApproved }: PendingApprovalsListProps) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pendingUsersAPI.getPendingUsers();
      
      if (response && response.users) {
        setPendingUsers(response.users);
      } else if (response === null) {
        setError("Impossible de se connecter au serveur backend");
      } else {
        setPendingUsers([]);
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
      setError("Erreur lors de la récupération des utilisateurs en attente");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    setProcessingUsers(prev => new Set(prev).add(userId));
    
    try {
      await pendingUsersAPI.approveUser(userId);
      toast.success("Utilisateur approuvé avec succès");
      
      // Remove the user from the list
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      
      // Notify parent component if callback provided
      if (onUserApproved) {
        onUserApproved();
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Erreur lors de l'approbation de l'utilisateur");
    } finally {
      setProcessingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleRejectUser = async (userId: string) => {
    setProcessingUsers(prev => new Set(prev).add(userId));
    
    try {
      await pendingUsersAPI.rejectUser(userId);
      toast.success("Utilisateur rejeté");
      
      // Remove the user from the list
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      
      // Notify parent component if callback provided
      if (onUserApproved) {
        onUserApproved();
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Erreur lors du rejet de l'utilisateur");
    } finally {
      setProcessingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
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
        <CardTitle className="flex items-center justify-between">
          <span>Approbations en Attente</span>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-4">Chargement...</p>
        ) : error ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-300 mx-auto mb-2" />
            <p className="text-center text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPendingUsers} variant="outline">
              Réessayer
            </Button>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-center text-muted-foreground">
              Aucune approbation en attente
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {pendingUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{user.business_name}</p>
                    <p className="text-sm text-gray-500">
                      {getRoleDisplayName(user.role)} • {format(new Date(user.created_at), 'dd/MM/yyyy')}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-400">{user.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleApproveUser(user.id)}
                    disabled={processingUsers.has(user.id)}
                  >
                    {processingUsers.has(user.id) ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleRejectUser(user.id)}
                    disabled={processingUsers.has(user.id)}
                  >
                    {processingUsers.has(user.id) ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={fetchPendingUsers} variant="outline" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Actualiser
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendingApprovalsList;

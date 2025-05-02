
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { userService } from "@/services/api";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface User {
  id: string;
  businessName: string;
  role: string;
  phone: string;
  email: string;
  wilaya: string;
  registerImageUrl: string;
  isActive: boolean;
  subscription: string;
  subExpiry: string;
  createdAt: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    businessName: "",
    isActive: false,
    subscription: "",
    subExpiry: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from backend
      const mockUsers = [
        {
          id: "1",
          businessName: "Pharmacie Centrale",
          role: "pharmacist",
          phone: "0555123456",
          email: "pharmacie.centrale@example.com",
          wilaya: "Alger",
          registerImageUrl: "/path/to/image.jpg",
          isActive: true,
          subscription: "bronze",
          subExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          businessName: "MediStock",
          role: "supplier",
          phone: "0555789012",
          email: "contact@medistock.com",
          wilaya: "Oran",
          registerImageUrl: "/path/to/image.jpg",
          isActive: false,
          subscription: "or",
          subExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          businessName: "Pharmacie du Nord",
          role: "pharmacist",
          phone: "0555456789",
          email: "nord.pharma@example.com",
          wilaya: "Constantine",
          registerImageUrl: "/path/to/image.jpg",
          isActive: true,
          subscription: "argent",
          subExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erreur lors de la récupération des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      businessName: user.businessName,
      isActive: user.isActive,
      subscription: user.subscription,
      subExpiry: new Date(user.subExpiry).toISOString().split('T')[0]
    });
    setIsEditOpen(true);
  };

  const handleToggleStatus = async (userId: string, newStatus: boolean) => {
    try {
      // In a real app, this would make an API call
      // await userService.updateUserStatus(userId, newStatus);
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === userId ? {...user, isActive: newStatus} : user
      ));
      
      toast.success(newStatus 
        ? "Compte utilisateur activé avec succès" 
        : "Compte utilisateur désactivé avec succès"
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Erreur lors de la mise à jour du statut de l'utilisateur");
    }
  };

  const handleUpdateSubscription = async () => {
    if (!selectedUser) return;
    
    try {
      // In a real app, this would make an API call
      // await userService.updateUserSubscription(selectedUser.id, editForm);
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? {
              ...user, 
              businessName: editForm.businessName,
              isActive: editForm.isActive,
              subscription: editForm.subscription,
              subExpiry: new Date(editForm.subExpiry).toISOString()
            } 
          : user
      ));
      
      setIsEditOpen(false);
      toast.success("Informations utilisateur mises à jour avec succès");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription.toLowerCase()) {
      case 'or':
        return <Badge className="bg-yellow-500">Or</Badge>;
      case 'argent':
        return <Badge className="bg-gray-400">Argent</Badge>;
      case 'bronze':
        return <Badge className="bg-amber-700">Bronze</Badge>;
      default:
        return <Badge variant="outline">Gratuit</Badge>;
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Utilisateurs</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Abonnement</TableHead>
                  <TableHead>Wilaya</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.businessName}</TableCell>
                      <TableCell>
                        {user.role === "pharmacist" ? "Pharmacien" : "Fournisseur"}
                      </TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                            Inactif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                      <TableCell>{user.wilaya}</TableCell>
                      <TableCell>
                        {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(user.id, !user.isActive)}
                            >
                              {user.isActive ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
            <DialogDescription>
              Informations complètes sur cet utilisateur.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Nom</Label>
                <div className="col-span-3">{selectedUser.businessName}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <div className="col-span-3">
                  {selectedUser.role === "pharmacist" ? "Pharmacien" : "Fournisseur"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <div className="col-span-3">{selectedUser.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Téléphone</Label>
                <div className="col-span-3">{selectedUser.phone}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Wilaya</Label>
                <div className="col-span-3">{selectedUser.wilaya}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Statut</Label>
                <div className="col-span-3">
                  {selectedUser.isActive ? "Actif" : "Inactif"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Abonnement</Label>
                <div className="col-span-3">
                  {getSubscriptionBadge(selectedUser.subscription)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Expiration</Label>
                <div className="col-span-3">
                  {format(new Date(selectedUser.subExpiry), 'dd/MM/yyyy')}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Inscrit le</Label>
                <div className="col-span-3">
                  {format(new Date(selectedUser.createdAt), 'dd/MM/yyyy')}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="businessName" className="text-right">Nom</Label>
                <Input 
                  id="businessName" 
                  className="col-span-3"
                  value={editForm.businessName}
                  onChange={(e) => setEditForm({...editForm, businessName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Statut</Label>
                <div className="flex items-center gap-2 col-span-3">
                  <Switch 
                    id="isActive" 
                    checked={editForm.isActive}
                    onCheckedChange={(checked) => setEditForm({...editForm, isActive: checked})} 
                  />
                  <Label htmlFor="isActive">
                    {editForm.isActive ? "Actif" : "Inactif"}
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subscription" className="text-right">Abonnement</Label>
                <Select 
                  value={editForm.subscription}
                  onValueChange={(value) => setEditForm({...editForm, subscription: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un abonnement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gratuit">Gratuit</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="argent">Argent</SelectItem>
                    <SelectItem value="or">Or</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subExpiry" className="text-right">Expiration</Label>
                <Input 
                  id="subExpiry" 
                  type="date" 
                  className="col-span-3"
                  value={editForm.subExpiry}
                  onChange={(e) => setEditForm({...editForm, subExpiry: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateSubscription}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminUsers;

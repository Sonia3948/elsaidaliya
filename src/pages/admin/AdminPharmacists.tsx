
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Eye, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Edit, 
  Image as ImageIcon,
  Search,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { algeriasWilayas } from "@/data/wilayas";

interface Pharmacist {
  id: string;
  businessName: string;
  phone: string;
  email: string;
  wilaya: string;
  registerImageUrl: string;
  isActive: boolean;
  createdAt: string;
  registerNumber?: string;
}

const AdminPharmacists = () => {
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPharmacist, setSelectedPharmacist] = useState<Pharmacist | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterWilaya, setFilterWilaya] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editForm, setEditForm] = useState({
    businessName: "",
    isActive: false,
    phone: "",
    email: "",
    wilaya: "",
    registerNumber: "",
  });

  useEffect(() => {
    fetchPharmacists();
  }, []);

  const fetchPharmacists = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from backend
      const mockPharmacists = [
        {
          id: "1",
          businessName: "Pharmacie Centrale",
          phone: "0555123456",
          email: "pharmacie.centrale@example.com",
          wilaya: "Alger",
          registerImageUrl: "/path/to/image.jpg",
          isActive: true,
          createdAt: new Date().toISOString(),
          registerNumber: "RC-9876543210",
        },
        {
          id: "2",
          businessName: "Pharmacie du Nord",
          phone: "0555456789",
          email: "nord.pharma@example.com",
          wilaya: "Constantine",
          registerImageUrl: "/path/to/image.jpg",
          isActive: true,
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          registerNumber: "RC-5432167890",
        },
        {
          id: "3",
          businessName: "PharmaPlus",
          phone: "0555111222",
          email: "contact@pharmaplus.com",
          wilaya: "Annaba",
          registerImageUrl: "/path/to/image.jpg",
          isActive: true,
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          registerNumber: "RC-1122334455",
        },
        {
          id: "4",
          businessName: "Pharmacie Santé",
          phone: "0555333444",
          email: "contact@pharmaciesante.com",
          wilaya: "Oran",
          registerImageUrl: "/path/to/image.jpg",
          isActive: false,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          registerNumber: "RC-3344556677",
        },
      ];
      setPharmacists(mockPharmacists);
    } catch (error) {
      console.error("Error fetching pharmacists:", error);
      toast.error("Erreur lors de la récupération des pharmaciens");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (pharmacist: Pharmacist) => {
    setSelectedPharmacist(pharmacist);
    setIsDetailsOpen(true);
  };

  const handleViewDocuments = (pharmacist: Pharmacist) => {
    setSelectedPharmacist(pharmacist);
    setIsDocumentsOpen(true);
  };

  const handleViewImage = (pharmacist: Pharmacist) => {
    setSelectedPharmacist(pharmacist);
    setIsImageOpen(true);
  };

  const handleEditPharmacist = (pharmacist: Pharmacist) => {
    setSelectedPharmacist(pharmacist);
    setEditForm({
      businessName: pharmacist.businessName,
      isActive: pharmacist.isActive,
      phone: pharmacist.phone,
      email: pharmacist.email,
      wilaya: pharmacist.wilaya,
      registerNumber: pharmacist.registerNumber || "",
    });
    setIsEditOpen(true);
  };

  const handleToggleStatus = async (pharmacistId: string, newStatus: boolean) => {
    try {
      // In a real app, this would make an API call
      // await userService.updateUserStatus(pharmacistId, newStatus);
      
      // Update the local state
      setPharmacists(pharmacists.map(pharmacist => 
        pharmacist.id === pharmacistId ? {...pharmacist, isActive: newStatus} : pharmacist
      ));
      
      toast.success(newStatus 
        ? "Compte pharmacien activé avec succès" 
        : "Compte pharmacien désactivé avec succès"
      );
    } catch (error) {
      console.error("Error updating pharmacist status:", error);
      toast.error("Erreur lors de la mise à jour du statut du pharmacien");
    }
  };

  const handleUpdatePharmacist = async () => {
    if (!selectedPharmacist) return;
    
    try {
      // In a real app, this would make an API call
      // await userService.updateUser(selectedPharmacist.id, editForm);
      
      // Update the local state
      setPharmacists(pharmacists.map(pharmacist => 
        pharmacist.id === selectedPharmacist.id 
          ? {
              ...pharmacist, 
              businessName: editForm.businessName,
              isActive: editForm.isActive,
              phone: editForm.phone,
              email: editForm.email,
              wilaya: editForm.wilaya,
              registerNumber: editForm.registerNumber,
            } 
          : pharmacist
      ));
      
      setIsEditOpen(false);
      toast.success("Informations pharmacien mises à jour avec succès");
    } catch (error) {
      console.error("Error updating pharmacist:", error);
      toast.error("Erreur lors de la mise à jour du pharmacien");
    }
  };

  const filteredPharmacists = pharmacists.filter(pharmacist => {
    // Filter by search query
    if (searchQuery && !pharmacist.businessName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !pharmacist.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by wilaya
    if (filterWilaya && pharmacist.wilaya !== filterWilaya) return false;
    
    // Filter by status
    if (filterStatus === "active" && !pharmacist.isActive) return false;
    if (filterStatus === "inactive" && pharmacist.isActive) return false;
    
    return true;
  });

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Pharmaciens</h1>
        
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pharmaciens</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                setSearchQuery("");
                setFilterWilaya("");
                setFilterStatus("all");
              }}>
                Réinitialiser les filtres
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Search className="text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
              <Select value={filterWilaya} onValueChange={setFilterWilaya}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par wilaya" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les wilayas</SelectItem>
                  {algeriasWilayas.map(wilaya => (
                    <SelectItem key={wilaya.code} value={wilaya.name}>{wilaya.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Raison Sociale</TableHead>
                  <TableHead>Registre de Commerce</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Wilaya</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : filteredPharmacists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Aucun pharmacien trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPharmacists.map((pharmacist) => (
                    <TableRow key={pharmacist.id}>
                      <TableCell>{pharmacist.businessName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{pharmacist.registerNumber || "N/A"}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handleViewDocuments(pharmacist)}
                          >
                            <FileText className="h-4 w-4 text-blue-500" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{pharmacist.phone}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={pharmacist.email}>{pharmacist.email}</TableCell>
                      <TableCell>{pharmacist.wilaya}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={pharmacist.isActive}
                          onCheckedChange={(checked) => handleToggleStatus(pharmacist.id, checked)}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(pharmacist.createdAt), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(pharmacist)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPharmacist(pharmacist)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewDocuments(pharmacist)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Voir les documents
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(pharmacist.id, !pharmacist.isActive)}
                            >
                              {pharmacist.isActive ? (
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
            <DialogTitle>Détails du pharmacien</DialogTitle>
            <DialogDescription>
              Informations complètes sur ce pharmacien.
            </DialogDescription>
          </DialogHeader>
          {selectedPharmacist && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Raison Sociale</Label>
                <div className="col-span-3">{selectedPharmacist.businessName}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Registre de Commerce</Label>
                <div className="col-span-3 flex items-center gap-2">
                  {selectedPharmacist.registerNumber || "Non fourni"}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      setTimeout(() => handleViewImage(selectedPharmacist), 100);
                    }}
                  >
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <div className="col-span-3">{selectedPharmacist.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Téléphone</Label>
                <div className="col-span-3">{selectedPharmacist.phone}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Wilaya</Label>
                <div className="col-span-3">{selectedPharmacist.wilaya}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Statut</Label>
                <div className="col-span-3">
                  {selectedPharmacist.isActive ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Actif
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                      Inactif
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Inscrit le</Label>
                <div className="col-span-3">
                  {format(new Date(selectedPharmacist.createdAt), 'dd/MM/yyyy')}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Documents Dialog */}
      <Dialog open={isDocumentsOpen} onOpenChange={setIsDocumentsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registre de Commerce</DialogTitle>
            <DialogDescription>
              {selectedPharmacist?.businessName} - {selectedPharmacist?.registerNumber || "Non fourni"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {selectedPharmacist?.registerImageUrl ? (
              <img 
                src={selectedPharmacist.registerImageUrl} 
                alt="Registre de commerce"
                className="max-h-[400px] max-w-full object-contain border rounded-md"
                onError={(e) => {
                  // Fallback if the image doesn't load
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/400x300?text=Image+Indisponible";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center bg-gray-100 w-full h-64 rounded-md">
                <ImageIcon className="h-16 w-16 text-gray-400" />
                <p className="mt-2 text-gray-500">Image non disponible</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDocumentsOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Registration Image Dialog */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registre de Commerce</DialogTitle>
            <DialogDescription>
              {selectedPharmacist?.businessName} - {selectedPharmacist?.registerNumber || "Non fourni"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {selectedPharmacist?.registerImageUrl ? (
              <img 
                src={selectedPharmacist.registerImageUrl} 
                alt="Registre de commerce"
                className="max-h-[400px] max-w-full object-contain border rounded-md"
                onError={(e) => {
                  // Fallback if the image doesn't load
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/400x300?text=Image+Indisponible";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center bg-gray-100 w-full h-64 rounded-md">
                <ImageIcon className="h-16 w-16 text-gray-400" />
                <p className="mt-2 text-gray-500">Image non disponible</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsImageOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Pharmacist Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le pharmacien</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations du pharmacien.
            </DialogDescription>
          </DialogHeader>
          {selectedPharmacist && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="businessName" className="text-right">Raison Sociale</Label>
                <Input 
                  id="businessName" 
                  className="col-span-3"
                  value={editForm.businessName}
                  onChange={(e) => setEditForm({...editForm, businessName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="registerNumber" className="text-right">Registre de Commerce</Label>
                <Input 
                  id="registerNumber" 
                  className="col-span-3"
                  value={editForm.registerNumber}
                  onChange={(e) => setEditForm({...editForm, registerNumber: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Téléphone</Label>
                <Input 
                  id="phone" 
                  className="col-span-3"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input 
                  id="email" 
                  className="col-span-3"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="wilaya" className="text-right">Wilaya</Label>
                <Select 
                  value={editForm.wilaya} 
                  onValueChange={(value) => setEditForm({...editForm, wilaya: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une wilaya" />
                  </SelectTrigger>
                  <SelectContent>
                    {algeriasWilayas.map(wilaya => (
                      <SelectItem key={wilaya.code} value={wilaya.name}>{wilaya.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Statut</Label>
                <div className="flex items-center gap-2 col-span-3">
                  <Switch 
                    id="isActive" 
                    checked={editForm.isActive}
                    onCheckedChange={(checked) => setEditForm({...editForm, isActive: checked})} 
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label htmlFor="isActive">
                    {editForm.isActive ? "Actif" : "Inactif"}
                  </Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-row justify-between">
            <Button 
              variant="destructive" 
              onClick={() => setIsEditOpen(false)}
              className="px-6"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleUpdatePharmacist}
              className="bg-green-600 hover:bg-green-700 px-6"
            >
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminPharmacists;

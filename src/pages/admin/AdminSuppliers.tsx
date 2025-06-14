import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Truck, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Filter, 
  MoreHorizontal,
  Edit,
  Image as ImageIcon,
  Upload,
  FileText,
  Award,
  Star,
  Medal,
  Trophy
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DocumentsViewer from "@/components/admin/DocumentsViewer";
import { algeriasWilayas } from "@/data/wilayas";
import { userService } from "@/services/user";
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
  registerNumber?: string;
  transferReceiptUrl?: string;
}

const AdminSuppliers = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    businessName: "",
    isActive: false,
    subscription: "",
    subExpiry: "",
    phone: "",
    email: "",
    wilaya: "",
    registerNumber: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers({ role: "supplier" });
      if (response.success && response.data?.users) {
        setSuppliers(response.data.users);
      } else {
        // Fallback to mock data if API fails
        const mockSuppliers = [
          {
            id: "1",
            businessName: "MediStock Supply",
            role: "supplier",
            phone: "0555123456",
            email: "contact@medistock.com",
            wilaya: "16 - Alger",
            registerNumber: "1234567890",
            isActive: true,
            subscription: "or",
            subExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            registerImageUrl: "/placeholder.svg",
            transferReceiptUrl: "/placeholder.svg",
            createdAt: "2023-05-10T10:30:00Z",
          },
          {
            id: "2",
            businessName: "PharmaDistrib",
            role: "supplier",
            phone: "0666123456",
            email: "info@pharmadistrib.dz",
            wilaya: "31 - Oran",
            registerNumber: "0987654321",
            isActive: false,
            subscription: "argent",
            subExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            registerImageUrl: "/placeholder.svg",
            createdAt: "2023-05-15T14:20:00Z",
          },
        ];
        setSuppliers(mockSuppliers);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des fournisseurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSupplierStatus = async (id: string, newStatus: boolean) => {
    try {
      const response = await userService.updateUserStatus(id, newStatus);
      if (response.success) {
        setSuppliers((prev) =>
          prev.map((supplier) =>
            supplier.id === id
              ? { ...supplier, isActive: newStatus }
              : supplier
          )
        );
        
        toast({
          title: `Statut du fournisseur modifié`,
          description: `Le fournisseur a été ${newStatus ? 'activé' : 'désactivé'}.`,
        });
      } else {
        throw new Error(response.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating supplier status:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du statut",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (supplier: User) => {
    setSelectedSupplier(supplier);
    setIsDetailsOpen(true);
  };

  const handleViewDocuments = (supplier: User) => {
    setSelectedSupplier(supplier);
    setIsDocumentsOpen(true);
  };

  const handleViewImage = (supplier: User) => {
    setSelectedSupplier(supplier);
    setIsImageOpen(true);
  };

  const handleViewReceipt = (supplier: User) => {
    if (!supplier.transferReceiptUrl) {
      toast({
        title: "Erreur",
        description: "Aucun bon de virement disponible",
        variant: "destructive",
      });
      return;
    }
    setSelectedSupplier(supplier);
    setIsReceiptOpen(true);
  };

  const handleEditUser = (supplier: User) => {
    setSelectedSupplier(supplier);
    setEditForm({
      businessName: supplier.businessName,
      isActive: supplier.isActive,
      subscription: supplier.subscription,
      subExpiry: new Date(supplier.subExpiry).toISOString().split('T')[0],
      phone: supplier.phone,
      email: supplier.email,
      wilaya: supplier.wilaya,
      registerNumber: supplier.registerNumber || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedSupplier) return;
    
    try {
      const response = await userService.updateUser(selectedSupplier.id, editForm);
      if (response.success) {
        setSuppliers(suppliers.map(supplier => 
          supplier.id === selectedSupplier.id 
            ? {
                ...supplier, 
                businessName: editForm.businessName,
                isActive: editForm.isActive,
                subscription: editForm.subscription,
                subExpiry: new Date(editForm.subExpiry).toISOString(),
                phone: editForm.phone,
                email: editForm.email,
                wilaya: editForm.wilaya,
                registerNumber: editForm.registerNumber,
              } 
            : supplier
        ));
        
        setIsEditOpen(false);
        toast({
          title: "Succès",
          description: "Informations fournisseur mises à jour avec succès",
        });
      } else {
        throw new Error(response.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du fournisseur",
        variant: "destructive",
      });
    }
  };

  const handleViewDocument = (document: string, supplier: User) => {
    setSelectedDocument(document);
    setSelectedSupplier(supplier);
    setIsViewerOpen(true);
  };

  const handleStatusChange = (id: string, isActive: boolean) => {
    setSelectedSupplier(suppliers.find(s => s.id === id) || null);
    setIsDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (selectedSupplier) {
      toggleSupplierStatus(selectedSupplier.id, !selectedSupplier.isActive);
    }
    setIsDialogOpen(false);
  };

  const getSubscriptionIcon = (subscription: string) => {
    switch (subscription.toLowerCase()) {
      case 'or':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'argent':
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 'bronze':
        return <Award className="h-5 w-5 text-amber-700" />;
      default:
        return <Star className="h-5 w-5 text-blue-400" />;
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription.toLowerCase()) {
      case 'or':
        return (
          <Badge className="bg-yellow-500 flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            Or
          </Badge>
        );
      case 'argent':
        return (
          <Badge className="bg-gray-400 flex items-center gap-1">
            <Medal className="h-3 w-3" />
            Argent
          </Badge>
        );
      case 'bronze':
        return (
          <Badge className="bg-amber-700 flex items-center gap-1">
            <Award className="h-3 w-3" />
            Bronze
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            Gratuit
          </Badge>
        );
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = 
      supplier.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.phone.includes(searchQuery);
    
    const matchesWilaya = selectedWilaya === "all" || supplier.wilaya.includes(selectedWilaya);
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && supplier.isActive) ||
      (statusFilter === "inactive" && !supplier.isActive);

    return matchesSearch && matchesWilaya && matchesStatus;
  });

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fournisseurs</h1>
            <p className="text-gray-500">Gérer les comptes des fournisseurs</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-pharmacy-dark" />
              <span className="text-lg font-medium text-pharmacy-dark">
                {filteredSuppliers.length} Fournisseurs
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium">Filtres de recherche</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Recherche par nom/email/téléphone
              </label>
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Wilaya
              </label>
              <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes les wilayas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les wilayas</SelectItem>
                  {algeriasWilayas.map((wilaya) => (
                    <SelectItem key={wilaya.code} value={wilaya.code}>
                      {wilaya.code} - {wilaya.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Statut
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedWilaya("all");
                  setStatusFilter("all");
                }}
                className="w-full"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableCaption>Liste des fournisseurs enregistrés sur la plateforme.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Raison Sociale</TableHead>
                <TableHead>Registre de Commerce</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Wilaya</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Abonnement</TableHead>
                <TableHead>Date d'inscription</TableHead>
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
              ) : filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Aucun fournisseur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.businessName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{supplier.registerNumber || "N/A"}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleViewDocuments(supplier)}
                        >
                          <FileText className="h-4 w-4 text-blue-500" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{supplier.phone}</div>
                      <div className="text-sm text-gray-500">{supplier.email}</div>
                    </TableCell>
                    <TableCell>{supplier.wilaya}</TableCell>
                    <TableCell>
                      {supplier.isActive ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          Actif
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100">
                          En attente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {getSubscriptionIcon(supplier.subscription)}
                      {getSubscriptionBadge(supplier.subscription)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(supplier.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(supplier)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(supplier)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewDocuments(supplier)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Voir les documents
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(supplier.id, !supplier.isActive)}
                          >
                            {supplier.isActive ? (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
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
        </div>

        {/* User Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Détails du fournisseur</DialogTitle>
              <DialogDescription>
                Informations complètes sur ce fournisseur.
              </DialogDescription>
            </DialogHeader>
            {selectedSupplier && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Raison Sociale</Label>
                  <div className="col-span-3">{selectedSupplier.businessName}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Type</Label>
                  <div className="col-span-3">Fournisseur</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Registre de Commerce</Label>
                  <div className="col-span-3 flex items-center gap-2">
                    {selectedSupplier.registerNumber || "Non fourni"}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => {
                        setIsDetailsOpen(false);
                        setTimeout(() => handleViewImage(selectedSupplier), 100);
                      }}
                    >
                      <ImageIcon className="h-4 w-4 text-blue-500" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Email</Label>
                  <div className="col-span-3">{selectedSupplier.email}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Téléphone</Label>
                  <div className="col-span-3">{selectedSupplier.phone}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Wilaya</Label>
                  <div className="col-span-3">{selectedSupplier.wilaya}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Statut</Label>
                  <div className="col-span-3">
                    {selectedSupplier.isActive ? (
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
                  <Label className="text-right">Abonnement</Label>
                  <div className="col-span-3 flex items-center gap-2">
                    {getSubscriptionIcon(selectedSupplier.subscription)}
                    {getSubscriptionBadge(selectedSupplier.subscription)}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Expiration</Label>
                  <div className="col-span-3">
                    {format(new Date(selectedSupplier.subExpiry), 'dd/MM/yyyy')}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Inscrit le</Label>
                  <div className="col-span-3">
                    {format(new Date(selectedSupplier.createdAt), 'dd/MM/yyyy')}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Paiement</Label>
                  <div className="col-span-3">
                    {selectedSupplier.transferReceiptUrl ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setIsDetailsOpen(false);
                          setTimeout(() => handleViewReceipt(selectedSupplier), 100);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Voir le bon de virement
                      </Button>
                    ) : (
                      <span className="text-yellow-600">Aucun bon de virement</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsDetailsOpen(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isViewerOpen && selectedSupplier && (
          <DocumentsViewer
            isOpen={isViewerOpen}
            onClose={() => setIsViewerOpen(false)}
            documentUrl={selectedDocument}
            title={`Registre de commerce - ${selectedSupplier.businessName}`}
            info={`Numéro: ${selectedSupplier.registerNumber}`}
          />
        )}

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedSupplier?.isActive
                  ? "Désactiver ce fournisseur ?"
                  : "Activer ce fournisseur ?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedSupplier?.isActive
                  ? "Le fournisseur ne pourra plus se connecter ou utiliser la plateforme tant que son compte sera désactivé."
                  : "Le fournisseur pourra désormais se connecter et utiliser tous les services de la plateforme."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmStatusChange}>
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminSuppliers;

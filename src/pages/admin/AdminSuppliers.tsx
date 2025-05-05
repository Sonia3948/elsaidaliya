
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
  Award, 
  Star, 
  Medal, 
  Trophy,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { algeriasWilayas } from "@/data/wilayas";

interface Supplier {
  id: string;
  businessName: string;
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
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterWilaya, setFilterWilaya] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubscription, setFilterSubscription] = useState("all");
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
      // In a real implementation, this would fetch from backend
      const mockSuppliers = [
        {
          id: "1",
          businessName: "MediStock",
          phone: "0555789012",
          email: "contact@medistock.com",
          wilaya: "Oran",
          registerImageUrl: "/path/to/image.jpg",
          transferReceiptUrl: "/path/to/receipt.pdf",
          isActive: false,
          subscription: "or",
          subExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          registerNumber: "RC-1234567890",
        },
        {
          id: "2",
          businessName: "AlgMed Distribution",
          phone: "0555222333",
          email: "contact@algmed.com",
          wilaya: "Alger",
          registerImageUrl: "/path/to/image.jpg",
          isActive: true,
          subscription: "argent",
          subExpiry: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          registerNumber: "RC-9988776655",
        },
        {
          id: "3",
          businessName: "PharmaSupply",
          phone: "0555444555",
          email: "info@pharmasupply.com",
          wilaya: "Constantine",
          registerImageUrl: "/path/to/image.jpg",
          transferReceiptUrl: "/path/to/receipt.pdf",
          isActive: true,
          subscription: "bronze",
          subExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          registerNumber: "RC-5566778899",
        },
      ];
      setSuppliers(mockSuppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Erreur lors de la récupération des fournisseurs");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailsOpen(true);
  };

  const handleViewDocuments = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDocumentsOpen(true);
  };

  const handleViewImage = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsImageOpen(true);
  };

  const handleViewReceipt = (supplier: Supplier) => {
    if (!supplier.transferReceiptUrl) {
      toast.error("Aucun bon de virement disponible");
      return;
    }
    setSelectedSupplier(supplier);
    setIsReceiptOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
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

  const handleToggleStatus = async (supplierId: string, newStatus: boolean) => {
    try {
      // In a real app, this would make an API call
      // await userService.updateUserStatus(supplierId, newStatus);
      
      // Update the local state
      setSuppliers(suppliers.map(supplier => 
        supplier.id === supplierId ? {...supplier, isActive: newStatus} : supplier
      ));
      
      toast.success(newStatus 
        ? "Compte fournisseur activé avec succès" 
        : "Compte fournisseur désactivé avec succès"
      );
    } catch (error) {
      console.error("Error updating supplier status:", error);
      toast.error("Erreur lors de la mise à jour du statut du fournisseur");
    }
  };

  const handleUpdateSupplier = async () => {
    if (!selectedSupplier) return;
    
    try {
      // In a real app, this would make an API call
      // await userService.updateUser(selectedSupplier.id, editForm);
      
      // Update the local state
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
      toast.success("Informations fournisseur mises à jour avec succès");
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error("Erreur lors de la mise à jour du fournisseur");
    }
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

  const filteredSuppliers = suppliers.filter(supplier => {
    // Filter by search query
    if (searchQuery && !supplier.businessName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !supplier.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by wilaya
    if (filterWilaya && supplier.wilaya !== filterWilaya) return false;
    
    // Filter by status
    if (filterStatus === "active" && !supplier.isActive) return false;
    if (filterStatus === "inactive" && supplier.isActive) return false;
    
    // Filter by subscription
    if (filterSubscription !== "all" && supplier.subscription !== filterSubscription) return false;
    
    return true;
  });

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Fournisseurs</h1>
        
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Fournisseurs</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                setSearchQuery("");
                setFilterWilaya("");
                setFilterStatus("all");
                setFilterSubscription("all");
              }}>
                Réinitialiser les filtres
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Select value={filterSubscription} onValueChange={setFilterSubscription}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par abonnement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les abonnements</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="argent">Argent</SelectItem>
                  <SelectItem value="or">Or</SelectItem>
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
                  <TableHead>Abonnement</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      Aucun fournisseur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.businessName}</TableCell>
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
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={supplier.email}>{supplier.email}</TableCell>
                      <TableCell>{supplier.wilaya}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={supplier.isActive}
                          onCheckedChange={(checked) => handleToggleStatus(supplier.id, checked)}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getSubscriptionIcon(supplier.subscription)}
                        {getSubscriptionBadge(supplier.subscription)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(supplier.subExpiry), 'dd/MM/yyyy')}
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
                            <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewDocuments(supplier)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Voir les documents
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(supplier.id, !supplier.isActive)}
                            >
                              {supplier.isActive ? (
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

      {/* Supplier Details Dialog */}
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

      {/* Documents Dialog */}
      <Dialog open={isDocumentsOpen} onOpenChange={setIsDocumentsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Documents</DialogTitle>
            <DialogDescription>
              {selectedSupplier?.businessName} - Documents officiels
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Registre de Commerce */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <ImageIcon className="mr-2 h-4 w-4" /> Registre de Commerce
              </h3>
              <p className="text-sm text-gray-500 mb-2">{selectedSupplier?.registerNumber || "Non fourni"}</p>
              <div className="h-60 flex justify-center items-center bg-gray-50 border rounded-md overflow-hidden">
                {selectedSupplier?.registerImageUrl ? (
                  <img 
                    src={selectedSupplier.registerImageUrl} 
                    alt="Registre de commerce"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/400x300?text=Image+Indisponible";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">Image non disponible</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Bon de Virement */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <Upload className="mr-2 h-4 w-4" /> Bon de Virement
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {selectedSupplier?.transferReceiptUrl ? "Document fourni" : "Non fourni"}
              </p>
              <div className="h-60 flex justify-center items-center bg-gray-50 border rounded-md overflow-hidden">
                {selectedSupplier?.transferReceiptUrl ? (
                  <img 
                    src={selectedSupplier.transferReceiptUrl} 
                    alt="Bon de virement"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/400x300?text=Document+Indisponible";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <Upload className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">Document non disponible</p>
                  </div>
                )}
              </div>
            </div>
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
              {selectedSupplier?.businessName} - {selectedSupplier?.registerNumber || "Non fourni"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {selectedSupplier?.registerImageUrl ? (
              <img 
                src={selectedSupplier.registerImageUrl} 
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

      {/* Transfer Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bon de Virement</DialogTitle>
            <DialogDescription>
              {selectedSupplier?.businessName}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {selectedSupplier?.transferReceiptUrl ? (
              <img 
                src={selectedSupplier.transferReceiptUrl} 
                alt="Bon de virement"
                className="max-h-[400px] max-w-full object-contain border rounded-md"
                onError={(e) => {
                  // Fallback if the image doesn't load
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/400x300?text=Document+Indisponible";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center bg-gray-100 w-full h-64 rounded-md">
                <Upload className="h-16 w-16 text-gray-400" />
                <p className="mt-2 text-gray-500">Document non disponible</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsReceiptOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le fournisseur</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations du fournisseur.
            </DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subscription" className="text-right">Abonnement</Label>
                <div className="col-span-3">
                  <Select 
                    value={editForm.subscription}
                    onValueChange={(value) => setEditForm({...editForm, subscription: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un abonnement">
                        <div className="flex items-center gap-2">
                          {editForm.subscription && getSubscriptionIcon(editForm.subscription)}
                          {editForm.subscription ? (
                            editForm.subscription.charAt(0).toUpperCase() + editForm.subscription.slice(1)
                          ) : 'Sélectionner'}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bronze" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-700" />
                          <span>Bronze</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="argent" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Medal className="h-4 w-4 text-gray-400" />
                          <span>Argent</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="or" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span>Or</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
          <DialogFooter className="flex flex-row justify-between">
            <Button 
              variant="destructive" 
              onClick={() => setIsEditOpen(false)}
              className="px-6"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleUpdateSupplier}
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

export default AdminSuppliers;

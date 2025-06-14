
import { useState } from "react";
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
import { Store, Eye, CheckCircle, XCircle, MoreHorizontal, Filter } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DocumentsViewer from "@/components/admin/DocumentsViewer";
import PaymentReceiptNotification from "@/components/admin/PaymentReceiptNotification";
import { algeriasWilayas } from "@/data/wilayas";

// Mock data - in a real app this would come from an API
const mockSuppliers = [
  {
    id: "1",
    businessName: "MediStock Algérie",
    phone: "0555789012",
    email: "contact@medistock.dz",
    wilaya: "16 - Alger",
    registerNumber: "123456789",
    isActive: true,
    registerImageUrl: "/placeholder.svg",
    subscription: "gold",
    subExpiry: "2024-05-15T00:00:00Z",
    createdAt: "2023-04-10T10:30:00Z",
    hasPendingPayment: false,
  },
  {
    id: "2",
    businessName: "PharmaSupply",
    phone: "0666234567",
    email: "info@pharmasupply.dz",
    wilaya: "31 - Oran",
    registerNumber: "987654321",
    isActive: false,
    registerImageUrl: "/placeholder.svg",
    subscription: "silver",
    subExpiry: "2023-12-31T00:00:00Z",
    createdAt: "2023-04-15T14:20:00Z",
    hasPendingPayment: true,
  },
  {
    id: "3",
    businessName: "AlgéPharm",
    phone: "0777345678",
    email: "contact@algepharm.dz",
    wilaya: "25 - Constantine",
    registerNumber: "567890123",
    isActive: true,
    registerImageUrl: "/placeholder.svg",
    subscription: "bronze",
    subExpiry: "2024-02-28T00:00:00Z",
    createdAt: "2023-04-12T09:45:00Z",
    hasPendingPayment: false,
  },
  {
    id: "4",
    businessName: "MedImport SARL",
    phone: "0555456789",
    email: "service@medimport.dz",
    wilaya: "09 - Blida",
    registerNumber: "345678901",
    isActive: false,
    registerImageUrl: "/placeholder.svg",
    subscription: "",
    subExpiry: "",
    createdAt: "2023-04-20T11:15:00Z",
    hasPendingPayment: true,
  },
];

const subscriptionBadges = {
  gold: { label: "Or", className: "bg-amber-100 text-amber-800 border-amber-200" },
  silver: { label: "Argent", className: "bg-slate-100 text-slate-800 border-slate-200" },
  bronze: { label: "Bronze", className: "bg-orange-100 text-orange-800 border-orange-200" },
  "": { label: "Aucun", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

const AdminSuppliers = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // In a real app, this would be an API call
  const toggleSupplierStatus = (id: string, newStatus: boolean) => {
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
  };

  const handleViewDocument = (document: string, supplier: any) => {
    setSelectedDocument(document);
    setSelectedSupplier(supplier);
    setIsViewerOpen(true);
  };

  const handleViewPayment = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsPaymentDialogOpen(true);
  };

  const handleStatusChange = (id: string, isActive: boolean) => {
    setSelectedSupplier(suppliers.find(s => s.id === id));
    setIsDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (selectedSupplier) {
      toggleSupplierStatus(selectedSupplier.id, !selectedSupplier.isActive);
    }
    setIsDialogOpen(false);
  };

  const updateSubscription = (id: string, newSubscription: string) => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id
          ? { 
              ...supplier, 
              subscription: newSubscription,
              subExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            }
          : supplier
      )
    );
    
    toast({
      title: `Abonnement mis à jour`,
      description: `L'abonnement a été mis à jour vers ${
        newSubscription ? subscriptionBadges[newSubscription as keyof typeof subscriptionBadges].label : "Aucun"
      }.`,
    });
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
            <p className="text-gray-500">Gérer les comptes et abonnements des fournisseurs</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Store className="h-5 w-5 text-pharmacy-dark" />
              <span className="text-lg font-medium text-pharmacy-dark">
                {filteredSuppliers.length} Fournisseurs
              </span>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
              {suppliers.filter(s => s.hasPendingPayment).length} en attente de validation
            </Badge>
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

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableCaption>Liste des fournisseurs enregistrés sur la plateforme.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Wilaya</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Abonnement</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.businessName}</TableCell>
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
                    {supplier.hasPendingPayment && (
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                        Paiement à vérifier
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {supplier.subscription ? (
                      <div>
                        <Badge 
                          variant="outline" 
                          className={subscriptionBadges[supplier.subscription as keyof typeof subscriptionBadges].className}
                        >
                          {subscriptionBadges[supplier.subscription as keyof typeof subscriptionBadges].label}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          Expire le {new Date(supplier.subExpiry).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        Aucun
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(supplier.registerImageUrl, supplier)}
                        className="flex items-center text-gray-600 hover:text-pharmacy-dark"
                      >
                        <Eye size={16} className="mr-1" />
                        Registre
                      </Button>
                      {supplier.hasPendingPayment && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPayment(supplier)}
                          className="flex items-center bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        >
                          <Eye size={16} className="mr-1" />
                          Paiement
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {supplier.isActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(supplier.id, false)}
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        >
                          <XCircle size={16} className="mr-1" />
                          Désactiver
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(supplier.id, true)}
                          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Activer
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateSubscription(supplier.id, "gold")}>
                            Définir abonnement Or
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateSubscription(supplier.id, "silver")}>
                            Définir abonnement Argent
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateSubscription(supplier.id, "bronze")}>
                            Définir abonnement Bronze
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateSubscription(supplier.id, "")}>
                            Retirer l'abonnement
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {isViewerOpen && selectedSupplier && (
          <DocumentsViewer
            isOpen={isViewerOpen}
            onClose={() => setIsViewerOpen(false)}
            documentUrl={selectedDocument}
            title={`Registre de commerce - ${selectedSupplier.businessName}`}
            info={`Numéro: ${selectedSupplier.registerNumber}`}
          />
        )}

        {isPaymentDialogOpen && selectedSupplier && (
          <PaymentReceiptNotification
            isOpen={isPaymentDialogOpen}
            onClose={() => setIsPaymentDialogOpen(false)}
            supplier={selectedSupplier}
            onApprove={() => {
              setSuppliers((prev) =>
                prev.map((s) =>
                  s.id === selectedSupplier.id
                    ? { ...s, hasPendingPayment: false }
                    : s
                )
              );
              setIsPaymentDialogOpen(false);
              toast({
                title: "Paiement validé",
                description: "Le paiement a été validé avec succès.",
              });
            }}
            onReject={() => {
              setSuppliers((prev) =>
                prev.map((s) =>
                  s.id === selectedSupplier.id
                    ? { ...s, hasPendingPayment: false }
                    : s
                )
              );
              setIsPaymentDialogOpen(false);
              toast({
                title: "Paiement rejeté",
                description: "Le bon de versement a été rejeté.",
                variant: "destructive",
              });
            }}
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

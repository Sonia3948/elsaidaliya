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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pill, Eye, CheckCircle, XCircle, Filter } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DocumentsViewer from "@/components/admin/DocumentsViewer";
import { algeriasWilayas } from "@/data/wilayas";

// Mock data - in a real app this would come from an API
const mockPharmacists = [
  {
    id: "1",
    businessName: "Pharmacie Centrale",
    phone: "0555123456",
    email: "pharmacie.centrale@example.com",
    wilaya: "16 - Alger",
    registerNumber: "1234567890",
    isActive: true,
    registerImageUrl: "/placeholder.svg",
    createdAt: "2023-05-10T10:30:00Z",
  },
  {
    id: "2",
    businessName: "Pharmacie El Amal",
    phone: "0666123456",
    email: "pharmacie.elamal@example.com",
    wilaya: "31 - Oran",
    registerNumber: "0987654321",
    isActive: false,
    registerImageUrl: "/placeholder.svg",
    createdAt: "2023-05-15T14:20:00Z",
  },
  {
    id: "3",
    businessName: "Pharmacie Ibn Sina",
    phone: "0777123456",
    email: "pharmacie.ibnsina@example.com",
    wilaya: "25 - Constantine",
    registerNumber: "5678901234",
    isActive: true,
    registerImageUrl: "/placeholder.svg",
    createdAt: "2023-05-12T09:45:00Z",
  },
  {
    id: "4",
    businessName: "Pharmacie El Hayat",
    phone: "0555987654",
    email: "pharmacie.elhayat@example.com",
    wilaya: "09 - Blida",
    registerNumber: "3456789012",
    isActive: false,
    registerImageUrl: "/placeholder.svg",
    createdAt: "2023-05-20T11:15:00Z",
  },
];

const AdminPharmacists = () => {
  const { toast } = useToast();
  const [pharmacists, setPharmacists] = useState(mockPharmacists);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPharmacist, setSelectedPharmacist] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // In a real app, this would be an API call
  const togglePharmacistStatus = (id: string, newStatus: boolean) => {
    setPharmacists((prev) =>
      prev.map((pharmacist) =>
        pharmacist.id === id
          ? { ...pharmacist, isActive: newStatus }
          : pharmacist
      )
    );
    
    toast({
      title: `Statut du pharmacien modifié`,
      description: `Le pharmacien a été ${newStatus ? 'activé' : 'désactivé'}.`,
    });
  };

  const handleViewDocument = (document: string, pharmacist: any) => {
    setSelectedDocument(document);
    setSelectedPharmacist(pharmacist);
    setIsViewerOpen(true);
  };

  const handleStatusChange = (id: string, isActive: boolean) => {
    setSelectedPharmacist(pharmacists.find(p => p.id === id));
    setIsDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (selectedPharmacist) {
      togglePharmacistStatus(selectedPharmacist.id, !selectedPharmacist.isActive);
    }
    setIsDialogOpen(false);
  };

  const filteredPharmacists = pharmacists.filter((pharmacist) => {
    const matchesSearch = 
      pharmacist.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacist.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacist.phone.includes(searchQuery);
    
    const matchesWilaya = selectedWilaya === "" || pharmacist.wilaya.includes(selectedWilaya);
    
    const matchesStatus = 
      statusFilter === "" || 
      (statusFilter === "active" && pharmacist.isActive) ||
      (statusFilter === "inactive" && !pharmacist.isActive);

    return matchesSearch && matchesWilaya && matchesStatus;
  });

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pharmaciens</h1>
            <p className="text-gray-500">Gérer les comptes des pharmaciens</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Pill className="h-5 w-5 text-pharmacy-dark" />
              <span className="text-lg font-medium text-pharmacy-dark">
                {filteredPharmacists.length} Pharmaciens
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
                  <SelectItem value="">Toutes les wilayas</SelectItem>
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
                  <SelectItem value="">Tous les statuts</SelectItem>
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
                  setSelectedWilaya("");
                  setStatusFilter("");
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
            <TableCaption>Liste des pharmaciens enregistrés sur la plateforme.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Wilaya</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPharmacists.map((pharmacist) => (
                <TableRow key={pharmacist.id}>
                  <TableCell className="font-medium">{pharmacist.businessName}</TableCell>
                  <TableCell>
                    <div>{pharmacist.phone}</div>
                    <div className="text-sm text-gray-500">{pharmacist.email}</div>
                  </TableCell>
                  <TableCell>{pharmacist.wilaya}</TableCell>
                  <TableCell>
                    {pharmacist.isActive ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Actif
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100">
                        En attente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(pharmacist.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(pharmacist.registerImageUrl, pharmacist)}
                      className="flex items-center text-gray-600 hover:text-pharmacy-dark"
                    >
                      <Eye size={16} className="mr-1" />
                      Registre
                    </Button>
                  </TableCell>
                  <TableCell>
                    {pharmacist.isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(pharmacist.id, false)}
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      >
                        <XCircle size={16} className="mr-1" />
                        Désactiver
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(pharmacist.id, true)}
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Activer
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {isViewerOpen && selectedPharmacist && (
          <DocumentsViewer
            isOpen={isViewerOpen}
            onClose={() => setIsViewerOpen(false)}
            documentUrl={selectedDocument}
            title={`Registre de commerce - ${selectedPharmacist.businessName}`}
            info={`Numéro: ${selectedPharmacist.registerNumber}`}
          />
        )}

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedPharmacist?.isActive
                  ? "Désactiver ce pharmacien ?"
                  : "Activer ce pharmacien ?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedPharmacist?.isActive
                  ? "Le pharmacien ne pourra plus se connecter ou utiliser la plateforme tant que son compte sera désactivé."
                  : "Le pharmacien pourra désormais se connecter et utiliser tous les services de la plateforme."}
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

export default AdminPharmacists;

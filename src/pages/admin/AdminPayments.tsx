
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PaymentReceiptNotification from "@/components/admin/PaymentReceiptNotification";

interface PaymentNotification {
  id: string;
  userName: string;
  userEmail?: string;
  userId?: string;
  userRole: "supplier";
  dateSubmitted: string;
  receiptUrl: string;
  amount?: string;
  status: "pending" | "approved" | "rejected";
}

const AdminPayments = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string>("");
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch notifications from API with user details
    setTimeout(() => {
      const mockNotifications: PaymentNotification[] = [
        {
          id: "1",
          userName: "MediStock Algérie",
          userEmail: "contact@medistock-dz.com",
          userId: "user_001",
          userRole: "supplier",
          dateSubmitted: "15 mai 2023",
          receiptUrl: "/placeholder.svg",
          amount: "25000",
          status: "pending"
        },
        {
          id: "2",
          userName: "PharmaDistrib",
          userEmail: "admin@pharmadistrib.dz",
          userId: "user_002",
          userRole: "supplier",
          dateSubmitted: "14 mai 2023",
          receiptUrl: "/placeholder.svg",
          amount: "15000",
          status: "pending"
        },
        {
          id: "3",
          userName: "PharmaSupply",
          userEmail: "info@pharmasupply.com",
          userId: "user_003",
          userRole: "supplier",
          dateSubmitted: "12 mai 2023",
          receiptUrl: "/placeholder.svg",
          amount: "10000",
          status: "approved"
        },
        {
          id: "4",
          userName: "MediCorp Algérie",
          userEmail: "contact@medicorp-dz.com",
          userId: "user_004",
          userRole: "supplier",
          dateSubmitted: "10 mai 2023",
          receiptUrl: "/placeholder.svg",
          amount: "25000",
          status: "rejected"
        },
        {
          id: "5",
          userName: "AlgériaPharma",
          userEmail: "admin@algeriapharma.dz",
          userId: "user_005",
          userRole: "supplier",
          dateSubmitted: "8 mai 2023",
          receiptUrl: "/placeholder.svg",
          amount: "15000",
          status: "approved"
        },
      ];
      
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewReceipt = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      setSelectedReceiptUrl(notification.receiptUrl);
      setViewingReceipt(id);
    }
  };

  const handleApprove = async (id: string) => {
    const notification = notifications.find(n => n.id === id);
    
    // Mise à jour de l'état local
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, status: "approved" } : notification
    ));
    
    toast({
      title: "Paiement fournisseur approuvé",
      description: `Le paiement de ${notification?.userName || 'l\'utilisateur'} (${notification?.userEmail}) a été approuvé avec succès.`,
    });
  };

  const handleReject = async (id: string) => {
    const notification = notifications.find(n => n.id === id);
    
    // Mise à jour de l'état local
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, status: "rejected" } : notification
    ));
    
    toast({
      title: "Paiement fournisseur rejeté",
      description: `Le paiement de ${notification?.userName || 'l\'utilisateur'} (${notification?.userEmail}) a été rejeté.`,
      variant: "destructive"
    });
  };

  // Filtrer les notifications selon l'onglet actif
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "pending") return notification.status === "pending";
    if (activeTab === "approved") return notification.status === "approved";
    if (activeTab === "rejected") return notification.status === "rejected";
    return true;
  });

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Gestion des Paiements Fournisseurs</h1>
        <p className="text-gray-600 mb-6">
          Gérez les bons de versement soumis par les fournisseurs pour activer leurs comptes d'abonnement.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              En attente {notifications.filter(n => n.status === "pending").length > 0 && 
                `(${notifications.filter(n => n.status === "pending").length})`
              }
            </TabsTrigger>
            <TabsTrigger value="approved">Approuvés</TabsTrigger>
            <TabsTrigger value="rejected">Rejetés</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {loading ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">Chargement des paiements fournisseurs...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">Aucun paiement fournisseur {
                  activeTab === "pending" ? "en attente" : 
                  activeTab === "approved" ? "approuvé" : "rejeté"
                } pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotifications.map((notification) => (
                  <PaymentReceiptNotification
                    key={notification.id}
                    id={notification.id}
                    userName={notification.userName}
                    userEmail={notification.userEmail}
                    userId={notification.userId}
                    userRole={notification.userRole}
                    dateSubmitted={notification.dateSubmitted}
                    receiptUrl={notification.receiptUrl}
                    amount={notification.amount}
                    onView={handleViewReceipt}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <Dialog open={viewingReceipt !== null} onOpenChange={(open) => !open && setViewingReceipt(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Aperçu du bon de versement</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <img 
                src={selectedReceiptUrl} 
                alt="Bon de versement" 
                className="w-full h-auto max-h-96 object-contain border rounded-md"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setViewingReceipt(null)}>
                Fermer
              </Button>
              {viewingReceipt && notifications.find(n => n.id === viewingReceipt)?.status === "pending" && (
                <>
                  <Button variant="destructive" onClick={() => {
                    handleReject(viewingReceipt);
                    setViewingReceipt(null);
                  }}>
                    Rejeter
                  </Button>
                  <Button onClick={() => {
                    handleApprove(viewingReceipt);
                    setViewingReceipt(null);
                  }}>
                    Approuver
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminPayments;

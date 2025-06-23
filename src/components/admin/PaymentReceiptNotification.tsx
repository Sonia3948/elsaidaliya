
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCheck, ExternalLink, Eye, User, Mail } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PaymentReceiptNotificationProps {
  id?: string;
  userName?: string;
  userEmail?: string;
  userId?: string;
  userRole?: "pharmacist" | "supplier";
  dateSubmitted?: string;
  receiptUrl?: string;
  amount?: string;
  onView?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  
  // New props
  isOpen?: boolean;
  onClose?: () => void;
  supplier?: any;
}

const PaymentReceiptNotification = ({ 
  id, 
  userName, 
  userEmail,
  userId,
  userRole, 
  dateSubmitted, 
  receiptUrl, 
  amount,
  onView, 
  onApprove, 
  onReject,
  isOpen,
  onClose,
  supplier
}: PaymentReceiptNotificationProps) => {
  const [loading, setLoading] = useState(false);

  // If using as a dialog and supplier is provided
  if (isOpen && supplier) {
    return (
      <Dialog open={isOpen} onOpenChange={() => onClose && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bon de versement - {supplier.businessName}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="border rounded-md overflow-hidden mb-4">
              <img 
                src="/placeholder.svg" 
                alt="Bon de versement" 
                className="w-full object-contain h-[200px]"
              />
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm"><span className="font-medium">Fournisseur:</span> {supplier.businessName}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {supplier.email || 'Non spécifié'}</p>
              <p className="text-sm"><span className="font-medium">Date:</span> {new Date().toLocaleDateString("fr-FR")}</p>
              <p className="text-sm"><span className="font-medium">Abonnement:</span> {supplier.subscription || "Non spécifié"}</p>
            </div>
            
            <div className="flex justify-between gap-4 mt-6">
              <Button 
                variant="destructive" 
                onClick={() => {
                  setLoading(true);
                  if (onReject) onReject(supplier.id);
                }} 
                disabled={loading}
              >
                Rejeter
              </Button>
              <Button 
                variant="default" 
                className="bg-pharmacy-accent hover:bg-pharmacy-dark" 
                onClick={() => {
                  setLoading(true);
                  if (onApprove) onApprove(supplier.id);
                }}
                disabled={loading}
              >
                {loading ? "Traitement..." : "Approuver"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Original card implementation for dashboard display with user info
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium flex items-center">
              <FileCheck className="mr-2 h-5 w-5 text-pharmacy-accent" />
              Nouveau bon de versement
            </CardTitle>
            <CardDescription>Soumis le {dateSubmitted}</CardDescription>
          </div>
          <Badge variant={userRole === "supplier" ? "default" : "outline"} className="capitalize">
            {userRole}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Informations utilisateur détaillées */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <User className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-medium">Nom:</span>
            <span className="ml-1">{userName || 'Non spécifié'}</span>
          </div>
          
          {userEmail && (
            <div className="flex items-center text-sm">
              <Mail className="mr-2 h-4 w-4 text-gray-500" />
              <span className="font-medium">Email:</span>
              <span className="ml-1">{userEmail}</span>
            </div>
          )}
          
          <p className="text-sm">
            <span className="font-medium">Type:</span> {userRole === "supplier" ? "Fournisseur" : "Pharmacien"}
          </p>
          
          {amount && (
            <p className="text-sm">
              <span className="font-medium">Montant:</span> {amount} DZD
            </p>
          )}
          
          {userId && (
            <p className="text-xs text-gray-500">
              <span className="font-medium">ID:</span> {userId}
            </p>
          )}
        </div>
        
        <Button variant="outline" size="sm" className="w-full" onClick={() => id && onView && onView(id)}>
          <Eye className="mr-1 h-4 w-4" /> Voir le reçu
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => id && onReject && onReject(id)} 
          disabled={loading}
        >
          Rejeter
        </Button>
        <Button 
          variant="default" 
          className="bg-pharmacy-accent hover:bg-pharmacy-dark" 
          size="sm" 
          onClick={() => id && onApprove && onApprove(id)}
          disabled={loading}
        >
          {loading ? "Traitement..." : "Approuver"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentReceiptNotification;


import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCheck, ExternalLink, Eye } from "lucide-react";
import { useState } from "react";

interface PaymentReceiptNotificationProps {
  id: string;
  userName: string;
  userRole: "pharmacist" | "supplier";
  dateSubmitted: string;
  receiptUrl: string;
  onView: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const PaymentReceiptNotification = ({ 
  id, 
  userName, 
  userRole, 
  dateSubmitted, 
  receiptUrl, 
  onView, 
  onApprove, 
  onReject 
}: PaymentReceiptNotificationProps) => {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await onApprove(id);
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await onReject(id);
    setLoading(false);
  };

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
        <p className="text-sm mb-1">
          <span className="font-medium">Nom:</span> {userName}
        </p>
        <p className="text-sm mb-3">
          <span className="font-medium">Type:</span> {userRole === "supplier" ? "Fournisseur" : "Pharmacien"}
        </p>
        
        <Button variant="outline" size="sm" className="w-full" onClick={() => onView(id)}>
          <Eye className="mr-1 h-4 w-4" /> Voir le reçu
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleReject} 
          disabled={loading}
        >
          Rejeter
        </Button>
        <Button 
          variant="default" 
          className="bg-pharmacy-accent hover:bg-pharmacy-dark" 
          size="sm" 
          onClick={handleApprove}
          disabled={loading}
        >
          {loading ? "Traitement..." : "Approuver"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentReceiptNotification;

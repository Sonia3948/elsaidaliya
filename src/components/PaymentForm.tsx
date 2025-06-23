
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, AlertTriangle, CreditCard, BadgeCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentFormProps {
  amount: number;
  userRole: "pharmacist" | "supplier";
  onSuccess: () => void;
  userName?: string;
  userEmail?: string;
  userId?: string;
}

const PaymentForm = ({ amount, userRole, onSuccess, userName, userEmail, userId }: PaymentFormProps) => {
  const { toast } = useToast();
  const [paymentType, setPaymentType] = useState<string>("virement");
  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.match('image.*') && !file.type.match('application/pdf')) {
        toast({
          title: "Format non supporté",
          description: "Veuillez télécharger une image (JPG, PNG) ou un PDF.",
          variant: "destructive"
        });
        return;
      }
      setSelectedReceipt(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (paymentType === "virement" && !selectedReceipt) {
      toast({
        title: "Document requis",
        description: "Veuillez télécharger votre bon de virement.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Simuler un appel API pour soumettre le paiement et notifier l'administrateur
    try {
      // Envoyer une notification à l'administrateur avec les informations utilisateur
      const notificationData = {
        type: 'payment_receipt',
        userRole: userRole,
        userName: userName || 'Utilisateur inconnu',
        userEmail: userEmail || '',
        userId: userId || '',
        paymentType: paymentType,
        amount: amount,
        description: `Paiement de ${amount} DZD soumis par ${userName || userEmail || 'Utilisateur inconnu'}`,
      };
      
      console.log('Sending payment notification with user info:', notificationData);
      
      // Dans un cas réel, nous enverrions le fichier et les données utilisateur à l'API
      // await fetch('/api/admin/notifications', {
      //   method: 'POST',
      //   body: JSON.stringify(notificationData),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoading(false);
      toast({
        title: "Paiement traité avec succès",
        description: userRole === "supplier" 
          ? `Paiement de ${userName || userEmail} enregistré. Veuillez patienter de 24h à 48h pour l'activation de votre compte.`
          : `Paiement de ${userName || userEmail} traité avec succès. Veuillez patienter pendant que l'administrateur valide votre inscription.`,
      });
      onSuccess();
    } catch (error) {
      setLoading(false);
      toast({
        title: "Erreur lors du traitement",
        description: "Une erreur s'est produite lors du traitement de votre paiement. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Afficher les informations utilisateur */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Informations de l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><span className="font-medium">Nom/Entreprise:</span> {userName || 'Non spécifié'}</p>
            <p><span className="font-medium">Email:</span> {userEmail || 'Non spécifié'}</p>
            <p><span className="font-medium">Type:</span> {userRole === "supplier" ? "Fournisseur" : "Pharmacien"}</p>
            <p><span className="font-medium">Montant:</span> {amount} DZD</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="virement" value={paymentType} onValueChange={setPaymentType}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="virement">Virement Bancaire</TabsTrigger>
          <TabsTrigger value="card">Carte Bancaire</TabsTrigger>
        </TabsList>
        
        <TabsContent value="virement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Détails du Virement</CardTitle>
              <CardDescription>
                Veuillez effectuer un virement bancaire avec les informations suivantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank">Banque</Label>
                  <Input id="bank" value="BNA Agence 543" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Numéro de compte</Label>
                  <Input id="account" value="0003 00054 3254789632 41" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant</Label>
                  <Input id="amount" value={`${amount} DZD`} readOnly className="bg-gray-50" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receipt">Bon de virement</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                  <FileUp className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    Déposez votre reçu de virement ici ou cliquez pour parcourir
                  </p>
                  <Input id="receipt" type="file" className="max-w-xs" onChange={handleFileChange} />
                </div>
              </div>
              
              {receiptPreviewUrl && (
                <div>
                  <Label>Aperçu</Label>
                  <div className="mt-2 border rounded-md overflow-hidden">
                    {selectedReceipt?.type.match('image.*') ? (
                      <img 
                        src={receiptPreviewUrl} 
                        alt="Aperçu du reçu" 
                        className="max-h-40 object-contain mx-auto"
                      />
                    ) : (
                      <div className="p-4 bg-gray-100 text-center">
                        Document PDF sélectionné
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Information importante</AlertTitle>
                <AlertDescription>
                  {userRole === "supplier" 
                    ? "Après soumission de votre paiement, veuillez patienter de 24h à 48h pour l'activation de votre compte. Vous pourrez profiter de votre semaine gratuite dès l'activation par un administrateur."
                    : "Après soumission de votre paiement, veuillez patienter pendant que l'administrateur vérifie et active votre compte."}
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Traitement en cours..." : "Soumettre le paiement"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="card" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paiement par Carte Bancaire</CardTitle>
              <CardDescription>
                Entrez les détails de votre carte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                <CreditCard className="h-4 w-4" />
                <AlertTitle>Service temporairement indisponible</AlertTitle>
                <AlertDescription>
                  Le paiement par carte bancaire n'est pas disponible pour le moment. 
                  Veuillez effectuer un virement bancaire à la place.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="cardname">Nom sur la carte</Label>
                <Input id="cardname" placeholder="Nom complet" disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardnumber">Numéro de carte</Label>
                <Input id="cardnumber" placeholder="1234 5678 9012 3456" disabled />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Date d'expiration</Label>
                  <Input id="expiry" placeholder="MM/YY" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" disabled />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="button" className="w-full" disabled>
                Paiement non disponible
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default PaymentForm;

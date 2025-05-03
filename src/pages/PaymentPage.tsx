
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Wallet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const PaymentPage = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const [paymentType, setPaymentType] = useState<"monthly" | "yearly">("monthly");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [transferReceipt, setTransferReceipt] = useState<File | null>(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const offerDetails = {
    bronze: {
      title: "Offre Bronze",
      description: "Accès standard à la plateforme Elsaidaliya",
      monthlyPrice: "10 000 DZ",
      yearlyPrice: "100 000 DZ",
      features: ["Visibilité dans les résultats de recherche", "Une semaine d'essai gratuite", "Accès à toutes les fonctionnalités de base"]
    },
    silver: {
      title: "Offre Argent",
      description: "Visibilité améliorée pour votre entreprise",
      monthlyPrice: "15 000 DZ",
      yearlyPrice: "150 000 DZ",
      features: ["Mise en avant dans les résultats de recherche", "Notification aux pharmaciens pour les nouveaux produits", "Une semaine d'essai gratuite", "Support prioritaire"]
    },
    gold: {
      title: "Offre Or",
      description: "Visibilité maximale et fonctionnalités premium",
      monthlyPrice: "25 000 DZ",
      yearlyPrice: "250 000 DZ",
      features: ["Priorité maximale dans les résultats", "Mise à jour quotidienne des listings", "Notifications aux pharmaciens pour les nouveaux produits", "Annonces sur la page d'accueil", "Newsletter mensuelle aux pharmaciens"]
    }
  };

  const offer = offerId === 'gold' ? offerDetails.gold : offerId === 'silver' ? offerDetails.silver : offerDetails.bronze;

  const handlePayment = () => {
    if (paymentMethod === "bank" && !transferReceipt) {
      toast.error("Veuillez téléverser le bon de virement");
      return;
    }

    // Handle the payment process
    console.log(`Traitement du paiement pour l'offre ${offerId} (${paymentType}) via ${paymentMethod}`);
    
    // If there's a transfer receipt, we would upload it here in a real implementation
    if (transferReceipt) {
      console.log("Téléversement du bon de virement:", transferReceipt.name);
      // In a real app, we would upload the file to the backend here
    }

    toast.success("Votre demande d'abonnement a été enregistrée avec succès");
    toast.info("Veuillez patienter 24 à 48 heures pour l'activation de votre compte");
    
    // Redirect to the success page after a short delay
    setTimeout(() => {
      window.location.href = "/payment-success";
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTransferReceipt(e.target.files[0]);
    }
  };

  const ribDetails = {
    bank: "Banque Nationale d'Algérie (BNA)",
    accountName: "Elsaidaliya SARL",
    rib: "007 00076 0300000266 80",
    swift: "BNAADZALXXX",
    address: "123 Boulevard Mohammed V, Alger, Algérie"
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/" className="flex items-center text-pharmacy hover:underline">
            <ArrowLeft size={16} className="mr-1" />
            Retour à l'accueil
          </Link>
        </div>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{offer.title}</h1>
          <p className="text-gray-600 mt-2">{offer.description}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Résumé de l'abonnement</CardTitle>
                <CardDescription>Détails de l'offre sélectionnée</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="monthly" onValueChange={value => setPaymentType(value as "monthly" | "yearly")}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="monthly">Mensuel</TabsTrigger>
                    <TabsTrigger value="yearly">Annuel</TabsTrigger>
                  </TabsList>
                  <TabsContent value="monthly">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">Prix</h3>
                        <p className="text-2xl font-bold text-pharmacy-dark">{offer.monthlyPrice}</p>
                        <p className="text-sm text-gray-500">Facturation mensuelle</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="yearly">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">Prix</h3>
                        <p className="text-2xl font-bold text-pharmacy-dark">{offer.yearlyPrice}</p>
                        <p className="text-sm text-gray-500">Facturation annuelle (économisez 16%)</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Fonctionnalités incluses:</h3>
                  <ul className="space-y-2">
                    {offer.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-pharmacy-light flex items-center justify-center mt-0.5">
                          <span className="text-pharmacy-dark font-bold text-xs">✓</span>
                        </div>
                        <p className="ml-2 text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Méthode de paiement</CardTitle>
                <CardDescription>Choisissez votre méthode de paiement préférée</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="card" className="space-y-4" onValueChange={value => setPaymentMethod(value as "card" | "bank")}>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Carte bancaire</Label>
                    <CreditCard className="ml-auto" size={20} />
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">Virement bancaire</Label>
                    <Wallet className="ml-auto" size={20} />
                  </div>
                </RadioGroup>
                
                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        <span className="font-bold">Important:</span> Le paiement par carte bancaire n'est pas disponible pour le moment. Veuillez utiliser le virement bancaire.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input 
                          id="cardNumber" 
                          placeholder="1234 5678 9012 3456" 
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardHolder">Titulaire de la carte</Label>
                        <Input 
                          id="cardHolder" 
                          placeholder="Nom complet" 
                          value={cardDetails.cardHolder}
                          onChange={(e) => setCardDetails({...cardDetails, cardHolder: e.target.value})}
                          disabled
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Date d'expiration</Label>
                          <Input 
                            id="expiryDate" 
                            placeholder="MM/AA" 
                            value={cardDetails.expiryDate}
                            onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                            disabled
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input 
                            id="cvv" 
                            placeholder="123" 
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === "bank" && (
                  <div className="mt-6 p-4 bg-pharmacy-light bg-opacity-20 rounded-md">
                    <h3 className="font-semibold mb-2">Coordonnées bancaires:</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Banque:</span> {ribDetails.bank}</p>
                      <p><span className="font-semibold">Nom du compte:</span> {ribDetails.accountName}</p>
                      <p><span className="font-semibold">RIB:</span> {ribDetails.rib}</p>
                      <p><span className="font-semibold">Code SWIFT:</span> {ribDetails.swift}</p>
                      <p><span className="font-semibold">Adresse:</span> {ribDetails.address}</p>
                    </div>
                    
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        <span className="font-bold">Important:</span> Après avoir effectué votre virement, veuillez téléverser le bon de virement ci-dessous et nous envoyer une confirmation par email à finance@elsaidaliya.dz avec votre numéro de référence.
                      </p>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <Label htmlFor="transferReceipt">Bon de virement (obligatoire)</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="transferReceipt" 
                          type="file" 
                          onChange={handleFileChange}
                          className="max-w-md"
                        />
                        {transferReceipt && (
                          <span className="text-green-600 text-sm">
                            Fichier sélectionné: {transferReceipt.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Formats acceptés: PDF, JPG, PNG. Taille max: 5MB
                      </p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="mt-4 bg-white">
                          Afficher RIB complet
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Relevé d'Identité Bancaire (RIB)</DialogTitle>
                          <DialogDescription>
                            Utilisez ces coordonnées pour effectuer votre virement bancaire.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="p-4 border rounded-md bg-gray-50 font-mono text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-semibold">Banque:</div>
                            <div>{ribDetails.bank}</div>
                            <div className="font-semibold">Nom du compte:</div>
                            <div>{ribDetails.accountName}</div>
                            <div className="font-semibold">RIB:</div>
                            <div className="break-all">{ribDetails.rib}</div>
                            <div className="font-semibold">Code SWIFT:</div>
                            <div>{ribDetails.swift}</div>
                            <div className="font-semibold">Adresse:</div>
                            <div>{ribDetails.address}</div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                
                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold">Délai d'activation</h3>
                  <p className="text-sm text-gray-600">
                    Après réception de votre paiement, votre compte sera activé dans un délai de 24 à 48 heures. Vous pourrez ensuite profiter d'une semaine d'essai gratuite.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handlePayment} 
                  className="w-full bg-pharmacy-accent rounded-xl"
                >
                  {paymentMethod === "card" ? "Procéder au paiement" : "Confirmer la commande"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;

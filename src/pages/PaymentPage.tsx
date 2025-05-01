
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";

const PaymentPage = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const [paymentType, setPaymentType] = useState<"monthly" | "yearly">("monthly");
  
  const offerDetails = {
    bronze: {
      title: "Offre Bronze",
      description: "Accès standard à la plateforme Elsaidaliya",
      monthlyPrice: "10 000 DZ",
      yearlyPrice: "100 000 DZ",
      features: [
        "Visibilité dans les résultats de recherche",
        "Une semaine d'essai gratuite",
        "Accès à toutes les fonctionnalités de base"
      ]
    },
    silver: {
      title: "Offre Argent",
      description: "Visibilité améliorée pour votre entreprise",
      monthlyPrice: "15 000 DZ",
      yearlyPrice: "150 000 DZ",
      features: [
        "Mise en avant dans les résultats de recherche",
        "Notification aux pharmaciens pour les nouveaux produits",
        "Une semaine d'essai gratuite",
        "Support prioritaire"
      ]
    },
    gold: {
      title: "Offre Or",
      description: "Visibilité maximale et fonctionnalités premium",
      monthlyPrice: "25 000 DZ",
      yearlyPrice: "250 000 DZ",
      features: [
        "Priorité maximale dans les résultats",
        "Mise à jour quotidienne des listings",
        "Notifications aux pharmaciens pour les nouveaux produits",
        "Annonces sur la page d'accueil",
        "Newsletter mensuelle aux pharmaciens"
      ]
    }
  };

  const offer = offerId === 'gold' 
    ? offerDetails.gold 
    : offerId === 'silver' 
      ? offerDetails.silver 
      : offerDetails.bronze;

  const handlePayment = () => {
    // Ici nous pourrions implémenter l'intégration avec une passerelle de paiement
    console.log(`Traitement du paiement pour l'offre ${offerId} (${paymentType})`);
    // Redirection vers la page de succès de paiement
    window.location.href = "/payment-success";
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
                <Tabs defaultValue="monthly" onValueChange={(value) => setPaymentType(value as "monthly" | "yearly")}>
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
                <RadioGroup defaultValue="card" className="space-y-4">
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Carte bancaire</Label>
                    <CreditCard className="ml-auto" size={20} />
                  </div>
                </RadioGroup>
                
                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold">Détails de facturation</h3>
                  <p className="text-sm text-gray-600">
                    Votre abonnement commencera immédiatement après la confirmation du paiement, avec une semaine d'essai gratuite.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handlePayment}
                  className="w-full bg-pharmacy-dark hover:bg-pharmacy"
                >
                  Procéder au paiement
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

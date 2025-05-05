
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, addMonths } from "date-fns";
import { Trophy, Medal, Award } from "lucide-react";
import { toast } from "sonner";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  icon: React.FC<{ className?: string }>;
  iconColor: string;
  badgeColor: string;
  popular?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: 5000,
    features: [
      "Accès aux listings de base",
      "Publication d'offres limitée (5 par mois)",
      "Support par email",
      "Visibilité standard"
    ],
    icon: Award,
    iconColor: "text-amber-700",
    badgeColor: "bg-amber-700"
  },
  {
    id: "argent",
    name: "Argent",
    price: 8000,
    features: [
      "Listings prioritaires",
      "Publication d'offres illimitée",
      "Support prioritaire",
      "Statistiques de base",
      "Mise en avant dans les résultats de recherche"
    ],
    icon: Medal,
    iconColor: "text-gray-400",
    badgeColor: "bg-gray-400",
    popular: true
  },
  {
    id: "or",
    name: "Or",
    price: 12000,
    features: [
      "Listings en première position",
      "Publication d'offres illimitée",
      "Support dédié 24/7",
      "Statistiques avancées",
      "Tableau de bord premium",
      "Notifications aux pharmaciens pour les nouveaux listings",
      "Mises à jour par SMS aux pharmaciens abonnés"
    ],
    icon: Trophy,
    iconColor: "text-yellow-500",
    badgeColor: "bg-yellow-500"
  }
];

const SupplierSubscription = () => {
  const navigate = useNavigate();
  const [currentSubscription, setCurrentSubscription] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from the backend
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        setCurrentSubscription("bronze");
        setExpiryDate(addMonths(new Date(), 2)); // Mock expiry date (2 months from now)
      } catch (error) {
        console.error("Error fetching subscription status:", error);
        toast.error("Erreur lors de la récupération de votre abonnement");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handleUpgrade = (planId: string) => {
    navigate(`/payment/${planId}`);
  };

  const getCurrentPlan = () => {
    return subscriptionPlans.find(plan => plan.id === currentSubscription);
  };

  const getSubscriptionBadge = (subscription: string | null) => {
    if (!subscription) return null;
    
    const plan = subscriptionPlans.find(p => p.id === subscription);
    if (!plan) return null;

    return (
      <Badge className={`${plan.badgeColor} flex items-center gap-1`}>
        <plan.icon className="h-3 w-3" />
        {plan.name}
      </Badge>
    );
  };

  const currentPlan = getCurrentPlan();

  return (
    <DashboardLayout userRole="supplier">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion de l'abonnement</h1>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Votre abonnement actuel</CardTitle>
                <CardDescription>
                  Détails de votre abonnement en cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex flex-col space-y-2 mb-4 md:mb-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-lg">Niveau:</span>
                      <div className="flex items-center space-x-2">
                        {currentPlan && (
                          <>
                            <currentPlan.icon className={`h-5 w-5 ${currentPlan.iconColor}`} />
                            <span className="font-bold text-lg">{currentPlan?.name}</span>
                            {getSubscriptionBadge(currentSubscription)}
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold">Expire le:</span> {expiryDate ? format(expiryDate, 'dd/MM/yyyy') : 'N/A'}
                    </div>
                    {currentPlan && (
                      <div>
                        <span className="font-semibold">Prix:</span> {currentPlan.price.toLocaleString()} DZD/mois
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto"
                    onClick={() => navigate('/supplier/profile')}
                  >
                    Voir historique des paiements
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Mettre à niveau votre abonnement</h2>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                {subscriptionPlans.map((plan) => (
                  <Card key={plan.id} className={`flex flex-col h-full relative overflow-hidden ${plan.popular ? 'border-blue-500 border-2' : ''}`}>
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 transform translate-x-8 translate-y-4 rotate-45">
                        Populaire
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <plan.icon className={`h-6 w-6 ${plan.iconColor}`} />
                            <CardTitle>{plan.name}</CardTitle>
                          </div>
                          <CardDescription>
                            {plan.id === currentSubscription ? "Votre forfait actuel" : "Mettez à niveau pour plus d'avantages"}
                          </CardDescription>
                        </div>
                        <Badge className={plan.badgeColor}>{plan.name}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4 pt-0 flex-grow">
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{plan.price.toLocaleString()}</span>
                        <span className="text-slate-600"> DZD/mois</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        variant={plan.id === currentSubscription ? "outline" : "default"}
                        disabled={plan.id === currentSubscription}
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        {plan.id === currentSubscription ? "Forfait actuel" : "Mettre à niveau"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SupplierSubscription;

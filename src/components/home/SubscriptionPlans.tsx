
import { Trophy, Medal, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const subscriptionPlans = [
  {
    id: "bronze",
    title: "Bronze",
    price: "5,000",
    duration: "mois",
    icon: Award,
    iconColor: "text-amber-700",
    features: [
      "Accès aux listings de base",
      "Publication d'offres limitée",
      "Support par email"
    ],
    buttonText: "Choisir Bronze"
  },
  {
    id: "argent",
    title: "Argent",
    price: "8,000",
    duration: "mois",
    icon: Medal,
    iconColor: "text-gray-400",
    popular: true,
    features: [
      "Listings prioritaires",
      "Publication d'offres illimitée",
      "Support prioritaire",
      "Statistiques de base"
    ],
    buttonText: "Choisir Argent"
  },
  {
    id: "or",
    title: "Or",
    price: "12,000",
    duration: "mois",
    icon: Trophy,
    iconColor: "text-yellow-500",
    features: [
      "Listings en première position",
      "Publication d'offres illimitée",
      "Support dédié 24/7",
      "Statistiques avancées",
      "Tableau de bord premium"
    ],
    buttonText: "Choisir Or"
  }
];

const SubscriptionPlans = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check user role from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role);
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  // If user is a pharmacist, don't show subscription plans
  if (userRole === "pharmacist") {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Bienvenue sur Elsaidaliya
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              En tant que pharmacien, votre inscription est gratuite ! Aucun abonnement n'est nécessaire.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/pharmacist/dashboard">
                  Accéder à votre tableau de bord
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choisissez votre plan d'abonnement
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Solutions adaptées pour les fournisseurs de produits pharmaceutiques
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} className="flex flex-col h-full border shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 transform translate-x-8 translate-y-4 rotate-45">
                  Populaire
                </div>
              )}
              <CardHeader className={`text-center pb-8 ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                <div className="mx-auto rounded-full p-3 bg-primary-50 mb-4 w-16 h-16 flex items-center justify-center">
                  <plan.icon className={`h-8 w-8 ${plan.iconColor}`} />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                <div className="flex items-center justify-center mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-2 text-gray-500">DZD/{plan.duration}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Button asChild className="w-full">
                  <Link to={`/payment/${plan.id}`}>
                    {plan.buttonText}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;

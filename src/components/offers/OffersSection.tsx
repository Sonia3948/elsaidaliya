import React from "react";
import { Trophy, Medal, Award } from "lucide-react";
import OfferCard from "./OfferCard";
const OffersSection = () => {
  return <section className="py-12 md:py-20 bg-pharmacy-lightGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos offres pour les fournisseurs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choisissez l'offre qui convient le mieux à vos besoins et maximisez votre visibilité auprès des pharmaciens.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative py-0">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 p-3 border-4 border-white shadow-md rounded-full py-0 px-0 my-[20px] mx-[60px] bg-[#8c6239]">
              <Award size={30} className="text-pharmacy-dark" />
            </div>
            <OfferCard title="Offre Bronze" priceMonthly="10 000 DZ" priceYearly="100 000 DZ" features={["Visibilité dans les résultats de recherche", "Une semaine d'essai gratuite", "Accès à toutes les fonctionnalités de base"]} offerId="bronze" />
          </div>
          
          <div className="relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pharmacy-light rounded-full p-3 border-4 border-white shadow-md">
              <Medal size={30} className="text-pharmacy-dark" />
            </div>
            <OfferCard title="Offre Argent" priceMonthly="15 000 DZ" priceYearly="150 000 DZ" features={["Mise en avant dans les résultats de recherche", "Notification aux pharmaciens pour les nouveaux produits", "Une semaine d'essai gratuite", "Support prioritaire"]} highlighted offerId="silver" />
          </div>
          
          <div className="relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 rounded-full p-3 border-4 border-white shadow-md">
              <Trophy size={30} className="text-white" />
            </div>
            <OfferCard title="Offre Or" priceMonthly="25 000 DZ" priceYearly="250 000 DZ" features={["Priorité maximale dans les résultats", "Mise à jour quotidienne des listings", "Notifications aux pharmaciens pour les nouveaux produits", "Annonces sur la page d'accueil", "Newsletter mensuelle aux pharmaciens"]} offerId="gold" />
          </div>
        </div>
      </div>
    </section>;
};
export default OffersSection;
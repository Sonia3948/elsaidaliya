
import React from "react";
import OfferCard from "./OfferCard";

const OffersSection = () => {
  return (
    <section className="py-12 md:py-20 bg-pharmacy-lightGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos offres pour les fournisseurs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choisissez l'offre qui convient le mieux à vos besoins et maximisez votre visibilité auprès des pharmaciens.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <OfferCard 
            title="Offre Bronze" 
            priceMonthly="10 000 DZ" 
            priceYearly="100 000 DZ"
            features={[
              "Visibilité dans les résultats de recherche",
              "Une semaine d'essai gratuite",
              "Accès à toutes les fonctionnalités de base"
            ]}
            offerId="bronze"
          />
          
          <OfferCard 
            title="Offre Argent" 
            priceMonthly="15 000 DZ" 
            priceYearly="150 000 DZ"
            features={[
              "Mise en avant dans les résultats de recherche",
              "Notification aux pharmaciens pour les nouveaux produits",
              "Une semaine d'essai gratuite",
              "Support prioritaire"
            ]}
            highlighted
            offerId="silver"
          />
          
          <OfferCard 
            title="Offre Or" 
            priceMonthly="25 000 DZ" 
            priceYearly="250 000 DZ"
            features={[
              "Priorité maximale dans les résultats",
              "Mise à jour quotidienne des listings",
              "Notifications aux pharmaciens pour les nouveaux produits",
              "Annonces sur la page d'accueil",
              "Newsletter mensuelle aux pharmaciens"
            ]}
            offerId="gold"
          />
        </div>
      </div>
    </section>
  );
};

export default OffersSection;

import React from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
interface FeatureProps {
  text: string;
}
const Feature: React.FC<FeatureProps> = ({
  text
}) => <div className="flex items-start mb-2">
    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-pharmacy-light flex items-center justify-center mt-0.5">
      <Check className="h-3 w-3 text-pharmacy-dark" />
    </div>
    <p className="ml-2 text-gray-700">{text}</p>
  </div>;
interface OfferCardProps {
  title: string;
  priceMonthly: string;
  priceYearly: string;
  features: string[];
  highlighted?: boolean;
  offerId: "bronze" | "silver" | "gold";
}
const OfferCard: React.FC<OfferCardProps> = ({
  title,
  priceMonthly,
  priceYearly,
  features,
  highlighted = false,
  offerId
}) => {
  return <Card className="bg-white rounded-lg">
      {highlighted && <div className="bg-pharmacy-dark text-center px-0 mx-0 py-0">
          
        </div>}
      <CardHeader className="bg-pharmacy-light py-[15px] px-0 mx-0 my-0">
        <CardTitle className="text-xl font-bold text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 bg-white py-[10px]">
        <div className="text-center mb-4">
          <p className="text-2xl font-bold text-gray-800">{priceMonthly} <span className="text-sm font-normal">/ mois</span></p>
          <p className="text-sm text-gray-600">ou {priceYearly} / an</p>
        </div>
        <div className="space-y-1 mt-4">
          {features.map((feature, index) => <Feature key={index} text={feature} />)}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/payment/${offerId}`} className="w-full">
          <Button className={`w-full ${highlighted ? "bg-pharmacy-dark hover:bg-pharmacy" : "bg-pharmacy hover:bg-pharmacy-dark"}`}>
            Choisir cette offre
          </Button>
        </Link>
      </CardFooter>
    </Card>;
};
export default OfferCard;
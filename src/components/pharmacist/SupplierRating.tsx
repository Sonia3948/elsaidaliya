
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SupplierRatingProps {
  supplierId: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
}

const SupplierRating = ({ supplierId, initialRating = 0, onRatingChange }: SupplierRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRating = async (selectedRating: number) => {
    if (selectedRating === rating) {
      return; // No change
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to save rating
      await new Promise(resolve => setTimeout(resolve, 500));

      setRating(selectedRating);
      if (onRatingChange) {
        onRatingChange(selectedRating);
      }

      toast({
        title: "Note enregistrée",
        description: `Vous avez attribué une note de ${selectedRating}/5 à ce fournisseur.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre note.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center mb-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            disabled={isSubmitting}
            className="p-1 h-auto"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRating(star)}
          >
            <Star
              size={24}
              className={`
                ${(hoveredRating >= star || rating >= star) 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-300"}
              `}
            />
          </Button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating}/5` : "Pas encore noté"}
        </span>
      </div>
    </div>
  );
};

export default SupplierRating;

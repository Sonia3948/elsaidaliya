
import { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingSystemProps {
  initialRating?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const RatingSystem = ({ 
  initialRating = 0, 
  readonly = false, 
  size = 'md', 
  onRatingChange,
  className 
}: RatingSystemProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (selectedRating: number) => {
    if (readonly) return;
    setRating(selectedRating);
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const iconSize = sizeClasses[size];
  
  return (
    <div 
      className={cn("flex items-center", 
        readonly ? "" : "cursor-pointer",
        className
      )}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const displayRating = hoverRating || rating;
        const isHalfStar = displayRating - star + 0.5 === 0;
        
        return (
          <div 
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            className="relative"
          >
            {isHalfStar ? (
              <StarHalf 
                className={cn(iconSize, "text-yellow-400")} 
                fill="currentColor"
              />
            ) : (
              <Star 
                className={cn(iconSize, 
                  displayRating >= star ? "text-yellow-400" : "text-gray-300"
                )} 
                fill={displayRating >= star ? "currentColor" : "none"}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RatingSystem;

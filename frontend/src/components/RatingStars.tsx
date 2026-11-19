'use client';

interface RatingStarsProps {
  rating: number;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function RatingStars({ rating, readonly = true, onRatingChange }: RatingStarsProps) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange?.(star)}
          className={`text-2xl transition-colors ${
            star <= rating ? 'text-yellow-400' : 'text-[#45A29E]'
          } ${readonly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-400'}`}
        >
          ★
        </button>
      ))}
      <span className="text-sm font-bold text-[#FFFFFF] ml-2">{rating}/10</span>
    </div>
  );
}

import { Star } from 'lucide-react';

interface RatingStarsProps {
  value?: number | null;
  editable?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  size?: number;
  className?: string;
}

export const RatingStars = ({
  value,
  editable = false,
  onChange,
  showValue = true,
  size = 18,
  className = '',
}: RatingStarsProps) => {
  const safeValue = typeof value === 'number' && value > 0
    ? Math.min(5, Math.max(0, Math.round(value)))
    : 0;

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            disabled={!editable}
            onClick={() => editable && onChange?.(star)}
            aria-label={`Rate ${star} out of 5`}
            className={editable ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star
              size={size}
              className={star <= safeValue ? 'fill-[#F5B942] text-[#F5B942]' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>

      {showValue && (
        <span className="text-sm font-medium text-gray-700">
          {safeValue > 0 ? `${safeValue}/5` : editable ? 'Not rated yet' : 'Pending'}
        </span>
      )}
    </div>
  );
};

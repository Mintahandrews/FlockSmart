import { useState } from 'react';
import { useIntegrity } from '../../contexts/IntegrityContext';
import { Star, StarOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  serviceId: string;
  providerId: string;
  onReviewSubmitted?: () => void;
}

const ReviewForm = ({ serviceId, providerId, onReviewSubmitted }: ReviewFormProps) => {
  const { addReview } = useIntegrity();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please provide a comment');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { user } = JSON.parse(localStorage.getItem('user') || '{}');
      const reviewerId = user?.id;

      if (!reviewerId) {
        throw new Error('User must be logged in to leave a review');
      }

      await addReview({
        serviceId,
        providerId,
        reviewerId,
        rating,
        comment: comment.trim()
      });

      toast.success('Review submitted successfully');
      setRating(0);
      setComment('');
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        Leave a Review
      </h3>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-xl focus:outline-none transition-colors"
              >
                {(hoverRating || rating) >= star ? (
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                ) : (
                  <StarOff className="h-6 w-6 text-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience working with this provider..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md ${
            isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;

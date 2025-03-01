import { useIntegrity } from '../../contexts/IntegrityContext';
import { MessageSquare, Star, User } from 'lucide-react';

interface ReviewsListProps {
  providerId?: string;
  serviceId?: string;
}

const ReviewsList = ({ providerId, serviceId }: ReviewsListProps) => {
  const { getUserReviews, getServiceReviews } = useIntegrity();
  
  // Get reviews based on the provided props
  const reviews = providerId 
    ? getUserReviews(providerId)
    : serviceId 
      ? getServiceReviews(serviceId)
      : [];
  
  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get reviewer name from users in localStorage
  const getReviewerName = (reviewerId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const reviewer = users.find((u: any) => u.id === reviewerId);
    return reviewer ? reviewer.name : 'Anonymous User';
  };
  
  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <MessageSquare className="mx-auto text-gray-400 mb-2" size={24} />
        <p className="text-gray-600">No reviews yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">
        Reviews ({reviews.length})
      </h3>
      
      <div className="divide-y divide-gray-200">
        {sortedReviews.map((review) => (
          <div key={review.id} className="py-4">
            <div className="flex items-start">
              <div className="bg-indigo-100 rounded-full p-2 mr-3">
                <User size={20} className="text-indigo-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium text-gray-800">
                    {getReviewerName(review.reviewerId)}
                  </h4>
                  <span className="text-gray-500 text-sm">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;

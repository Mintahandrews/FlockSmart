import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useIntegrity } from '../../contexts/IntegrityContext';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Calendar, GraduationCap, MessageSquare, Star } from 'lucide-react';
import ReviewsList from '../../components/integrity/ReviewsList';

const TutorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { getAverageRating } = useIntegrity();
  const { user } = useAuth();
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundTutor = users.find((u: any) => u.id === id && u.role === 'provider');
      
      if (foundTutor) {
        const rating = getAverageRating(foundTutor.id);
        
        setTutor({
          ...foundTutor,
          rating: rating || (Math.random() * 2 + 3), // Random between 3-5 if no ratings
          completedSessions: Math.floor(Math.random() * 50), // Random sessions between 0-50
          image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
          availability: [
            {day: 'Monday', times: '3:00 PM - 8:00 PM'},
            {day: 'Wednesday', times: '4:00 PM - 9:00 PM'},
            {day: 'Saturday', times: '10:00 AM - 5:00 PM'}
          ],
          hourlyRate: Math.floor(Math.random() * 30) + 20 // Random rate between $20-$50
        });
      } else {
        setError('Tutor not found');
      }
    } catch (error) {
      console.error("Error loading tutor:", error);
      setError('Failed to load tutor information');
    } finally {
      setLoading(false);
    }
  }, [id, getAverageRating]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error || !tutor) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <GraduationCap className="mx-auto text-gray-400 mb-3" size={48} />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{error || 'Tutor not found'}</h2>
        <p className="text-gray-500 mb-4">We couldn't find the tutor you're looking for.</p>
        <Link to="/tutors" className="text-indigo-600 hover:text-indigo-800">
          Back to tutor directory
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/tutors" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to tutor directory
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-indigo-50 p-6 flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
              {tutor.image ? (
                <img 
                  src={tutor.image} 
                  alt={tutor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-3xl">
                  {tutor.name.charAt(0)}
                </div>
              )}
            </div>
            
            <h1 className="text-xl font-bold text-gray-800 mb-1 text-center">{tutor.name}</h1>
            
            <p className="text-sm text-gray-600 mb-3 flex items-center justify-center">
              <GraduationCap size={14} className="mr-1" />
              {tutor.profile?.university || 'University not specified'}
            </p>
            
            <div className="flex items-center mb-3">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    fill={i < Math.floor(tutor.rating) ? 'currentColor' : 'none'} 
                    size={16} 
                    className={i < Math.floor(tutor.rating) ? 'text-amber-500' : 'text-gray-300'}
                  />
                ))}
                <span className="ml-1 text-sm text-gray-600">{tutor.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 text-center text-sm">
              <span className="font-medium">${tutor.hourlyRate}</span>/hour
            </p>
            
            {user && user.id !== tutor.id && (
              <Link 
                to={`/messages/${tutor.id}`}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 w-full text-center flex items-center justify-center"
              >
                <MessageSquare size={16} className="mr-2" />
                Contact Tutor
              </Link>
            )}
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
              <p className="text-gray-600">
                {tutor.profile?.bio || 'No bio available for this tutor.'}
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {tutor.profile?.skills?.map((skill: string, idx: number) => (
                  <span key={idx} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                )) || <p className="text-gray-500">No skills specified</p>}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Education</h2>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium">{tutor.profile?.university || 'University not specified'}</p>
                <p className="text-gray-600 text-sm">{tutor.profile?.major || 'Major not specified'}</p>
                {tutor.profile?.graduationYear && (
                  <p className="text-gray-500 text-sm">Class of {tutor.profile.graduationYear}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <Calendar size={18} className="mr-2 text-indigo-600" />
                Availability
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tutor.availability?.map((slot: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                    <span className="font-medium">{slot.day}:</span> {slot.times}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Experience</h2>
              <p className="text-gray-600 flex items-center">
                <span className="font-medium mr-2">{tutor.completedSessions}</span> 
                tutoring sessions completed
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Reviews & Ratings</h2>
          <ReviewsList providerId={tutor.id} />
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;

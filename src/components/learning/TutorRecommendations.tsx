import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight, BookOpen, Filter, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface TutorProps {
  id: string;
  name: string;
  university?: string;
  major?: string;
  rating: number;
  subjects: string[];
  completedSessions: number;
  image?: string;
}

interface TutorRecommendationsProps {
  subject?: string;
  limit?: number;
}

const TutorRecommendations = ({ subject, limit = 4 }: TutorRecommendationsProps) => {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<TutorProps[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<TutorProps[]>([]);
  const [subjectFilter, setSubjectFilter] = useState(subject || '');
  const [loading, setLoading] = useState(true);

  // Common subjects for filtering
  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'Computer Science', 'Engineering', 'Literature',
    'History', 'Economics', 'Business', 'Psychology'
  ];

  // Fetch tutors from local storage/mock data
  useEffect(() => {
    setLoading(true);
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Filter for providers with profile information
      const providerUsers = users.filter((u: any) => 
        u.role === 'provider' && u.profile?.skills?.length > 0
      );
      
      // Mock ratings and sessions data
      const tutorsWithStats = providerUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        university: u.profile?.university,
        major: u.profile?.major,
        rating: Math.floor(Math.random() * 2) + 3 + Math.random(), // Random rating between 3-5
        subjects: u.profile?.skills || [],
        completedSessions: Math.floor(Math.random() * 50), // Random sessions between 0-50
        image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`
      }));
      
      setTutors(tutorsWithStats);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      toast.error("Failed to load tutor recommendations");
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter tutors based on subject
  useEffect(() => {
    if (subjectFilter) {
      const filtered = tutors.filter(tutor => 
        tutor.subjects.some(s => 
          s.toLowerCase().includes(subjectFilter.toLowerCase())
        )
      );
      setFilteredTutors(filtered);
    } else {
      setFilteredTutors(tutors);
    }
  }, [tutors, subjectFilter]);

  // Get a personalized selection of tutors
  const getPersonalizedTutors = () => {
    // In a real app, this would use an ML algorithm
    // For now, we'll sort by rating and sessions completed
    return filteredTutors
      .sort((a, b) => (b.rating * 0.7 + b.completedSessions * 0.3) - 
                      (a.rating * 0.7 + a.completedSessions * 0.3))
      .slice(0, limit);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <BookOpen className="mr-2 text-indigo-600" size={20} />
          Recommended Tutors
        </h2>
        
        <div className="flex items-center space-x-2">
          <Filter size={14} className="text-gray-500" />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="text-sm border-gray-300 rounded-md"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : getPersonalizedTutors().length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No tutors found for this subject.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getPersonalizedTutors().map((tutor) => (
            <div key={tutor.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 bg-gray-100 flex items-center justify-center">
                {tutor.image ? (
                  <img 
                    src={tutor.image} 
                    alt={tutor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-xl">
                    {tutor.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{tutor.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{tutor.university || 'University not specified'}</p>
                
                <div className="flex items-center text-amber-500 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      fill={i < Math.floor(tutor.rating) ? 'currentColor' : 'none'} 
                      size={14} 
                      className={i < Math.floor(tutor.rating) ? 'text-amber-500' : 'text-gray-300'}
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-600">{tutor.rating.toFixed(1)}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2 mb-3">
                  {tutor.subjects.slice(0, 2).map((subject, idx) => (
                    <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                      {subject}
                    </span>
                  ))}
                  {tutor.subjects.length > 2 && (
                    <span className="text-xs text-gray-500">+{tutor.subjects.length - 2} more</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">{tutor.completedSessions} sessions completed</span>
                  <Link 
                    to={`/messages/${tutor.id}`}
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    Contact <ArrowRight size={12} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 text-center">
        <Link to="/tutors" className="text-indigo-600 hover:text-indigo-800 text-sm">
          View all tutors
        </Link>
      </div>
    </div>
  );
};

export default TutorRecommendations;

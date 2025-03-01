import { useState, useEffect } from 'react';
import { useIntegrity } from '../../contexts/IntegrityContext';
import { Filter, GraduationCap, Search, SlidersHorizontal } from 'lucide-react';
import TutorCard from '../../components/tutors/TutorCard';

const TutorDirectory = () => {
  const { getAverageRating } = useIntegrity();
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // List of common subjects for filtering
  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'Computer Science', 'Engineering', 'Literature',
    'History', 'Economics', 'Business', 'Psychology'
  ];

  // Fetch tutors from local storage
  useEffect(() => {
    setLoading(true);
    
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Filter only providers
      const providerUsers = users.filter((u: any) => u.role === 'provider');
      
      if (providerUsers.length === 0) {
        // Add default tutors if none exist
        const defaultTutors = [
          {
            id: '1001',
            email: 'tutor@example.com',
            name: 'Sarah Miller',
            role: 'provider',
            isVerified: true,
            profile: {
              university: 'Stanford University',
              major: 'Computer Science',
              skills: ['Mathematics', 'Programming', 'Data Structures', 'Algorithms'],
              bio: 'Passionate computer science tutor with 5+ years of teaching experience.'
            },
            rating: 4.9,
            completedSessions: 47,
            image: `https://randomuser.me/api/portraits/women/33.jpg`
          },
          {
            id: '1002',
            email: 'tutor2@example.com',
            name: 'James Wilson',
            role: 'provider',
            isVerified: true,
            profile: {
              university: 'MIT',
              major: 'Physics',
              skills: ['Physics', 'Calculus', 'Quantum Mechanics'],
              bio: 'Physics PhD candidate with a strong background in mathematics.'
            },
            rating: 4.7,
            completedSessions: 32,
            image: `https://randomuser.me/api/portraits/men/42.jpg`
          }
        ];
        setTutors(defaultTutors);
      } else {
        // Add ratings and session data
        const tutorsWithData = providerUsers.map((u: any) => {
          const rating = getAverageRating(u.id) || (Math.random() * 2 + 3); // Random between 3-5 if no ratings
          return {
            ...u,
            rating,
            completedSessions: Math.floor(Math.random() * 50), // Random sessions between 0-50
            image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`
          };
        });
        
        setTutors(tutorsWithData);
      }
    } catch (error) {
      console.error("Error loading tutors:", error);
      // Provide fallback tutors
      setTutors([
        {
          id: '1001',
          email: 'tutor@example.com',
          name: 'Sarah Miller',
          role: 'provider',
          isVerified: true,
          profile: {
            university: 'Stanford University',
            major: 'Computer Science',
            skills: ['Mathematics', 'Programming', 'Data Structures', 'Algorithms'],
            bio: 'Passionate computer science tutor with 5+ years of teaching experience.'
          },
          rating: 4.9,
          completedSessions: 47,
          image: `https://randomuser.me/api/portraits/women/33.jpg`
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [getAverageRating]);

  // Apply filters
  const filteredTutors = tutors.filter(tutor => {
    // Search by name, skills, university or major
    const matchesSearch = !searchQuery || 
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tutor.profile?.university && tutor.profile.university.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tutor.profile?.major && tutor.profile.major.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tutor.profile?.skills && tutor.profile.skills.some((skill: string) => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    // Filter by subject area
    const matchesSubject = !subjectFilter || 
      (tutor.profile?.skills && tutor.profile.skills.some((skill: string) => 
        skill.toLowerCase().includes(subjectFilter.toLowerCase())
      ));
    
    // Filter by rating
    const matchesRating = ratingFilter === '' || tutor.rating >= ratingFilter;
    
    return matchesSearch && matchesSubject && matchesRating;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <GraduationCap className="mr-3 text-indigo-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Find a Tutor</h1>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <SlidersHorizontal size={16} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute top-3 left-3 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tutors by name, university, or subject..."
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Area
              </label>
              <div className="flex items-center">
                <Filter size={16} className="text-gray-400 mr-2" />
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Rating
              </label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5 & Above</option>
                <option value="4">4.0 & Above</option>
                <option value="3.5">3.5 & Above</option>
                <option value="3">3.0 & Above</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredTutors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <GraduationCap className="mx-auto text-gray-400 mb-3" size={48} />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No tutors found</h2>
          <p className="text-gray-500">
            Try adjusting your search terms or filters to find tutors.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTutors.map(tutor => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorDirectory;

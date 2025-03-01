import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import { ArrowRight, Award, BookMarked, CircleAlert, GraduationCap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TutorRecommendations from '../components/learning/TutorRecommendations';

const SeekerDashboard = () => {
  const { user } = useAuth();
  const { getRecommendedTutors, getUserAchievements } = useLearning();
  const navigate = useNavigate();
  
  if (!user) return <div>Loading...</div>;
  
  const needsProfile = !user.profile?.university || !user.profile?.major;
  const subjectArea = user.profile?.major || '';
  const recommendedTutors = getRecommendedTutors(subjectArea);
  const achievements = getUserAchievements(user.id);
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600">
          Find academic help from qualified peers in your subject areas.
        </p>
      </div>
      
      {needsProfile && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
          <CircleAlert className="text-amber-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-medium text-amber-800">Complete your profile</h3>
            <p className="text-amber-700 text-sm mt-1">
              To find the best academic helpers, please complete your academic profile with university and major information.
            </p>
            <button 
              onClick={() => navigate('/profile')}
              className="mt-2 text-amber-800 hover:text-amber-900 text-sm font-medium flex items-center"
            >
              Complete Profile <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
      
      {/* Tutor Recommendations Component */}
      <TutorRecommendations subject={subjectArea} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BookMarked className="mr-2 text-indigo-600" size={20} />
            Learning Resources
          </h2>
          <p className="text-gray-600 mb-4">
            Access study materials, guides, and references to support your learning journey.
          </p>
          <Link 
            to="/resources"
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 flex items-center w-fit"
          >
            <BookMarked size={16} className="mr-2" />
            Browse Resources
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="mr-2 text-indigo-600" size={20} />
            Study Groups
          </h2>
          <p className="text-gray-600 mb-4">
            Join virtual study groups with peers who are studying similar subjects.
          </p>
          <Link 
            to="/study-groups"
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 flex items-center w-fit"
          >
            <Users size={16} className="mr-2" />
            Find Study Groups
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="mr-2 text-indigo-600" size={20} />
            Your Achievements
          </h2>
          {achievements.length > 0 ? (
            <div className="space-y-2">
              {achievements.slice(0, 3).map(achievement => (
                <div key={achievement.id} className="flex items-center">
                  <span className="text-amber-500 mr-2">🏆</span>
                  <span>{achievement.title}</span>
                </div>
              ))}
              {achievements.length > 3 && (
                <p className="text-sm text-indigo-600">
                  +{achievements.length - 3} more achievements
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600 mb-4">
              Complete tasks and earn badges to track your progress.
            </p>
          )}
          <Link 
            to="/achievement-progress"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
          >
            View Learning Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;

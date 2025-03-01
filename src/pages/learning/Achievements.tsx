import { useAuth } from '../../contexts/AuthContext';
import { useLearning } from '../../contexts/LearningContext';
import { Award, BookOpen, SquareCheck, Target, Users } from 'lucide-react';

const Achievements = () => {
  const { user } = useAuth();
  const { getUserAchievements } = useLearning();
  
  if (!user) return <div>Loading...</div>;
  
  // Get user achievements
  const achievements = getUserAchievements(user.id);
  
  // In a real app, these would be populated from the backend
  // For the MVP, we'll add some sample achievements
  const sampleAchievements = [
    {
      id: 'achievement_1',
      userId: user.id,
      type: 'completion',
      title: 'First Steps',
      description: 'Completed your first tutoring session',
      iconName: 'BookOpen',
      earnedAt: new Date().toISOString()
    },
    {
      id: 'achievement_2',
      userId: user.id,
      type: 'collaboration',
      title: 'Team Player',
      description: 'Participated in your first study group',
      iconName: 'Users',
      earnedAt: new Date().toISOString()
    },
    {
      id: 'achievement_3',
      userId: user.id,
      type: 'excellence',
      title: 'Academic Excellence',
      description: 'Received five-star feedback from a peer',
      iconName: 'Award',
      earnedAt: new Date().toISOString()
    }
  ];
  
  const allAchievements = [...achievements, ...sampleAchievements];
  
  // Display an icon based on achievement type
  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen size={24} className="text-indigo-600" />;
      case 'Users':
        return <Users size={24} className="text-green-600" />;
      case 'Award':
        return <Award size={24} className="text-amber-500" />;
      case 'SquareCheck':
        return <SquareCheck size={24} className="text-blue-600" />;
      default:
        return <Target size={24} className="text-purple-600" />;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Award className="mr-3 text-indigo-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Your Achievements</h1>
        </div>
        <p className="text-gray-600">
          Track your learning journey and showcase your accomplishments with badges and achievements.
        </p>
      </div>
      
      {allAchievements.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Award className="mx-auto text-gray-400 mb-3" size={48} />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No achievements yet</h2>
          <p className="text-gray-500">
            Continue using the platform to earn achievements and track your progress.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allAchievements.map(achievement => (
            <div key={achievement.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center">
                <div className="bg-indigo-50 rounded-full p-3 mr-3">
                  {getAchievementIcon(achievement.iconName)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                  <p className="text-sm text-gray-500">Earned on {formatDate(achievement.earnedAt)}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;

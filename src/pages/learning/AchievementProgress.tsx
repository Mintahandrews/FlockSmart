import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAchievements } from '../../contexts/AchievementContext';
import { Award, BookOpen, ChartPie, Target, TrendingUp, Users } from 'lucide-react';
import AchievementBadge from '../../components/badges/AchievementBadge';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AchievementProgress = () => {
  const { user } = useAuth();
  const { badges, userProgress, getUnlockedBadges } = useAchievements();
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);
  const [showBadgeDetails, setShowBadgeDetails] = useState(false);
  
  if (!user || !userProgress) return <div>Loading...</div>;

  // Get earned badges
  const earnedBadges = getUnlockedBadges();
  
  // Group badges by category
  const badgesByCategory = badges.reduce((acc: {[key: string]: any[]}, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {});
  
  // Prepare chart data
  const chartData = {
    labels: ['Sessions', 'Services', 'Study Groups', 'Resources', 'Days Active'],
    datasets: [
      {
        label: 'Your Activity',
        data: [
          userProgress.stats.sessionsCompleted,
          userProgress.stats.servicesProvided,
          userProgress.stats.studyGroupsJoined,
          userProgress.stats.resourcesShared,
          userProgress.stats.daysActive
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',  // Indigo
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(16, 185, 129, 0.8)',  // Green
          'rgba(245, 158, 11, 0.8)',  // Amber
          'rgba(139, 92, 246, 0.8)'   // Purple
        ],
      }
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Your Learning Activities',
      },
    },
  };
  
  // Get progress for each badge
  const getBadgeProgress = (badge: any): number => {
    // Check if already earned
    if (userProgress.badges.some(b => b.badgeId === badge.id)) {
      return 1; // 100% progress
    }
    
    // Calculate progress based on requirement
    const { type, value } = badge.requirement;
    const stats = userProgress.stats;
    
    switch (type) {
      case 'sessions_completed':
        return Math.min(1, stats.sessionsCompleted / value);
      case 'services_provided':
        return Math.min(1, stats.servicesProvided / value);
      case 'study_groups_joined':
        return Math.min(1, stats.studyGroupsJoined / value);
      case 'days_active':
        return Math.min(1, stats.daysActive / value);
      case 'resources_shared':
        return Math.min(1, stats.resourcesShared / value);
      default:
        return 0;
    }
  };
  
  // Handle badge click to show details
  const handleBadgeClick = (badge: any) => {
    setSelectedBadge(badge);
    setShowBadgeDetails(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <Award className="mr-3 text-indigo-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Your Learning Journey</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <p className="text-xs uppercase text-indigo-600 font-semibold">Level</p>
            <p className="text-3xl font-bold text-indigo-700">{userProgress.level}</p>
            <div className="mt-2 bg-indigo-200 h-2 rounded-full">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${(userProgress.points % 500) / 5}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-indigo-600">
              {userProgress.points % 500} / 500 XP to next level
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-xs uppercase text-blue-600 font-semibold">Total XP</p>
            <p className="text-3xl font-bold text-blue-700">{userProgress.points}</p>
            <p className="mt-1 text-xs text-blue-600">Points earned</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <p className="text-xs uppercase text-amber-600 font-semibold">Badges</p>
            <p className="text-3xl font-bold text-amber-700">
              {earnedBadges.length} / {badges.length}
            </p>
            <p className="mt-1 text-xs text-amber-600">
              {Math.round((earnedBadges.length / badges.length) * 100)}% complete
            </p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <ChartPie size={20} className="mr-2 text-indigo-600" />
            Activity Progress
          </h2>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <Target size={20} className="mr-2 text-indigo-600" />
          Your Achievement Badges
        </h2>
        
        {Object.entries(badgesByCategory).map(([category, badges]) => (
          <div key={category} className="mb-8 last:mb-0">
            <h3 className="font-medium text-gray-700 mb-4 capitalize flex items-center">
              {category === 'learning' && <BookOpen size={16} className="mr-2 text-blue-500" />}
              {category === 'teaching' && <Users size={16} className="mr-2 text-green-500" />}
              {category === 'collaboration' && <Users size={16} className="mr-2 text-amber-500" />}
              {category === 'participation' && <TrendingUp size={16} className="mr-2 text-purple-500" />}
              {category === 'achievement' && <Award size={16} className="mr-2 text-indigo-500" />}
              {category} Badges
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {badges.map((badge: any) => (
                <AchievementBadge
                  key={badge.id}
                  badge={badge}
                  earned={userProgress.badges.some(b => b.badgeId === badge.id)}
                  progress={getBadgeProgress(badge)}
                  size="md"
                  showDetails={true}
                  onClick={() => handleBadgeClick(badge)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Badge Details Modal */}
      {showBadgeDetails && selectedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{selectedBadge.name}</h2>
              <button 
                onClick={() => setShowBadgeDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="flex justify-center mb-4">
              <AchievementBadge
                badge={selectedBadge}
                earned={userProgress.badges.some(b => b.badgeId === selectedBadge.id)}
                progress={getBadgeProgress(selectedBadge)}
                size="lg"
              />
            </div>
            
            <div className="text-center mb-4">
              <p className="text-gray-600">{selectedBadge.description}</p>
              <p className="text-indigo-600 font-medium mt-2">
                {selectedBadge.pointsValue} XP
              </p>
            </div>
            
            {!userProgress.badges.some(b => b.badgeId === selectedBadge.id) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">How to earn this badge:</h3>
                <p className="text-gray-600">
                  {selectedBadge.requirement.type === 'sessions_completed' && 
                    `Complete ${selectedBadge.requirement.value} tutoring session${selectedBadge.requirement.value > 1 ? 's' : ''}`}
                  {selectedBadge.requirement.type === 'services_provided' && 
                    `Provide ${selectedBadge.requirement.value} tutoring service${selectedBadge.requirement.value > 1 ? 's' : ''}`}
                  {selectedBadge.requirement.type === 'study_groups_joined' && 
                    `Join ${selectedBadge.requirement.value} study group${selectedBadge.requirement.value > 1 ? 's' : ''}`}
                  {selectedBadge.requirement.type === 'days_active' && 
                    `Use the platform for ${selectedBadge.requirement.value} consecutive days`}
                  {selectedBadge.requirement.type === 'resources_shared' && 
                    `Share ${selectedBadge.requirement.value} learning resource${selectedBadge.requirement.value > 1 ? 's' : ''}`}
                </p>
                <div className="mt-2">
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2"
                      style={{ width: `${getBadgeProgress(selectedBadge) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-right mt-1">
                    {Math.round(getBadgeProgress(selectedBadge) * 100)}% complete
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowBadgeDetails(false)}
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementProgress;

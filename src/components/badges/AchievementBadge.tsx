import React from 'react';
import { Badge } from '../../types/badges';
import { Award, BookOpen, Clock, Star, Target, Users } from 'lucide-react';

interface AchievementBadgeProps {
  badge: Badge;
  earned?: boolean;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  badge,
  earned = false,
  progress = 0,
  size = 'md',
  showDetails = false,
  onClick
}) => {
  // Get icon based on category
  const getIcon = () => {
    switch (badge.category) {
      case 'learning':
        return <BookOpen className="text-blue-500" />;
      case 'teaching':
        return <Star className="text-amber-500" />;
      case 'collaboration':
        return <Users className="text-green-500" />;
      case 'participation':
        return <Clock className="text-purple-500" />;
      case 'achievement':
      default:
        return <Award className="text-indigo-500" />;
    }
  };

  // Determine badge size
  const badgeSize = {
    sm: {
      container: 'w-16 h-16',
      icon: 'w-6 h-6',
      progressSize: 'w-16 h-16'
    },
    md: {
      container: 'w-24 h-24',
      icon: 'w-8 h-8',
      progressSize: 'w-24 h-24'
    },
    lg: {
      container: 'w-32 h-32',
      icon: 'w-10 h-10',
      progressSize: 'w-32 h-32'
    }
  }[size];

  return (
    <div 
      className={`flex flex-col items-center ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        {/* Progress circle for unearned badges */}
        {!earned && progress > 0 && (
          <svg className={`${badgeSize.progressSize} absolute top-0 left-0`} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#6366f1"
              strokeWidth="8"
              strokeDasharray={`${progress * 283} 283`}
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
          </svg>
        )}
        
        {/* Badge circle */}
        <div 
          className={`${badgeSize.container} rounded-full flex items-center justify-center ${
            earned ? 'bg-indigo-100' : 'bg-gray-100'
          } relative`}
        >
          <div className={badgeSize.icon}>
            {getIcon()}
          </div>
          
          {/* Locked indicator */}
          {!earned && progress === 0 && (
            <div className="absolute bottom-1 right-1 bg-gray-400 rounded-full p-1 w-5 h-5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-2 text-center">
          <h3 className={`font-semibold ${earned ? 'text-gray-800' : 'text-gray-500'}`}>
            {badge.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
          {!earned && badge.requirement && (
            <p className="text-xs text-indigo-600 mt-1">
              {progress > 0 ? `Progress: ${Math.floor(progress * 100)}%` : 'Locked'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;

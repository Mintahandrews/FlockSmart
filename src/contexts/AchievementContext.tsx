import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Badge, UserAchievement, UserProgress } from '../types/badges';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface AchievementContextType {
  badges: Badge[];
  userProgress: UserProgress | null;
  earnBadge: (badgeId: string) => void;
  addPoints: (points: number, reason: string) => void;
  getUserAchievements: () => UserAchievement[];
  getUnlockedBadges: () => Badge[];
  checkEligibleBadges: () => Badge[];
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};

interface AchievementProviderProps {
  children: ReactNode;
}

// Default badges
const defaultBadges: Badge[] = [
  {
    id: 'badge_first_session',
    name: 'First Steps',
    description: 'Completed your first tutoring session',
    icon: '🏆',
    category: 'achievement',
    pointsValue: 50,
    requirement: { type: 'sessions_completed', value: 1 }
  },
  {
    id: 'badge_five_sessions',
    name: 'Regular Learner',
    description: 'Completed 5 tutoring sessions',
    icon: '🎓',
    category: 'learning',
    pointsValue: 100,
    requirement: { type: 'sessions_completed', value: 5 }
  },
  {
    id: 'badge_first_group',
    name: 'Team Player',
    description: 'Joined your first study group',
    icon: '👥',
    category: 'collaboration',
    pointsValue: 50,
    requirement: { type: 'study_groups_joined', value: 1 }
  },
  {
    id: 'badge_first_tutor',
    name: 'Helping Hand',
    description: 'Provided your first tutoring service',
    icon: '🤝',
    category: 'teaching',
    pointsValue: 75,
    requirement: { type: 'services_provided', value: 1 }
  },
  {
    id: 'badge_week_streak',
    name: 'Consistency',
    description: 'Used the platform for 7 consecutive days',
    icon: '📆',
    category: 'participation',
    pointsValue: 125,
    requirement: { type: 'days_active', value: 7 }
  }
];

export const AchievementProvider = ({ children }: AchievementProviderProps) => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>(defaultBadges);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  // Load badges and user progress from localStorage
  useEffect(() => {
    if (user) {
      const storedBadges = localStorage.getItem('badges');
      if (storedBadges) setBadges(JSON.parse(storedBadges));
      
      const storedProgress = localStorage.getItem(`userProgress_${user.id}`);
      if (storedProgress) {
        setUserProgress(JSON.parse(storedProgress));
      } else {
        // Initialize progress for new user
        const initialProgress: UserProgress = {
          userId: user.id,
          points: 0,
          level: 1,
          badges: [],
          stats: {
            sessionsCompleted: 0,
            servicesProvided: 0,
            studyGroupsJoined: 0,
            resourcesShared: 0,
            daysActive: 1
          }
        };
        setUserProgress(initialProgress);
        localStorage.setItem(`userProgress_${user.id}`, JSON.stringify(initialProgress));
      }
    } else {
      setUserProgress(null);
    }
  }, [user]);

  // Save badges and user progress to localStorage
  useEffect(() => {
    localStorage.setItem('badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    if (user && userProgress) {
      localStorage.setItem(`userProgress_${user.id}`, JSON.stringify(userProgress));
    }
  }, [userProgress, user]);

  const earnBadge = (badgeId: string) => {
    if (!user || !userProgress) return;

    const badge = badges.find(b => b.id === badgeId);
    if (!badge) return;

    // Check if already earned
    if (userProgress.badges.some(a => a.badgeId === badgeId)) return;

    const newAchievement: UserAchievement = {
      userId: user.id,
      badgeId,
      earnedAt: new Date().toISOString()
    };

    setUserProgress(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        badges: [...prev.badges, newAchievement],
        points: prev.points + badge.pointsValue
      };
    });

    toast.success(`Earned badge: ${badge.name}`);
  };

  const addPoints = (points: number, reason: string) => {
    if (!user || !userProgress) return;

    setUserProgress(prev => {
      if (!prev) return null;
      
      const newPoints = prev.points + points;
      const newLevel = Math.floor(newPoints / 500) + 1;
      const leveledUp = newLevel > prev.level;
      
      if (leveledUp) {
        toast.success(`Level Up! You are now level ${newLevel}`);
      }
      
      return {
        ...prev,
        points: newPoints,
        level: newLevel
      };
    });

    toast.success(`+${points} points: ${reason}`);
  };

  const getUserAchievements = (): UserAchievement[] => {
    if (!userProgress) return [];
    return userProgress.badges;
  };

  const getUnlockedBadges = (): Badge[] => {
    if (!userProgress) return [];
    
    const unlockedBadgeIds = new Set(userProgress.badges.map(a => a.badgeId));
    return badges.filter(badge => unlockedBadgeIds.has(badge.id));
  };

  const checkEligibleBadges = (): Badge[] => {
    if (!userProgress) return [];
    
    // Get already earned badges
    const earnedBadgeIds = new Set(userProgress.badges.map(a => a.badgeId));
    
    // Check which badges are eligible but not yet earned
    return badges.filter(badge => {
      if (earnedBadgeIds.has(badge.id)) return false;
      
      // Check requirements
      const { type, value } = badge.requirement;
      
      switch (type) {
        case 'sessions_completed':
          return userProgress.stats.sessionsCompleted >= value;
        case 'services_provided':
          return userProgress.stats.servicesProvided >= value;
        case 'study_groups_joined':
          return userProgress.stats.studyGroupsJoined >= value;
        case 'resources_shared':
          return userProgress.stats.resourcesShared >= value;
        case 'days_active':
          return userProgress.stats.daysActive >= value;
        default:
          return false;
      }
    });
  };

  return (
    <AchievementContext.Provider value={{
      badges,
      userProgress,
      earnBadge,
      addPoints,
      getUserAchievements,
      getUnlockedBadges,
      checkEligibleBadges
    }}>
      {children}
    </AchievementContext.Provider>
  );
};

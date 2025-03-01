export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  pointsValue: number;
  requirement: {
    type: BadgeRequirementType;
    value: number;
  };
}

export type BadgeCategory = 
  | 'learning' 
  | 'teaching' 
  | 'collaboration' 
  | 'achievement'
  | 'participation';

export type BadgeRequirementType = 
  | 'sessions_completed'
  | 'rating_received'
  | 'study_groups_joined'
  | 'services_provided'
  | 'resources_shared'
  | 'days_active';

export interface UserAchievement {
  userId: string;
  badgeId: string;
  earnedAt: string;
  progress?: number;
}

export interface UserProgress {
  userId: string;
  points: number;
  level: number;
  badges: UserAchievement[];
  stats: {
    sessionsCompleted: number;
    servicesProvided: number;
    studyGroupsJoined: number;
    resourcesShared: number;
    daysActive: number;
  };
}

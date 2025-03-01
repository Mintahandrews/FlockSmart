import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'article' | 'quiz';
  url: string;
  subjectArea: string;
  createdBy: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'completion' | 'collaboration' | 'contribution' | 'excellence';
  title: string;
  description: string;
  iconName: string;
  earnedAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subjectArea: string;
  members: string[];
  createdBy: string;
  createdAt: string;
}

interface LearningContextType {
  resources: Resource[];
  achievements: Achievement[];
  studyGroups: StudyGroup[];
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'createdBy'>) => Promise<Resource>;
  getResourcesBySubject: (subjectArea: string) => Resource[];
  getRecommendedTutors: (subjectArea: string) => any[];
  getUserAchievements: (userId: string) => Achievement[];
  getStudyGroupsBySubject: (subjectArea: string) => StudyGroup[];
  createStudyGroup: (group: Omit<StudyGroup, 'id' | 'createdAt' | 'createdBy'>) => Promise<StudyGroup>;
  joinStudyGroup: (groupId: string) => Promise<void>;
  leaveStudyGroup: (groupId: string) => Promise<void>;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};

interface LearningProviderProps {
  children: ReactNode;
}

export const LearningProvider = ({ children }: LearningProviderProps) => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedResources = localStorage.getItem('resources');
    const storedAchievements = localStorage.getItem('achievements');
    const storedStudyGroups = localStorage.getItem('studyGroups');
    
    if (storedResources) setResources(JSON.parse(storedResources));
    if (storedAchievements) setAchievements(JSON.parse(storedAchievements));
    if (storedStudyGroups) setStudyGroups(JSON.parse(storedStudyGroups));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('studyGroups', JSON.stringify(studyGroups));
  }, [studyGroups]);

  const addResource = async (resourceData: Omit<Resource, 'id' | 'createdAt' | 'createdBy'>): Promise<Resource> => {
    if (!user) throw new Error('User must be logged in to add a resource');
    
    const newResource: Resource = {
      ...resourceData,
      id: `resource_${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    
    setResources(prev => [...prev, newResource]);
    return newResource;
  };

  const getResourcesBySubject = (subjectArea: string): Resource[] => {
    return resources.filter(resource => resource.subjectArea === subjectArea);
  };

  const getRecommendedTutors = (subjectArea: string): any[] => {
    // In a real implementation, this would use ML algorithms
    // For the MVP, we'll filter users by matching skills
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find tutors (providers) who have skills matching the subject area
    return users
      .filter((u: any) => 
        u.role === 'provider' && 
        u.profile?.skills?.some((skill: string) => 
          skill.toLowerCase().includes(subjectArea.toLowerCase()) ||
          subjectArea.toLowerCase().includes(skill.toLowerCase())
        )
      )
      .sort(() => Math.random() - 0.5) // Simple randomization
      .slice(0, 3); // Return top 3
  };

  const getUserAchievements = (userId: string): Achievement[] => {
    return achievements.filter(achievement => achievement.userId === userId);
  };

  const getStudyGroupsBySubject = (subjectArea: string): StudyGroup[] => {
    return studyGroups.filter(group => 
      group.subjectArea === subjectArea || 
      subjectArea === ''
    );
  };

  const createStudyGroup = async (groupData: Omit<StudyGroup, 'id' | 'createdAt' | 'createdBy'>): Promise<StudyGroup> => {
    if (!user) throw new Error('User must be logged in to create a study group');
    
    const newGroup: StudyGroup = {
      ...groupData,
      id: `group_${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      members: [...groupData.members, user.id] // Add creator as a member
    };
    
    setStudyGroups(prev => [...prev, newGroup]);
    return newGroup;
  };

  const joinStudyGroup = async (groupId: string): Promise<void> => {
    if (!user) throw new Error('User must be logged in to join a study group');
    
    setStudyGroups(prev => prev.map(group => 
      group.id === groupId && !group.members.includes(user.id)
        ? { ...group, members: [...group.members, user.id] }
        : group
    ));
  };

  const leaveStudyGroup = async (groupId: string): Promise<void> => {
    if (!user) throw new Error('User must be logged in to leave a study group');
    
    setStudyGroups(prev => prev.map(group => 
      group.id === groupId
        ? { ...group, members: group.members.filter(id => id !== user.id) }
        : group
    ));
  };

  return (
    <LearningContext.Provider value={{
      resources,
      achievements,
      studyGroups,
      addResource,
      getResourcesBySubject,
      getRecommendedTutors,
      getUserAchievements,
      getStudyGroupsBySubject,
      createStudyGroup,
      joinStudyGroup,
      leaveStudyGroup
    }}>
      {children}
    </LearningContext.Provider>
  );
};

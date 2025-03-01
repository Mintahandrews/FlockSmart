import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudyGroup, StudyGroupMessage } from '../types/studyGroups';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface StudyGroupContextType {
  studyGroups: StudyGroup[];
  groupMessages: Record<string, StudyGroupMessage[]>;
  createStudyGroup: (group: Omit<StudyGroup, 'id' | 'createdAt'>) => Promise<StudyGroup>;
  joinStudyGroup: (groupId: string) => Promise<void>;
  leaveStudyGroup: (groupId: string) => Promise<void>;
  sendGroupMessage: (groupId: string, content: string) => Promise<void>;
  getMyStudyGroups: () => StudyGroup[];
  getPublicStudyGroups: () => StudyGroup[];
  getStudyGroupById: (groupId: string) => StudyGroup | undefined;
  getGroupMessages: (groupId: string) => StudyGroupMessage[];
}

const StudyGroupContext = createContext<StudyGroupContextType | undefined>(undefined);

export const useStudyGroups = () => {
  const context = useContext(StudyGroupContext);
  if (context === undefined) {
    throw new Error('useStudyGroups must be used within a StudyGroupProvider');
  }
  return context;
};

interface StudyGroupProviderProps {
  children: ReactNode;
}

export const StudyGroupProvider = ({ children }: StudyGroupProviderProps) => {
  const { user } = useAuth();
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [groupMessages, setGroupMessages] = useState<Record<string, StudyGroupMessage[]>>({});

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedGroups = localStorage.getItem('studyGroups');
    const storedMessages = localStorage.getItem('studyGroupMessages');
    
    if (storedGroups) setStudyGroups(JSON.parse(storedGroups));
    if (storedMessages) setGroupMessages(JSON.parse(storedMessages));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('studyGroups', JSON.stringify(studyGroups));
  }, [studyGroups]);

  useEffect(() => {
    localStorage.setItem('studyGroupMessages', JSON.stringify(groupMessages));
  }, [groupMessages]);

  const createStudyGroup = async (groupData: Omit<StudyGroup, 'id' | 'createdAt'>): Promise<StudyGroup> => {
    if (!user) throw new Error('You must be logged in to create a study group');

    const newGroup: StudyGroup = {
      ...groupData,
      id: `group_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setStudyGroups(prev => [...prev, newGroup]);
    toast.success('Study group created successfully');
    return newGroup;
  };

  const joinStudyGroup = async (groupId: string): Promise<void> => {
    if (!user) throw new Error('You must be logged in to join a study group');

    const group = studyGroups.find(g => g.id === groupId);
    if (!group) throw new Error('Study group not found');

    if (group.members.includes(user.id)) {
      throw new Error('You are already a member of this study group');
    }

    const updatedGroup = {
      ...group,
      members: [...group.members, user.id]
    };

    setStudyGroups(prev => prev.map(g => g.id === groupId ? updatedGroup : g));
    toast.success(`Joined ${group.name} study group`);
  };

  const leaveStudyGroup = async (groupId: string): Promise<void> => {
    if (!user) throw new Error('You must be logged in to leave a study group');

    const group = studyGroups.find(g => g.id === groupId);
    if (!group) throw new Error('Study group not found');

    if (!group.members.includes(user.id)) {
      throw new Error('You are not a member of this study group');
    }

    // Don't allow the creator to leave
    if (group.createdBy === user.id) {
      throw new Error('As the creator, you cannot leave this group. You can delete it instead.');
    }

    const updatedGroup = {
      ...group,
      members: group.members.filter(id => id !== user.id)
    };

    setStudyGroups(prev => prev.map(g => g.id === groupId ? updatedGroup : g));
    toast.success(`Left ${group.name} study group`);
  };

  const sendGroupMessage = async (groupId: string, content: string): Promise<void> => {
    if (!user) throw new Error('You must be logged in to send a message');

    const group = studyGroups.find(g => g.id === groupId);
    if (!group) throw new Error('Study group not found');

    if (!group.members.includes(user.id)) {
      throw new Error('You must be a member of this group to send messages');
    }

    const newMessage: StudyGroupMessage = {
      id: `msg_${Date.now()}`,
      groupId,
      senderId: user.id,
      content,
      timestamp: new Date().toISOString()
    };

    setGroupMessages(prev => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), newMessage]
    }));
  };

  const getMyStudyGroups = (): StudyGroup[] => {
    if (!user) return [];
    return studyGroups.filter(group => group.members.includes(user.id));
  };

  const getPublicStudyGroups = (): StudyGroup[] => {
    return studyGroups.filter(group => group.isPublic);
  };

  const getStudyGroupById = (groupId: string): StudyGroup | undefined => {
    return studyGroups.find(group => group.id === groupId);
  };

  const getGroupMessages = (groupId: string): StudyGroupMessage[] => {
    return groupMessages[groupId] || [];
  };

  return (
    <StudyGroupContext.Provider value={{
      studyGroups,
      groupMessages,
      createStudyGroup,
      joinStudyGroup,
      leaveStudyGroup,
      sendGroupMessage,
      getMyStudyGroups,
      getPublicStudyGroups,
      getStudyGroupById,
      getGroupMessages
    }}>
      {children}
    </StudyGroupContext.Provider>
  );
};

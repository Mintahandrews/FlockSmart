import { useState } from 'react';
import { useStudyGroups } from '../../contexts/StudyGroupContext';
import { useAuth } from '../../contexts/AuthContext';
import { StudyGroup } from '../../types/studyGroups';
import { BookOpen, Link, Tag, Users } from 'lucide-react';

interface StudyGroupCardProps {
  group: StudyGroup;
  onSelect: (groupId: string) => void;
}

const StudyGroupCard = ({ group, onSelect }: StudyGroupCardProps) => {
  const { user } = useAuth();
  const { joinStudyGroup, leaveStudyGroup } = useStudyGroups();
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const isCreator = user?.id === group.createdBy;
  const isMember = user ? group.members.includes(user.id) : false;

  const getUser = (userId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find((u: any) => u.id === userId);
  };

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    setIsJoining(true);
    try {
      await joinStudyGroup(group.id);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    setIsLeaving(true);
    try {
      await leaveStudyGroup(group.id);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLeaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => onSelect(group.id)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
            {group.name}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${group.isPublic ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
            {group.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {group.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs flex items-center">
            <BookOpen size={12} className="mr-1" />
            {group.subjectArea}
          </span>
          
          {group.tags.map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center">
              <Tag size={12} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>{group.members.length} members</span>
          </div>
          <div className="text-gray-500">
            Created {formatDate(group.createdAt)}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          By: {getUser(group.createdBy)?.name || 'Unknown User'}
        </div>
        
        {user && (
          isMember ? (
            <button
              onClick={handleLeave}
              disabled={isLeaving || isCreator}
              className={`text-sm py-1 px-3 rounded ${
                isCreator 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {isLeaving ? 'Leaving...' : isCreator ? 'Creator' : 'Leave Group'}
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="bg-indigo-600 text-white text-sm py-1 px-3 rounded hover:bg-indigo-700"
            >
              {isJoining ? 'Joining...' : 'Join Group'}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default StudyGroupCard;

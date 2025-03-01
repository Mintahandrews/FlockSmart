import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLearning } from '../../contexts/LearningContext';
import { StudyGroup } from '../../types/studyGroups';
import StudyGroupCard from '../../components/StudyGroups/StudyGroupCard';
import { Filter, Plus, Search, Users } from 'lucide-react';

const StudyGroups = () => {
  const { user } = useAuth();
  const { studyGroups, getStudyGroupsBySubject } = useLearning();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  
  // List of common subject areas for the filter dropdown
  const subjectAreas = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'Computer Science', 'Engineering', 'Literature',
    'History', 'Economics', 'Business', 'Psychology',
    'Sociology', 'Art', 'Music', 'Language', 'Other'
  ];
  
  // Filter by subject area
  const filteredBySubject = getStudyGroupsBySubject(subjectFilter);
  
  // Filter by search query
  const filteredGroups = filteredBySubject.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Handle study group selection
  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId);
  };

  // Find details of a specific group
  const getGroupDetails = (groupId: string): StudyGroup | undefined => {
    return studyGroups.find(group => group.id === groupId);
  };
  
  // Get creator name
  const getCreatorName = (userId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.id === userId);
    return user ? user.name : 'Unknown User';
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
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="mr-3 text-indigo-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">Study Groups</h1>
          </div>
          <Link
            to="/study-groups/create"
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Create Group
          </Link>
        </div>
        <p className="text-gray-600 mb-6">
          Join study groups with peers who are learning similar subjects.
          Collaborate, share resources, and learn together.
        </p>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search study groups..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <Filter size={18} className="text-gray-400" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Subjects</option>
              {subjectAreas.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Users className="mx-auto text-gray-400 mb-3" size={48} />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No study groups found</h2>
          <p className="text-gray-500 mb-4">
            {searchQuery || subjectFilter
              ? 'Try adjusting your search terms or filters.'
              : 'Be the first to create a study group!'}
          </p>
          {!searchQuery && !subjectFilter && (
            <Link
              to="/study-groups/create"
              className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Create Study Group
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <StudyGroupCard 
              key={group.id} 
              group={group} 
              onSelect={handleGroupSelect} 
            />
          ))}
        </div>
      )}
      
      {/* Group Details Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const group = getGroupDetails(selectedGroup);
              if (!group) return <div>Group not found</div>;
              
              return (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{group.name}</h2>
                      <p className="text-sm text-gray-500">
                        Created by {getCreatorName(group.createdBy)} on {formatDate(group.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedGroup(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600">{group.description}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Subject Area</p>
                        <p className="font-medium">{group.subjectArea}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Visibility</p>
                        <p className="font-medium">{group.isPublic ? 'Public' : 'Private'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Members</p>
                        <p className="font-medium">{group.members.length}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-medium">{formatDate(group.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {group.tags.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-700 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => setSelectedGroup(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroups;

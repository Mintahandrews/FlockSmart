import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLearning } from '../../contexts/LearningContext';
import { Plus, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateStudyGroup = () => {
  const { user } = useAuth();
  const { createStudyGroup } = useLearning();
  const navigate = useNavigate();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subjectArea, setSubjectArea] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Subject areas list
  const subjectAreas = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'Computer Science', 'Engineering', 'Literature',
    'History', 'Economics', 'Business', 'Psychology',
    'Sociology', 'Art', 'Music', 'Language', 'Other'
  ];
  
  if (!user) return <div>Loading...</div>;
  
  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name) {
      setError('Study group name is required');
      return;
    }
    
    if (!subjectArea) {
      setError('Subject area is required');
      return;
    }
    
    setLoading(true);
    
    try {
      await createStudyGroup({
        name,
        description,
        subjectArea,
        members: [],
        isPublic,
        tags
      });
      
      toast.success('Study group created successfully!');
      navigate('/study-groups');
    } catch (err: any) {
      setError(err.message || 'Failed to create study group');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a Study Group</h2>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Group Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Advanced Calculus Study Group"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the purpose and goals of this study group..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="subjectArea" className="block text-sm font-medium text-gray-700 mb-1">
            Subject Area <span className="text-red-500">*</span>
          </label>
          <select
            id="subjectArea"
            value={subjectArea}
            onChange={(e) => setSubjectArea(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a subject...</option>
            {subjectAreas.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Visibility
          </label>
          <div className="flex space-x-6">
            <div className="flex items-center">
              <input
                id="public"
                type="radio"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="public" className="ml-2 block text-sm text-gray-700">
                Public (Anyone can join)
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="private"
                type="radio"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="private" className="ml-2 block text-sm text-gray-700">
                Private (By invitation only)
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex">
            <input
              id="tags"
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tags (press Enter)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
            >
              <Plus size={20} />
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div 
                  key={index} 
                  className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full flex items-center"
                >
                  <Tag size={14} className="mr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-indigo-500 hover:text-indigo-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/study-groups')}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Creating...' : 'Create Study Group'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStudyGroup;

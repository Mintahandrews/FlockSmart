import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLearning, Resource } from '../../contexts/LearningContext';
import { BookMarked, FileText, Film, Globe, Plus, Search, X } from 'lucide-react';

const ResourceLibrary = () => {
  const { user } = useAuth();
  const { resources, addResource } = useLearning();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // New resource form state
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'document',
    url: '',
    subjectArea: ''
  });
  
  if (!user) return <div>Loading...</div>;
  
  // Filter resources based on search and type filter
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subjectArea.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || resource.type === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  const handleAddResource = async () => {
    try {
      await addResource(newResource);
      setShowAddModal(false);
      setNewResource({
        title: '',
        description: '',
        type: 'document',
        url: '',
        subjectArea: ''
      });
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };
  
  // Get icon for resource type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText size={20} className="text-blue-600" />;
      case 'video':
        return <Film size={20} className="text-red-600" />;
      case 'article':
        return <Globe size={20} className="text-green-600" />;
      case 'quiz':
        return <FileText size={20} className="text-purple-600" />;
      default:
        return <BookMarked size={20} className="text-indigo-600" />;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BookMarked className="mr-3 text-indigo-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">Resource Library</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Resource
          </button>
        </div>
        <p className="text-gray-600">
          Access educational materials, guides, and references to support your learning journey.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md ${
                filter === 'all'
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('document')}
              className={`px-3 py-1 rounded-md ${
                filter === 'document'
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-3 py-1 rounded-md ${
                filter === 'video'
                  ? 'bg-red-100 text-red-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setFilter('article')}
              className={`px-3 py-1 rounded-md ${
                filter === 'article'
                  ? 'bg-green-100 text-green-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Articles
            </button>
          </div>
        </div>
      </div>
      
      {filteredResources.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <BookMarked className="mx-auto text-gray-400 mb-3" size={48} />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No resources found</h2>
          <p className="text-gray-500">
            {searchQuery 
              ? 'Try adjusting your search terms or filters.'
              : 'Be the first to add a resource to the library!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((resource: Resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center mb-2">
                  {getResourceIcon(resource.type)}
                  <h3 className="ml-2 font-semibold text-gray-800">{resource.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                    {resource.subjectArea}
                  </span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View Resource
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Resource</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Type
                </label>
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({...newResource, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="document">Document</option>
                  <option value="video">Video</option>
                  <option value="article">Article</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={newResource.url}
                  onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Area
                </label>
                <input
                  type="text"
                  value={newResource.subjectArea}
                  onChange={(e) => setNewResource({...newResource, subjectArea: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddResource}
                  disabled={!newResource.title || !newResource.url}
                  className={`px-4 py-2 rounded-md ${
                    !newResource.title || !newResource.url
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Add Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;

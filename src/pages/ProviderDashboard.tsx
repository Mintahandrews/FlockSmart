import { useAuth } from '../contexts/AuthContext';
import { Squircle, ArrowRight, Book, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return <div>Loading...</div>;
  
  const needsProfile = !user.profile?.university || !user.profile?.major || !user.profile?.skills?.length;
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600">
          You're ready to provide academic assistance to students in need.
        </p>
      </div>
      
      {needsProfile && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
          <Squircle className="text-amber-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-medium text-amber-800">Complete your expertise profile</h3>
            <p className="text-amber-700 text-sm mt-1">
              To be matched with students, please add your academic background and the subjects you can help with.
            </p>
            <button 
              onClick={() => navigate('/profile')}
              className="mt-2 text-amber-800 hover:text-amber-900 text-sm font-medium flex items-center"
            >
              Complete Profile <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">My Expertise</h2>
          <p className="text-gray-600 mb-4">
            {user.profile?.skills?.length 
              ? `You're offering help in ${user.profile.skills.length} subject areas.`
              : 'Add subjects you can help with to your profile.'}
          </p>
          <button 
            onClick={() => navigate('/profile')}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 flex items-center"
          >
            <Book size={16} className="mr-2" />
            Manage Expertise
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Student Requests</h2>
          <p className="text-gray-600 mb-4">
            View and respond to students seeking academic assistance.
          </p>
          <button className="bg-indigo-100 text-indigo-700 py-2 px-4 rounded hover:bg-indigo-200 flex items-center">
            <User size={16} className="mr-2" />
            View Requests
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Verification Status</h2>
          <div className="flex items-center mb-4">
            <div className={`w-3 h-3 rounded-full mr-2 ${user.isVerified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
            <span className={user.isVerified ? 'text-green-700' : 'text-amber-700'}>
              {user.isVerified ? 'Verified Account' : 'Verification Pending'}
            </span>
          </div>
          {!user.isVerified && (
            <button 
              onClick={() => navigate('/verification')}
              className="bg-indigo-100 text-indigo-700 py-2 px-4 rounded hover:bg-indigo-200"
            >
              Complete Verification
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

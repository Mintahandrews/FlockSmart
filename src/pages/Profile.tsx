import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [university, setUniversity] = useState(user?.profile?.university || '');
  const [major, setMajor] = useState(user?.profile?.major || '');
  const [graduationYear, setGraduationYear] = useState(user?.profile?.graduationYear || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [skills, setSkills] = useState<string[]>(user?.profile?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user?.profile) {
      setUniversity(user.profile.university || '');
      setMajor(user.profile.major || '');
      setGraduationYear(user.profile.graduationYear || '');
      setBio(user.profile.bio || '');
      setSkills(user.profile.skills || []);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUser({
      profile: {
        university,
        major,
        graduationYear,
        bio,
        skills
      }
    });
    
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
      
      {successMessage && (
        <div className="bg-green-50 text-green-600 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
              University/College
            </label>
            <input
              id="university"
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
              Major/Field of Study
            </label>
            <input
              id="major"
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
            Expected Graduation Year
          </label>
          <input
            id="graduationYear"
            type="text"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio/About Me
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Skills & Expertise
          </label>
          <div className="flex">
            <input
              id="skills"
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a skill and press Enter"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={addSkill}
              className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div 
                key={index} 
                className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full flex items-center"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 text-indigo-500 hover:text-indigo-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <Save size={16} />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

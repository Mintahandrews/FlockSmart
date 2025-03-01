import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, GraduationCap, Shield, UserPlus } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'seeker' | 'provider'>('seeker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedIntegrity, setAcceptedIntegrity] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (!acceptedTerms || !acceptedIntegrity) {
      return setError('You must agree to the terms and academic integrity policy');
    }
    
    setLoading(true);
    
    try {
      await register(email, password, name, role);
      navigate('/verification');
    } catch (err: any) {
      setError(err.message || 'Failed to create an account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create an Account</h2>
        <p className="text-gray-600">Join PeerLearn to connect with academic peers</p>
      </div>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I am a:
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('seeker')}
              className={`p-4 border rounded-md flex flex-col items-center justify-center gap-2 ${
                role === 'seeker' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <BookOpen size={24} />
              <span className="font-medium">Student Seeking Help</span>
            </button>
            
            <button
              type="button"
              onClick={() => setRole('provider')}
              className={`p-4 border rounded-md flex flex-col items-center justify-center gap-2 ${
                role === 'provider' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <GraduationCap size={24} />
              <span className="font-medium">Academic Helper</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="mt-1 mr-2"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the <Link to="/terms" className="text-indigo-600 hover:text-indigo-800">Terms of Service</Link> and <Link to="/privacy" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</Link>
            </label>
          </div>
          
          <div className="flex items-start">
            <input
              id="integrity"
              type="checkbox"
              checked={acceptedIntegrity}
              onChange={() => setAcceptedIntegrity(!acceptedIntegrity)}
              className="mt-1 mr-2"
            />
            <label htmlFor="integrity" className="text-sm text-gray-600 flex">
              <span className="mr-1">I agree to uphold the</span>
              <Link to="/academic-integrity" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                Academic Integrity Policy
                <Shield size={14} className="ml-1" />
              </Link>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
            loading || !acceptedTerms || !acceptedIntegrity
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Creating Account...' : (
            <>
              <UserPlus size={16} />
              Create Account
            </>
          )}
        </button>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

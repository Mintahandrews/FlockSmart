import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Upload } from 'lucide-react';

const Verification = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // For MVP - just simple checkbox verification
  const [agreements, setAgreements] = useState({
    identity: false,
    academic: false,
    terms: false
  });

  const allAgreed = Object.values(agreements).every(v => v === true);

  const handleVerification = async () => {
    if (!allAgreed) return;
    
    setLoading(true);
    
    try {
      // In a real app, this would trigger actual verification processes
      // For MVP, we just mark the user as verified
      await updateUser({ isVerified: true });
      navigate('/profile');
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  if (user.isVerified) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <ShieldCheck size={36} className="text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Complete</h2>
        <p className="text-gray-600 mb-6">
          Your account has been verified. You can now fully use the platform.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Verify Your Account</h2>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          To ensure the quality and safety of our community, we need to verify your identity and academic credentials.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Identity Verification</h3>
          <p className="text-gray-600 mb-4">
            Please verify that you are who you claim to be. In a full implementation, you would upload your ID here.
          </p>
          
          <div className="mb-4">
            <button className="border border-gray-300 bg-gray-50 text-gray-700 py-2 px-4 rounded flex items-center gap-2">
              <Upload size={16} />
              Upload ID (Disabled in Demo)
            </button>
          </div>
          
          <div className="flex items-start">
            <input
              id="identity"
              type="checkbox"
              checked={agreements.identity}
              onChange={() => setAgreements({ ...agreements, identity: !agreements.identity })}
              className="mt-1 mr-2"
            />
            <label htmlFor="identity" className="text-sm text-gray-600">
              I affirm that I am the person I claim to be and the information provided is accurate.
            </label>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Academic Verification</h3>
          <p className="text-gray-600 mb-4">
            Please verify your academic qualifications. In a full implementation, you would upload transcripts here.
          </p>
          
          <div className="mb-4">
            <button className="border border-gray-300 bg-gray-50 text-gray-700 py-2 px-4 rounded flex items-center gap-2">
              <Upload size={16} />
              Upload Transcript (Disabled in Demo)
            </button>
          </div>
          
          <div className="flex items-start">
            <input
              id="academic"
              type="checkbox"
              checked={agreements.academic}
              onChange={() => setAgreements({ ...agreements, academic: !agreements.academic })}
              className="mt-1 mr-2"
            />
            <label htmlFor="academic" className="text-sm text-gray-600">
              I affirm that my academic background is as stated and I have the qualifications I claim to have.
            </label>
          </div>
        </div>

        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            checked={agreements.terms}
            onChange={() => setAgreements({ ...agreements, terms: !agreements.terms })}
            className="mt-1 mr-2"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the Terms of Service and understand that misrepresentation may result in account termination.
          </label>
        </div>
        
        <button
          onClick={handleVerification}
          disabled={!allAgreed || loading}
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
            allAgreed 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShieldCheck size={16} />
          {loading ? 'Processing...' : 'Complete Verification'}
        </button>
      </div>
    </div>
  );
};

export default Verification;

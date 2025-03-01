import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';

interface PremiumFeatureGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  featureName: string;
  minimumTier?: 'premium' | 'enterprise';
}

const PremiumFeatureGate = ({ 
  children, 
  fallback, 
  featureName,
  minimumTier = 'premium'
}: PremiumFeatureGateProps) => {
  const { user } = useAuth();
  
  // Check if user has access
  const hasAccess = () => {
    if (!user) return false;
    
    if (minimumTier === 'premium') {
      return user.subscription === 'premium' || user.subscription === 'enterprise';
    }
    
    if (minimumTier === 'enterprise') {
      return user.subscription === 'enterprise';
    }
    
    return false;
  };
  
  if (hasAccess()) {
    return <>{children}</>;
  }
  
  // Default fallback if none provided
  if (!fallback) {
    return (
      <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
          <LockKeyhole className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium mb-2">Premium Feature</h3>
        <p className="text-gray-600 mb-4">{featureName} is available for Premium subscribers.</p>
        <Link 
          to="/pricing" 
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upgrade Now
        </Link>
      </div>
    );
  }
  
  return <>{fallback}</>;
};

export default PremiumFeatureGate;

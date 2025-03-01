import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateSubscription } = useAuth();
  
  const { plan, paymentMethod } = location.state || {};
  
  useEffect(() => {
    if (plan) {
      // Update user subscription in state and local storage
      updateSubscription(plan.tier);
    }
  }, [plan, updateSubscription]);

  if (!plan || !paymentMethod) {
    // Redirect to pricing if no plan info
    setTimeout(() => navigate('/pricing'), 1000);
    return <div className="text-center py-12">Redirecting...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-center">
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <Check className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for upgrading to FlockSmart {plan.name}
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6 max-w-md mx-auto">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Plan:</span>
            <span className="font-medium">{plan.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">${plan.price.toFixed(2)} / {plan.interval}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">{paymentMethod.name}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Your Premium Features</h3>
          <ul className="space-y-2 text-left max-w-md mx-auto">
            {plan.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

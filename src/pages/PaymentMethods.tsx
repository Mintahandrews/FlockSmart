import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PAYMENT_METHODS } from '../utils/premium';
import { Apple, ArrowLeft, ChartBar, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { formatCurrency } from '../utils';

const PaymentMethods = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  const { plan, amount } = location.state || {};
  
  if (!plan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium">No plan selected</h2>
        <button 
          onClick={() => navigate('/pricing')} 
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Return to Pricing
        </button>
      </div>
    );
  }

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    
    setIsProcessing(true);
    
    // In a real app, this would call your payment API
    // For this demo, we'll just simulate a payment process
    setTimeout(() => {
      navigate('/payment-success', { 
        state: { 
          plan,
          paymentMethod: PAYMENT_METHODS.find(m => m.id === selectedMethod)
        } 
      });
    }, 2000);
  };

  const getIconForPaymentMethod = (type: string) => {
    switch(type) {
      case 'credit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'mobile_money':
        return <Smartphone className="h-5 w-5" />;
      case 'paypal':
        return <DollarSign className="h-5 w-5" />;
      case 'flutterwave':
      case 'paystack':
        return <ChartBar className="h-5 w-5" />;
      case 'apple_pay':
        return <Apple className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button 
        onClick={() => navigate('/pricing')} 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Return to Pricing
      </button>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-medium">Choose a Payment Method</h2>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Payment Summary</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Billing:</span>
                <span className="font-medium">{plan.interval === 'month' ? 'Monthly' : 'Yearly'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{formatCurrency(amount)}</span>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-4">Available Payment Methods</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PAYMENT_METHODS.map((method) => (
              <div 
                key={method.id}
                className={`border rounded-md p-4 cursor-pointer hover:border-blue-500 transition-colors ${
                  selectedMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center">
                  <div className="mr-3 bg-blue-100 p-2 rounded-full">
                    {getIconForPaymentMethod(method.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{method.name}</h4>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <button
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                !selectedMethod || isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
            </button>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Your payment information is secure and encrypted</p>
            <p className="mt-1">5% platform fee included in all transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;

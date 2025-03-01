import { useState } from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { PaymentMethodType } from '../../types/payments';
import { X } from 'lucide-react';

const PAYMENT_METHOD_OPTIONS: Array<{
  type: PaymentMethodType,
  name: string,
  icon: string
}> = [
  // Mobile Money
  { 
    type: 'mpesa', 
    name: 'M-Pesa', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/320px-M-PESA_LOGO-01.svg.png'
  },
  { 
    type: 'mtn', 
    name: 'MTN Mobile Money', 
    icon: 'https://seeklogo.com/images/M/mtn-mobile-money-logo-506F6D42BE-seeklogo.com.png'
  },
  
  // Regional Processors
  { 
    type: 'flutterwave', 
    name: 'Flutterwave', 
    icon: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/fkrm2hqvypho5dkvjegp'
  },
  { 
    type: 'paystack', 
    name: 'Paystack', 
    icon: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1456983532/sckzw9xbvqj403snz2q5.jpg'
  },
  
  // Global Solutions
  { 
    type: 'visa', 
    name: 'Visa Card', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/200px-Visa.svg.png'
  },
  { 
    type: 'mastercard', 
    name: 'Mastercard', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/200px-Mastercard_2019_logo.svg.png'
  },
  { 
    type: 'paypal', 
    name: 'PayPal', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/124px-PayPal.svg.png'
  },
  { 
    type: 'applepay', 
    name: 'Apple Pay', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/120px-Apple_Pay_logo.svg.png'
  }
];

interface AddPaymentMethodModalProps {
  onClose: () => void;
  onPaymentMethodAdded: (method: any) => void;
}

const AddPaymentMethodModal = ({ onClose, onPaymentMethodAdded }: AddPaymentMethodModalProps) => {
  const { addPaymentMethod } = usePayment();
  const [selectedType, setSelectedType] = useState<PaymentMethodType | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPaymentMethod = async () => {
    if (!selectedType) {
      setError('Please select a payment method');
      return;
    }

    let details = '';
    let isValid = false;

    // Validate based on payment method type
    if (['visa', 'mastercard'].includes(selectedType)) {
      if (!cardNumber || !expiryDate || !cvv) {
        setError('Please fill in all card details');
        return;
      }
      
      // Basic validation for demo purposes
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setError('Invalid card number');
        return;
      }
      
      details = `Card ending in ${cardNumber.slice(-4)}`;
      isValid = true;
    } else if (['mpesa', 'mtn'].includes(selectedType)) {
      if (!accountNumber) {
        setError('Please enter your mobile number');
        return;
      }
      
      if (accountNumber.length < 10) {
        setError('Invalid mobile number');
        return;
      }
      
      details = `${accountNumber}`;
      isValid = true;
    } else {
      // For other payment methods like PayPal, just use a dummy email
      details = 'Connected account';
      isValid = true;
    }

    if (!isValid) {
      setError('Invalid payment details');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const selectedOption = PAYMENT_METHOD_OPTIONS.find(opt => opt.type === selectedType);
      if (!selectedOption) throw new Error('Invalid payment method');
      
      const newMethod = await addPaymentMethod({
        type: selectedType,
        name: selectedOption.name,
        details,
        icon: selectedOption.icon
      });
      
      onPaymentMethodAdded(newMethod);
    } catch (err: any) {
      setError(err.message || 'Failed to add payment method');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Payment Method</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHOD_OPTIONS.map((option) => (
              <div
                key={option.type}
                onClick={() => setSelectedType(option.type)}
                className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-colors ${
                  selectedType === option.type
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <img
                  src={option.icon}
                  alt={option.name}
                  className="h-8 mb-2 object-contain"
                />
                <span className="text-sm text-center">{option.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Conditional form fields based on selected payment method */}
        {selectedType && (
          <div className="space-y-4">
            {['visa', 'mastercard'].includes(selectedType) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </>
            )}
            
            {['mpesa', 'mtn'].includes(selectedType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="+254 712 345 678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            
            {['paypal', 'flutterwave', 'paystack', 'applepay'].includes(selectedType) && (
              <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
                You'll be redirected to connect your account when making a payment.
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="mr-3 px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleAddPaymentMethod}
            disabled={isLoading || !selectedType}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md ${
              isLoading || !selectedType
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'Adding...' : 'Add Payment Method'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;

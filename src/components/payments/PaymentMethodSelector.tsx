import { useState } from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { PaymentMethod } from '../../types/payments';
import { Check, CreditCard, Plus } from 'lucide-react';
import AddPaymentMethodModal from './AddPaymentMethodModal';

interface PaymentMethodSelectorProps {
  onSelect: (paymentMethod: PaymentMethod) => void;
  selectedMethodId?: string;
}

const PaymentMethodSelector = ({ onSelect, selectedMethodId }: PaymentMethodSelectorProps) => {
  const { paymentMethods } = usePayment();
  const [showAddModal, setShowAddModal] = useState(false);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    onSelect(method);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Payment Method</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
        >
          <Plus size={14} className="mr-1" />
          Add New
        </button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
          <CreditCard className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-gray-600 mb-3">No payment methods added yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white py-1.5 px-3 rounded-md hover:bg-indigo-700 text-sm"
          >
            Add Payment Method
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handlePaymentMethodSelect(method)}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                method.id === selectedMethodId || (method.isDefault && !selectedMethodId)
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
              }`}
            >
              <img 
                src={method.icon} 
                alt={method.name} 
                className="w-8 h-8 mr-3 object-contain"
              />
              <div className="flex-1">
                <p className="font-medium">{method.name}</p>
                <p className="text-sm text-gray-500">{method.details}</p>
              </div>
              {(method.id === selectedMethodId || (method.isDefault && !selectedMethodId)) && (
                <Check size={20} className="text-indigo-600" />
              )}
              {method.isDefault && (
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded ml-2">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddPaymentMethodModal
          onClose={() => setShowAddModal(false)}
          onPaymentMethodAdded={(method) => {
            setShowAddModal(false);
            onSelect(method);
          }}
        />
      )}
    </div>
  );
};

export default PaymentMethodSelector;

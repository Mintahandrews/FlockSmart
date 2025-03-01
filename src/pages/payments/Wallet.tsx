import { useState } from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { useAuth } from '../../contexts/AuthContext';
import { Currency } from '../../types/payments';
import { ArrowRight, ArrowUp, CircleArrowDown, Clock, CreditCard, X } from 'lucide-react';
import PaymentMethodSelector from '../../components/payments/PaymentMethodSelector';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const WalletIcon = ({ className, size }: { className?: string; size?: number }) => {
  return <CreditCard className={className} size={size} />;
};

const Wallet = () => {
  const { user } = useAuth();
  const { wallet, transactions, depositToWallet, withdrawFromWallet, paymentMethods } = usePayment();
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!user) return <div>Loading...</div>;
  
  const supportedCurrencies: Currency[] = ['USD', 'KES', 'NGN', 'ZAR', 'GHS', 'EUR', 'GBP'];
  
  // Get last 5 transactions for the wallet
  const recentTransactions = transactions
    .filter(t => t.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!selectedPaymentMethodId) {
      toast.error('Please select a payment method');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await depositToWallet(parseFloat(amount), currency, selectedPaymentMethodId);
      
      if (result.success) {
        toast.success('Deposit successful');
        setShowDepositModal(false);
        setAmount('');
      } else {
        toast.error(result.error || 'Deposit failed');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('An error occurred during deposit');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!selectedPaymentMethodId) {
      toast.error('Please select a payment method');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await withdrawFromWallet(parseFloat(amount), currency, selectedPaymentMethodId);
      
      if (result.success) {
        toast.success('Withdrawal successful');
        setShowWithdrawModal(false);
        setAmount('');
      } else {
        toast.error(result.error || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('An error occurred during withdrawal');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatCurrency = (value: number, currencyCode: Currency) => {
    const symbols: Record<Currency, string> = {
      USD: '$',
      KES: 'KSh',
      NGN: '₦',
      ZAR: 'R',
      GHS: 'GH₵',
      EUR: '€',
      GBP: '£'
    };
    
    return `${symbols[currencyCode]}${value.toFixed(2)}`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <WalletIcon className="text-indigo-600 mr-3" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Wallet Balance</h2>
            </div>
            <Link
              to="/profile"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors">
                <CreditCard size={16} />
                <span>My Account</span>
              </button>
            </Link>
          </div>
          
          <div className="mt-2 mb-6">
            <div className="text-3xl font-bold text-gray-900">
              {wallet ? formatCurrency(wallet.balance, wallet.currency) : '$0.00'}
            </div>
            <p className="text-gray-500 mt-1">
              Currency: {wallet?.currency || 'USD'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setShowDepositModal(true);
                setSelectedPaymentMethodId(paymentMethods.find(m => m.isDefault)?.id || '');
              }}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center"
            >
              <CircleArrowDown size={16} className="mr-2" />
              Deposit
            </button>
            <button
              onClick={() => {
                setShowWithdrawModal(true);
                setSelectedPaymentMethodId(paymentMethods.find(m => m.isDefault)?.id || '');
              }}
              className="bg-indigo-100 text-indigo-700 py-2 px-4 rounded-md hover:bg-indigo-200 flex items-center"
            >
              <ArrowUp size={16} className="mr-2" />
              Withdraw
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Clock className="text-indigo-600 mr-3" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          </div>
          
          {recentTransactions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No recent transactions
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className="border-b border-gray-100 pb-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                    </div>
                    <div className={`text-right ${
                      transaction.type === 'deposit' 
                        ? 'text-green-600' 
                        : transaction.type === 'withdrawal' 
                          ? 'text-red-600' 
                          : 'text-gray-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Link to="/transactions" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center justify-center mt-4">
            View all transactions <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
      
      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button 
              onClick={() => setShowDepositModal(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-semibold mb-4">Deposit to Wallet</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {supportedCurrencies.map((curr) => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
              
              <PaymentMethodSelector
                onSelect={(method) => setSelectedPaymentMethodId(method.id)}
                selectedMethodId={selectedPaymentMethodId}
              />
              
              <button
                onClick={handleDeposit}
                disabled={isProcessing || !amount || parseFloat(amount) <= 0 || !selectedPaymentMethodId}
                className={`w-full py-2 px-4 rounded-md ${
                  isProcessing || !amount || parseFloat(amount) <= 0 || !selectedPaymentMethodId
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Deposit Funds'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button 
              onClick={() => setShowWithdrawModal(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-semibold mb-4">Withdraw from Wallet</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {supportedCurrencies.map((curr) => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
              
              <PaymentMethodSelector
                onSelect={(method) => setSelectedPaymentMethodId(method.id)}
                selectedMethodId={selectedPaymentMethodId}
              />
              
              <button
                onClick={handleWithdraw}
                disabled={isProcessing || !amount || parseFloat(amount) <= 0 || !selectedPaymentMethodId}
                className={`w-full py-2 px-4 rounded-md ${
                  isProcessing || !amount || parseFloat(amount) <= 0 || !selectedPaymentMethodId
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Withdraw Funds'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;

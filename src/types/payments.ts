export type PaymentMethodType = 
  // Mobile Money
  | 'mpesa' 
  | 'mtn' 
  // Regional Processors
  | 'flutterwave' 
  | 'paystack' 
  // Global Solutions
  | 'visa' 
  | 'mastercard' 
  | 'paypal' 
  | 'applepay'
  | 'wallet';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  details: string;
  isDefault: boolean;
  lastUsed?: string;
  icon: string;
}

export type Currency = 'USD' | 'KES' | 'NGN' | 'ZAR' | 'GHS' | 'EUR' | 'GBP';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  exchangeRate: number; // Relative to USD
}

export type TransactionStatus = 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'refunded';

export type TransactionType = 
  | 'payment' 
  | 'refund' 
  | 'deposit' 
  | 'withdrawal'
  | 'commission';

export interface Transaction {
  id: string;
  userId: string;
  serviceId?: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  type: TransactionType;
  paymentMethodId: string;
  description: string;
  platformFee?: number;
  createdAt: string;
  updatedAt: string;
  recipient?: string;
  sender?: string;
  reference: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: Currency;
  updatedAt: string;
  transactions: Transaction[];
}

export interface PaymentProcessorResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
  status?: TransactionStatus;
}

export interface PaymentInitiationData {
  amount: number;
  currency: Currency;
  description: string;
  serviceId?: string;
  recipientId?: string;
}

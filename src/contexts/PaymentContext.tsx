import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import {
  PaymentMethod,
  Transaction,
  Wallet,
  Currency,
  PaymentMethodType,
  TransactionStatus,
  PaymentInitiationData,
  PaymentProcessorResponse,
  CurrencyInfo
} from "../types/payments";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import { getUserCurrency } from "../utils/currency";

// Exchange rates with descriptions and symbols
const CURRENCY_INFO: Record<Currency, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 1.0 },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', exchangeRate: 130.25 },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', exchangeRate: 455.5 },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', exchangeRate: 18.75 },
  GHS: { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', exchangeRate: 12.35 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.78 }
};

// Platform commission rate for transactions
const PLATFORM_COMMISSION_RATE = 0.05; // 5% commission

interface PaymentContextType {
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  wallet: Wallet | null;
  isLoading: boolean;
  userCurrency: Currency;
  addPaymentMethod: (
    method: Omit<PaymentMethod, "id" | "isDefault" | "lastUsed">
  ) => Promise<PaymentMethod>;
  removePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
  initiatePayment: (
    data: PaymentInitiationData
  ) => Promise<PaymentProcessorResponse>;
  getTransactionById: (id: string) => Transaction | undefined;
  depositToWallet: (
    amount: number,
    currency: Currency,
    paymentMethodId: string
  ) => Promise<PaymentProcessorResponse>;
  withdrawFromWallet: (
    amount: number,
    currency: Currency,
    paymentMethodId: string
  ) => Promise<PaymentProcessorResponse>;
  convertCurrency: (amount: number, from: Currency, to: Currency) => number;
  updateUserCurrency: (currency: Currency) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

// Define supported payment methods by region/country
const SUPPORTED_PAYMENT_METHODS: Record<string, PaymentMethodType[]> = {
  DEFAULT: ["visa", "mastercard", "paypal"],
  KE: ["mpesa", "visa", "mastercard", "paypal"],
  NG: ["paystack", "flutterwave", "visa", "mastercard", "paypal"],
  GH: ["mtn", "visa", "mastercard", "paypal"],
  ZA: ["visa", "mastercard", "applepay", "paypal"],
  EU: ["visa", "mastercard", "applepay", "paypal"],
  GB: ["visa", "mastercard", "applepay", "paypal"]
};

export const PaymentProvider = ({ children }: PaymentProviderProps) => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState<Currency>("USD");
  const [supportedPaymentMethods, setSupportedPaymentMethods] = useState<
    PaymentMethodType[]
  >(SUPPORTED_PAYMENT_METHODS.DEFAULT);

  // Detect user's currency and supported payment methods based on location
  useEffect(() => {
    const detectUserCurrency = async () => {
      try {
        const { currency, countryCode } = await getUserCurrency();
        setUserCurrency(currency as Currency);

        // Set supported payment methods based on country
        const countryMethods =
          SUPPORTED_PAYMENT_METHODS[countryCode] ||
          SUPPORTED_PAYMENT_METHODS.DEFAULT;
        setSupportedPaymentMethods(countryMethods);
      } catch (error) {
        console.error("Error detecting user currency:", error);
        // Fallback to defaults
        setUserCurrency("USD");
        setSupportedPaymentMethods(SUPPORTED_PAYMENT_METHODS.DEFAULT);
      }
    };

    detectUserCurrency();
  }, []);

  // Load payment data from localStorage
  useEffect(() => {
    if (user) {
      loadUserPaymentData();
    } else {
      setPaymentMethods([]);
      setTransactions([]);
      setWallet(null);
      setIsLoading(false);
    }
  }, [user]);

  const loadUserPaymentData = () => {
    setIsLoading(true);
    try {
      // Load payment methods
      const storedMethods = localStorage.getItem(`paymentMethods_${user?.id}`);
      if (storedMethods) {
        setPaymentMethods(JSON.parse(storedMethods));
      }

      // Load transactions
      const storedTransactions = localStorage.getItem(
        `transactions_${user?.id}`
      );
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }

      // Load wallet
      const storedWallet = localStorage.getItem(`wallet_${user?.id}`);
      if (storedWallet) {
        const walletData = JSON.parse(storedWallet);
        // Update wallet currency if it differs from user's preferred currency
        if (walletData.currency !== userCurrency) {
          const updatedWallet = {
            ...walletData,
            balance: convertCurrency(
              walletData.balance,
              walletData.currency,
              userCurrency
            ),
            currency: userCurrency,
          };
          setWallet(updatedWallet);
          localStorage.setItem(
            `wallet_${user?.id}`,
            JSON.stringify(updatedWallet)
          );
        } else {
          setWallet(walletData);
        }
      } else if (user) {
        const newWallet: Wallet = {
          id: `wallet_${user.id}`,
          userId: user.id,
          balance: 0,
          currency: userCurrency,
          updatedAt: new Date().toISOString(),
          transactions: [],
        };
        setWallet(newWallet);
        localStorage.setItem(`wallet_${user.id}`, JSON.stringify(newWallet));
      }
    } catch (error) {
      console.error("Error loading payment data:", error);
      toast.error("Failed to load payment data");
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `paymentMethods_${user.id}`,
        JSON.stringify(paymentMethods)
      );
    }
  }, [paymentMethods, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `transactions_${user.id}`,
        JSON.stringify(transactions)
      );
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user && wallet) {
      localStorage.setItem(`wallet_${user.id}`, JSON.stringify(wallet));
    }
  }, [wallet, user]);

  const addPaymentMethod = async (
    methodData: Omit<PaymentMethod, "id" | "isDefault" | "lastUsed">
  ) => {
    if (!user) throw new Error("User must be logged in");

    // Validate payment method type is supported
    if (!supportedPaymentMethods.includes(methodData.type)) {
      throw new Error("This payment method is not supported in your region");
    }

    const isFirst = paymentMethods.length === 0;
    const newMethod: PaymentMethod = {
      ...methodData,
      id: `pm_${Date.now()}`,
      isDefault: isFirst,
      lastUsed: isFirst ? new Date().toISOString() : undefined,
    };

    setPaymentMethods((prev) => [...prev, newMethod]);
    return newMethod;
  };

  // Update user's preferred currency
  const updateUserCurrency = (currency: Currency) => {
    if (!user || !wallet) return;

    // Convert wallet balance to new currency
    const newBalance = convertCurrency(
      wallet.balance,
      wallet.currency,
      currency
    );

    const updatedWallet = {
      ...wallet,
      balance: newBalance,
      currency,
      updatedAt: new Date().toISOString(),
    };

    setWallet(updatedWallet);
    setUserCurrency(currency);

    // Save to localStorage
    localStorage.setItem(`wallet_${user.id}`, JSON.stringify(updatedWallet));
  };

  const removePaymentMethod = async (id: string) => {
    if (!user) throw new Error("User must be logged in");

    const methodToRemove = paymentMethods.find((m) => m.id === id);
    if (!methodToRemove) throw new Error("Payment method not found");

    // Don't allow removing the default payment method
    if (methodToRemove.isDefault) {
      throw new Error("Cannot remove the default payment method");
    }

    setPaymentMethods((prevMethods) => prevMethods.filter((m) => m.id !== id));
  };

  const setDefaultPaymentMethod = async (id: string) => {
    if (!user) throw new Error("User must be logged in");

    setPaymentMethods((prevMethods) =>
      prevMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const getTransactionById = (id: string) => {
    return transactions.find((t) => t.id === id);
  };

  const convertCurrency = (amount: number, from: Currency, to: Currency) => {
    if (from === to) return amount;
    // Convert to USD first (if not already USD)
    const amountInUSD = from === "USD" ? amount : amount / CURRENCY_INFO[from].exchangeRate;
    // Then convert from USD to target currency
    return to === "USD" ? amountInUSD : amountInUSD * CURRENCY_INFO[to].exchangeRate;
  };

  // Simulate payment processing
  const processPayment = async (
    amount: number,
    currency: Currency,
    paymentMethodId: string,
    description: string,
    serviceId?: string,
    recipientId?: string
  ): Promise<PaymentProcessorResponse> => {
    if (!user) throw new Error("User must be logged in");

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Inside processPayment function
    // Create transaction
    const platformFee = amount * PLATFORM_COMMISSION_RATE;
    // Remove unused recipientAmount variable

    // Create main transaction record
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      userId: user.id,
      serviceId,
      amount,
      currency,
      status: "completed",
      type: "payment",
      paymentMethodId,
      description,
      platformFee,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recipient: recipientId,
      sender: user.id,
      reference: `REF${Math.floor(Math.random() * 1000000)}`,
    };

    // Create commission transaction record
    const commissionTransaction: Transaction = {
      id: `txn_commission_${Date.now()}`,
      userId: user.id,
      serviceId,
      amount: platformFee,
      currency,
      status: "completed",
      type: "commission",
      paymentMethodId,
      description: `Platform fee for ${description}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sender: user.id,
      reference: `COMM${Math.floor(Math.random() * 1000000)}`,
    };

    // Add transactions to state
    setTransactions((prev) => [...prev, transaction, commissionTransaction]);

    // Update payment method's lastUsed
    setPaymentMethods((prevMethods) =>
      prevMethods.map((method) =>
        method.id === paymentMethodId
          ? { ...method, lastUsed: new Date().toISOString() }
          : method
      )
    );

    return {
      success: true,
      transactionId: transaction.id,
      status: "completed",
    };
  };

  const initiatePayment = async (data: PaymentInitiationData) => {
    if (!user) throw new Error("User must be logged in");

    // Find default payment method if user has one
    const defaultPaymentMethod = paymentMethods.find((m) => m.isDefault);
    if (!defaultPaymentMethod) {
      return {
        success: false,
        error: "No payment method available",
      };
    }

    try {
      // Process the payment
      return await processPayment(
        data.amount,
        data.currency,
        defaultPaymentMethod.id,
        data.description,
        data.serviceId,
        data.recipientId
      );
    } catch (error) {
      console.error("Payment failed:", error);
      return {
        success: false,
        error: "Payment processing failed",
      };
    }
  };

  // Remove duplicate Wallet interface and fix status type
  const depositToWallet = async (
    amount: number,
    currency: Currency,
    paymentMethodId: string
  ) => {
    if (!user || !wallet) throw new Error("User must be logged in");

    try {
      // Convert currency if needed
      const amountInWalletCurrency = convertCurrency(
        amount,
        currency,
        wallet.currency
      );

      // Create transaction record
      const transaction: Transaction = {
        id: `txn_deposit_${Date.now()}`,
        userId: user.id,
        amount,
        currency,
        status: "completed" as TransactionStatus,
        type: "deposit",
        paymentMethodId,
        description: `Deposit to wallet`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reference: `DEP${Math.floor(Math.random() * 1000000)}`,
      };

      // Update transactions
      setTransactions((prev) => [...prev, transaction]);

      setWallet({
        ...wallet,
        balance: wallet.balance + amountInWalletCurrency,
        updatedAt: new Date().toISOString(),
        transactions: [...wallet.transactions, transaction],
      });

      return {
        success: true,
        transactionId: transaction.id,
        status: transaction.status,
      };
    } catch (error) {
      console.error("Deposit failed:", error);
      return {
        success: false,
        error: "Deposit failed",
      };
    }
  };

  const withdrawFromWallet = async (
    amount: number,
    currency: Currency,
    paymentMethodId: string
  ): Promise<PaymentProcessorResponse> => {
    if (!user || !wallet) throw new Error("User must be logged in");

    // Convert currency if needed
    const amountInWalletCurrency = convertCurrency(
      amount,
      currency,
      wallet.currency
    );

    // Check if wallet has sufficient funds
    if (wallet.balance < amountInWalletCurrency) {
      return {
        success: false,
        error: "Insufficient funds in wallet",
      };
    }

    try {
      // Create transaction record
      const transaction: Transaction = {
        id: `txn_withdrawal_${Date.now()}`,
        userId: user.id,
        amount,
        currency,
        status: "completed" as TransactionStatus,
        type: "withdrawal",
        paymentMethodId,
        description: `Withdrawal from wallet`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reference: `WTH${Math.floor(Math.random() * 1000000)}`,
      };

      // Update transactions
      setTransactions((prev) => [...prev, transaction]);

      // Update wallet balance
      setWallet({
        ...wallet,
        balance: wallet.balance - amountInWalletCurrency,
        updatedAt: new Date().toISOString(),
        transactions: [...wallet.transactions, transaction],
      });

      return {
        success: true,
        transactionId: transaction.id,
        status: transaction.status,
      };
    } catch (error) {
      console.error("Withdrawal failed:", error);
      return {
        success: false,
        error: "Withdrawal failed",
      };
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentMethods,
        transactions,
        wallet,
        isLoading,
        userCurrency,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        initiatePayment,
        getTransactionById,
        depositToWallet,
        withdrawFromWallet,
        convertCurrency,
        updateUserCurrency,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

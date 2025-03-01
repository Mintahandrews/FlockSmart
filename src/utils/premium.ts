import { PremiumFeature, PaymentMethod, SubscriptionTier } from '../types';

export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: '1',
    name: 'AI Insights & Recommendations',
    description: 'Get AI-powered insights and recommendations for optimal flock management',
    tier: 'premium',
  },
  {
    id: '2',
    name: 'Advanced Analytics',
    description: 'Access detailed analytics and performance metrics for your farm',
    tier: 'premium',
  },
  {
    id: '3',
    name: 'Vaccination Scheduling',
    description: 'Automated reminders and full vaccination management system',
    tier: 'premium',
    route: '/vaccinations'
  },
  {
    id: '4',
    name: 'Financial Dashboard',
    description: 'Comprehensive financial tracking and reporting',
    tier: 'premium',
    route: '/financial'
  },
  {
    id: '5',
    name: 'Unlimited Flocks',
    description: 'Manage unlimited number of flocks',
    tier: 'premium',
  },
  {
    id: '6',
    name: 'Production Forecasting',
    description: 'AI-driven production forecasting and planning',
    tier: 'enterprise',
  },
  {
    id: '7',
    name: 'Priority Support',
    description: '24/7 priority support from our team',
    tier: 'enterprise',
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'credit_card',
    type: 'credit_card',
    name: 'Credit/Debit Card',
    description: 'Pay with Visa, Mastercard, or other credit/debit cards',
    icon: 'CreditCard'
  },
  {
    id: 'mobile_money_mpesa',
    type: 'mobile_money',
    name: 'M-Pesa',
    description: 'Pay using M-Pesa mobile money',
    icon: 'Smartphone'
  },
  {
    id: 'mobile_money_mtn',
    type: 'mobile_money',
    name: 'MTN Mobile Money',
    description: 'Pay using MTN Mobile Money',
    icon: 'Smartphone'
  },
  {
    id: 'flutterwave',
    type: 'flutterwave',
    name: 'Flutterwave',
    description: 'Pay with bank transfer via Flutterwave',
    icon: 'BarChart'
  },
  {
    id: 'paystack',
    type: 'paystack',
    name: 'Paystack',
    description: 'Pay with bank transfer via Paystack',
    icon: 'CreditCard'
  },
  {
    id: 'paypal',
    type: 'paypal',
    name: 'PayPal',
    description: 'Pay using your PayPal account',
    icon: 'DollarSign'
  },
  {
    id: 'apple_pay',
    type: 'apple_pay',
    name: 'Apple Pay',
    description: 'Quick payment with Apple Pay',
    icon: 'Apple'
  }
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    price: 9.99,
    interval: 'month',
    description: 'Full access to all premium features',
    tier: 'premium' as SubscriptionTier,
    features: PREMIUM_FEATURES.filter(f => f.tier === 'premium').map(f => f.description)
  },
  {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    price: 99.99,
    interval: 'year',
    description: 'Save 16% with annual billing',
    tier: 'premium' as SubscriptionTier,
    features: PREMIUM_FEATURES.filter(f => f.tier === 'premium').map(f => f.description)
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 24.99,
    interval: 'month',
    description: 'For larger operations with advanced needs',
    tier: 'enterprise' as SubscriptionTier,
    features: PREMIUM_FEATURES.map(f => f.description)
  }
];

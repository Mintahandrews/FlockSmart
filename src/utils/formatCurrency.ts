type Currency = 'USD' | 'KES' | 'NGN' | 'ZAR' | 'GHS' | 'EUR' | 'GBP';

export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbols: Record<Currency, string> = {
    USD: '$',
    KES: 'KSh',
    NGN: '₦',
    ZAR: 'R',
    GHS: 'GH₵',
    EUR: '€',
    GBP: '£'
  };
  
  return `${symbols[currency]}${amount.toFixed(2)}`;
};
interface LocationResponse {
  country_code: string;
  currency: {
    code: string;
  };
}

export const getUserCurrency = async () => {
  try {
    // Try to get user's location via browser API
    await getCurrentPosition();
    
    // Use reverse geocoding to get country using ipapi
    const response = await fetch(`https://ipapi.co/json/`);
    const data = await response.json();
    const countryCode = data.country_code.toUpperCase();
    
    // Map country code to currency
    const currency = getCountryCurrency(countryCode);
    
    return {
      currency,
      countryCode
    };
  } catch (error) {
    console.error('Error getting user location:', error);
    
    // Fallback: Try to get location from IP
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data: LocationResponse = await response.json();
      
      return {
        currency: data.currency.code,
        countryCode: data.country_code
      };
    } catch (err) {
      console.error('Error getting location from IP:', err);
      return {
        currency: 'USD',
        countryCode: 'US'
      };
    }
  }
};

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getCountryCurrency = (countryCode: string): string => {
  const currencyMap: Record<string, string> = {
    US: 'USD',
    GB: 'GBP',
    EU: 'EUR',
    KE: 'KES',
    NG: 'NGN',
    ZA: 'ZAR',
    GH: 'GHS'
  };
  
  return currencyMap[countryCode] || 'USD';
};

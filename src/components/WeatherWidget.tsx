import { useState, useEffect } from 'react';
import { CloudRain, CloudSun, Sun, Thermometer, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  humidity: number;
  windSpeed: number;
}

const mockWeatherData: WeatherData = {
  temperature: 32,
  condition: 'sunny',
  humidity: 75,
  windSpeed: 5
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real application, you would fetch real weather data here
    // For demonstration, we'll use mock data with a timeout to simulate API fetch
    const timer = setTimeout(() => {
      setWeather({
        ...mockWeatherData,
        temperature: Math.floor(Math.random() * 7) + 28, // Random temp between 28-35°C (more realistic for Ghana)
      });
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="h-10 w-10 text-yellow-500" />;
      case 'cloudy':
        return <CloudSun className="h-10 w-10 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-10 w-10 text-blue-500" />;
      default:
        return <CloudSun className="h-10 w-10 text-gray-500" />;
    }
  };

  const getOptimalConditions = () => {
    // Simple logic for poultry optimal conditions adapted for Ghana's climate
    if (weather.temperature < 24) {
      return "Cooler than usual, good for birds";
    } else if (weather.temperature > 32) {
      return "Monitor for heat stress, ensure good ventilation";
    } else if (weather.humidity > 80) {
      return "High humidity: check ventilation";
    } else {
      return "Conditions acceptable for poultry";
    }
  };

  if (loading) {
    return <div className="text-center py-2 text-sm text-gray-500">Loading weather data...</div>;
  }

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-1">
        {getWeatherIcon()}
        <span className="text-2xl font-bold">{weather.temperature}°C</span>
      </div>
      
      <div className="grid grid-cols-2 gap-1 mt-2">
        <div className="flex items-center">
          <Thermometer className="h-3 w-3 mr-1" />
          <span className="text-xs">Humidity: {weather.humidity}%</span>
        </div>
        <div className="flex items-center">
          <Wind className="h-3 w-3 mr-1" />
          <span className="text-xs">Wind: {weather.windSpeed} km/h</span>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-blue-600 font-medium">
        {getOptimalConditions()}
      </div>
    </div>
  );
};

export default WeatherWidget;

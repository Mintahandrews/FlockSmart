import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold mt-1 text-gray-800">{value}</p>
          
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-1">
                {trend.isPositive ? '↑' : '↓'}
              </span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="ml-1 text-gray-500 text-xs">vs prev. period</span>
            </div>
          )}
        </div>
        <div className="bg-blue-50 p-3 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;

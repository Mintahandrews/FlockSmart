import { HealthAlert } from '../types';
import { formatDate } from '../utils';
import { CircleAlert, CircleCheck } from 'lucide-react';

interface AlertCardProps {
  alert: HealthAlert;
  onMarkAsRead: (id: string) => void;
}

const AlertCard = ({ alert, onMarkAsRead }: AlertCardProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} mb-3`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <CircleAlert className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium">{alert.flockName}</h3>
            <p className="text-sm">{alert.message}</p>
            <p className="text-xs mt-1 opacity-70">{formatDate(alert.date)}</p>
          </div>
        </div>
        {!alert.isRead && (
          <button 
            onClick={() => onMarkAsRead(alert.id)}
            className="text-sm flex items-center hover:underline"
          >
            <CircleCheck className="h-4 w-4 mr-1" />
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertCard;

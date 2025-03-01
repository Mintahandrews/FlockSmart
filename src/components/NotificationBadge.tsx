import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  count: number;
  onClick: () => void;
}

const NotificationBadge = ({ count, onClick }: NotificationBadgeProps) => {
  return (
    <button 
      onClick={onClick} 
      className="relative p-1 rounded-full hover:bg-gray-100 focus:outline-none"
    >
      <Bell className="h-5 w-5 text-gray-600" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
};

export default NotificationBadge;

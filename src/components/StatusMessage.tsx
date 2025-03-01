import { useState, useEffect } from 'react';
import { Squircle, Check, CircleX } from 'lucide-react';

interface StatusMessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number; // in milliseconds
  onClose?: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ 
  type, 
  message, 
  duration = 3000, 
  onClose 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'error':
        return <CircleX className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Squircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-md border ${getBackgroundColor()} z-50 animate-fade-in`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm">{message}</p>
        </div>
        <button 
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <CircleX className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default StatusMessage;

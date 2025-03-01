import { BookOpen, CalendarClock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Service } from '../../types/services';
import { formatCurrency } from '../../utils/formatCurrency';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-50 text-green-700';
      case 'intermediate': return 'bg-yellow-50 text-yellow-700';
      case 'advanced': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
            {service.title}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(service.status)}`}>
            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs flex items-center">
            <BookOpen size={12} className="mr-1" />
            {service.subjectArea}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs flex items-center ${getComplexityColor(service.complexity)}`}>
            {service.complexity.charAt(0).toUpperCase() + service.complexity.slice(1)}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <CalendarClock size={16} className="mr-1" />
            <span>Due: {formatDate(service.deadline)}</span>
          </div>
          <div className="flex items-center font-medium text-indigo-600">
            <DollarSign size={16} className="mr-1" />
            <span>{formatCurrency(service.budget, 'USD')}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Posted by: {service.creatorName}
        </div>
        <Link 
          to={`/services/${service.id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;

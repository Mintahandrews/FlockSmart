import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, MessageSquare, Star } from 'lucide-react';

interface TutorCardProps {
  tutor: {
    id: string;
    name: string;
    profile: {
      university?: string;
      major?: string;
      skills?: string[];
      bio?: string;
    };
    rating: number;
    completedSessions: number;
    image?: string;
  };
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-3">
        <div className="h-48 sm:h-auto bg-gray-100 flex items-center justify-center">
          {tutor.image ? (
            <img 
              src={tutor.image} 
              alt={tutor.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-2xl">
              {tutor.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="p-5 sm:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{tutor.name}</h3>
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <GraduationCap size={14} className="mr-1" />
                {tutor.profile.university || 'University not specified'}
              </p>
              
              <div className="flex items-center mb-3">
                <div className="flex items-center text-amber-500 mr-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      fill={i < Math.floor(tutor.rating) ? 'currentColor' : 'none'} 
                      size={14} 
                      className={i < Math.floor(tutor.rating) ? 'text-amber-500' : 'text-gray-300'}
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-600">{tutor.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-gray-500">{tutor.completedSessions} sessions completed</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {tutor.profile.bio || 'No bio available'}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {tutor.profile.skills?.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
            {(tutor.profile.skills?.length || 0) > 3 && (
              <span className="text-xs text-gray-500">+{(tutor.profile.skills?.length || 0) - 3} more</span>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <Link 
              to={`/tutors/${tutor.id}`}
              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
            >
              View Profile <ArrowRight size={14} className="ml-1" />
            </Link>
            <Link 
              to={`/messages/${tutor.id}`}
              className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-md text-sm flex items-center hover:bg-indigo-200"
            >
              <MessageSquare size={14} className="mr-1" />
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Award, 
  BookMarked, 
  BookOpen,
  CreditCard,
  GraduationCap,
  Home,
  LogOut,
  MessageSquare,
  Search,
  Shield,
  Users
} from 'lucide-react';
import { useMessages } from '../../contexts/MessageContext';

const DesktopSidebar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useMessages();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const primaryMenuItems = [
    {
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      show: !!user
    },
    {
      label: 'Services',
      icon: Search,
      path: '/services',
      show: true
    },
    {
      label: 'Tutors',
      icon: GraduationCap,
      path: '/tutors',
      show: true
    },
    {
      label: 'Messages',
      icon: MessageSquare,
      path: '/messages',
      show: !!user,
      badge: unreadCount > 0 ? unreadCount : undefined
    }
  ];

  const secondaryMenuItems = [
    {
      label: 'Resources',
      icon: BookMarked,
      path: '/resources',
      show: !!user
    },
    {
      label: 'Study Groups',
      icon: Users,
      path: '/study-groups',
      show: !!user
    },
    {
      label: 'Achievements',
      icon: Award,
      path: '/achievements',
      show: !!user
    }
  ];

  const tertiaryMenuItems = [
    {
      label: 'Wallet',
      icon: CreditCard,
      path: '/wallet',
      show: !!user
    },
    {
      label: 'Academic Integrity',
      icon: Shield,
      path: '/academic-integrity',
      show: true
    }
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <BookOpen size={24} />
          <span>PeerPact</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        <div className="space-y-1">
          {primaryMenuItems.filter(item => item.show).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Learning</div>
          {secondaryMenuItems.filter(item => item.show).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Other</div>
          {tertiaryMenuItems.filter(item => item.show).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {user && (
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 w-full text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DesktopSidebar;

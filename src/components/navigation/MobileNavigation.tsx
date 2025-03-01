import { Link, useLocation } from "react-router-dom";
import {
  CreditCard,
  GraduationCap,
  Home,
  LogOut,
  MessageSquare,
  Search,
} from "lucide-react";
import { useMessages } from "../../contexts/MessageContext";
import { useAuth } from "../../contexts/AuthContext";

interface MobileNavItem {
  label: string;
  icon: any; // Using 'any' for Lucide icons
  path: string;
  show: boolean;
  badge?: number;
  onClick?: () => void;
}

const MobileNavigation = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useMessages();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Only show essential navigation items on mobile
  const mobileNavItems: MobileNavItem[] = [
    {
      label: "Home",
      icon: Home,
      path: "/dashboard",
      show: !!user,
    },
    {
      label: "Services",
      icon: Search,
      path: "/services",
      show: true,
    },
    {
      label: "Tutors",
      icon: GraduationCap,
      path: "/tutors",
      show: true,
    },
    {
      label: "Messages",
      icon: MessageSquare,
      path: "/messages",
      show: !!user,
      badge: unreadCount,
    },
    {
      label: "Wallet",
      icon: CreditCard,
      path: "/wallet",
      show: !!user,
    },
    {
      label: "Logout",
      icon: LogOut,
      path: "#",
      show: !!user,
      onClick: logout,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {mobileNavItems
          .filter((item) => item.show)
          .map((item) =>
            item.onClick ? (
              <button
                key={item.path}
                onClick={item.onClick}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  isActive(item.path) ? "text-indigo-600" : "text-gray-600"
                }`}
              >
                <div className="relative">
                  <item.icon size={20} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  isActive(item.path) ? "text-indigo-600" : "text-gray-600"
                }`}
              >
                <div className="relative">
                  <item.icon size={20} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          )}
      </div>
    </div>
  );
};

export default MobileNavigation;

import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  House,
  LayoutList,
  Activity,
  ChartBar,
  Egg,
  Syringe,
  Banknote,
  User,
  CloudSun,
} from "lucide-react";
import NotificationBadge from "./NotificationBadge";
import WeatherWidget from "./WeatherWidget";

interface SidebarProps {
  notificationCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ notificationCount }) => {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full hidden md:flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <NavLink
          to="/"
          className="flex items-center text-xl font-bold text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="w-8 h-8 mr-2"
          >
            <path
              fill="#f6b873"
              d="M32.08 62s9.67-8.15 21.08-14c5.18-2.66 10.5-7.14 10.5-15.98C63.66 21.34 57.86 6 31.81 6 6.73 6 .34 21.34.34 32.02.34 40.86 5.8 45.34 10.84 48c11.41 5.85 21.24 14 21.24 14"
            />
            <path
              fill="#e8a368"
              d="M32.08 53c0 1-6.52-5.7-12.94-9.85-6.42-4.16-6.97-5-6.97-10.5s1.32-14.1 5.91-17.5c2.96-2.19 6.91-3.15 13.79-3.15s11.47.82 14.43 3.01c4.59 3.4 6.25 12 6.25 17.5s-1.13 6.32-7.55 10.47c-6.42 4.16-12.93 9 -12.93 10"
            />
            <path
              fill="#fbbf67"
              d="M33.5 5.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5"
            />
            <path
              fill="#d13b3b"
              d="M33.5 9.5C32.12 9.5 31 10.62 31 12s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5"
            />
            <ellipse cx="24.5" cy="27.5" rx="3.5" ry="4.5" fill="#1a1626" />
            <ellipse cx="42.5" cy="27.5" rx="3.5" ry="4.5" fill="#1a1626" />
            <path
              fill="#d13b3b"
              d="M33.5 19c-2.76 0-5 .9-5 2 0 .51 2.9 8 5.38 8 2.7 0 4.62-7.49 4.62-8 0-1.1-2.24-2-5-2"
            />
            <path
              fill="#fbce9d"
              d="M35.71 42.14c-1.86-.1-3.57.4-3.84 1.12-.32.85 1.86 1.62 3.9 1.73 2.05.1 3.81-.36 3.94-1.03.14-.67-2.13-1.71-4-1.82"
            />
          </svg>
          FlockSmart
        </NavLink>
        <NotificationBadge count={notificationCount} onClick={() => {}} />
      </div>
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700"
                }`
              }
              end
            >
              <House className="h-5 w-5 mr-3" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/flocks"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <LayoutList className="h-5 w-5 mr-3" />
              Flock Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/health"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <Activity className="h-5 w-5 mr-3" />
              Flock Health
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <ChartBar className="h-5 w-5 mr-3" />
              Feed Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/production"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <Egg className="h-5 w-5 mr-3" />
              Production & Sales
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mortality"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <Activity className="h-5 w-5 mr-3 text-red-500" />
              Mortality Tracker
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vaccinations"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <Syringe className="h-5 w-5 mr-3" />
              Vaccinations
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/financial"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <Banknote className="h-5 w-5 mr-3" />
              Financial
            </NavLink>
          </li>
          <li className="pt-4 mt-4 border-t border-gray-100">
            <NavLink
              to="/account"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <User className="h-5 w-5 mr-3" />
              My Account
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="px-4 mt-auto pb-4">
        <div className="p-3 bg-blue-50 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <CloudSun className="h-4 w-4 mr-2 text-blue-500" />
            <h3 className="text-sm font-medium">Weather</h3>
          </div>
          <WeatherWidget />
        </div>
      </div>

      {user && (
        <div className="flex items-center text-sm bg-white p-3 rounded-lg border border-gray-100">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
            <span className="font-medium text-blue-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="overflow-hidden">
            <div className="font-medium truncate">{user.name}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

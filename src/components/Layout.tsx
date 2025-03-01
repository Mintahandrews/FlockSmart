import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useAuth } from '../contexts/AuthContext';
import { isPremiumRoute } from '../utils';

interface LayoutProps {
  notificationCount: number;
}

const Layout: React.FC<LayoutProps> = ({ notificationCount }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  const isPremium = isPremiumRoute(location.pathname);
  const hasAccess = !isPremium || 
    (user && (user.subscription === 'premium' || user.subscription === 'enterprise'));
    
  if (isPremium && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isPremium && !hasAccess) {
    return <Navigate to="/pricing" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 font-sans">
      <Sidebar notificationCount={notificationCount} />
      <div className="flex-1 flex flex-col w-full relative">
        <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
          <MobileNav notificationCount={notificationCount} />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full h-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
            <div className="h-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

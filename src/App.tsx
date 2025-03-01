import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import DesktopSidebar from './components/navigation/DesktopSidebar';
import MobileNavigation from './components/navigation/MobileNavigation';
import Login from './pages/Login';
import Register from './pages/Register';
import SeekerDashboard from './pages/SeekerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import Profile from './pages/Profile';
import ServiceList from './pages/services/ServiceList';
import CreateService from './pages/services/CreateService';
import MessageList from './pages/messages/MessageList';
import Conversation from './pages/messages/Conversation';
import AcademicIntegrity from './pages/AcademicIntegrity';
import ResourceLibrary from './pages/learning/ResourceLibrary';
import StudyGroups from './pages/learning/StudyGroups';
import Achievements from './pages/learning/Achievements';
import Wallet from './pages/payments/Wallet';
import TutorDirectory from './pages/tutors/TutorDirectory';
import TutorProfile from './pages/tutors/TutorProfile';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Include required font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <DesktopSidebar />
      <MobileNavigation />
      
      <main className="lg:ml-64 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
              <Route 
                path="/dashboard" 
                element={
                  user ? (
                    user.role === 'seeker' ? <SeekerDashboard /> : <ProviderDashboard />
                  ) : <Navigate to="/login" />
                } 
              />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/services" element={<ServiceList />} />
              <Route path="/services/create" element={user ? <CreateService /> : <Navigate to="/login" />} />
              <Route path="/messages" element={user ? <MessageList /> : <Navigate to="/login" />} />
              <Route path="/messages/:userId" element={user ? <Conversation /> : <Navigate to="/login" />} />
              <Route path="/academic-integrity" element={<AcademicIntegrity />} />
              <Route path="/resources" element={user ? <ResourceLibrary /> : <Navigate to="/login" />} />
              <Route path="/study-groups" element={user ? <StudyGroups /> : <Navigate to="/login" />} />
              <Route path="/achievements" element={user ? <Achievements /> : <Navigate to="/login" />} />
              <Route path="/wallet" element={user ? <Wallet /> : <Navigate to="/login" />} />
              <Route path="/tutors" element={<TutorDirectory />} />
              <Route path="/tutors/:id" element={<TutorProfile />} />
              <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </main>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
            border: '1px solid #e2e8f0',
            paddingLeft: '16px',
            paddingRight: '16px',
          }
        }}
        // Prevent duplicate toasts
        gutter={8}
      />
    </div>
  );
}

export default App;

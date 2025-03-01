import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { checkOverdueVaccinations } from "./utils";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useSupabaseData } from "./hooks/useSupabaseData";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FlockHealth from "./pages/FlockHealth";
import FeedManagement from "./pages/FeedManagement";
import Production from "./pages/Production";
import MortalityTracker from "./pages/MortalityTracker";
import VaccinationSchedule from "./pages/VaccinationSchedule";
import FinancialDashboard from "./pages/FinancialDashboard";
import FlockManagement from "./pages/FlockManagement";
import AIAssistant from "./components/AIAssistant";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Pricing from "./pages/Pricing";
import PaymentMethods from "./pages/PaymentMethods";
import PaymentSuccess from "./pages/PaymentSuccess";

import "./index.css";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-700">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AuthenticatedApp = () => {
  const { data, setData, isLoading } = useSupabaseData();
  const [notificationCount, setNotificationCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    // Update notification count
    if (data) {
      const unreadAlerts = data.healthAlerts.filter(
        (alert) => !alert.isRead
      ).length;
      const overdueVaccinations = checkOverdueVaccinations(data);
      setNotificationCount(unreadAlerts + overdueVaccinations);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-700">Loading your data...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={<Layout notificationCount={notificationCount} />}
          >
            <Route
              index
              element={<Dashboard data={data} setData={setData} />}
            />
            <Route
              path="flocks"
              element={<FlockManagement data={data} setData={setData} />}
            />
            <Route
              path="health"
              element={<FlockHealth data={data} setData={setData} />}
            />
            <Route
              path="feed"
              element={<FeedManagement data={data} setData={setData} />}
            />
            <Route
              path="production"
              element={<Production data={data} setData={setData} />}
            />
            <Route
              path="mortality"
              element={<MortalityTracker data={data} setData={setData} />}
            />
            <Route
              path="vaccinations"
              element={<VaccinationSchedule data={data} setData={setData} />}
            />
            <Route
              path="financial"
              element={<FinancialDashboard data={data} setData={setData} />}
            />
            <Route path="account" element={<Account />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="payment-methods" element={<PaymentMethods />} />
            <Route path="payment-success" element={<PaymentSuccess />} />

            {/* Catch all route - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
      {user &&
        (user.subscription === "premium" ||
          user.subscription === "enterprise") && <AIAssistant data={data} />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AuthenticatedApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { ServiceProvider } from './contexts/ServiceContext'
import { MessageProvider } from './contexts/MessageContext'
import { PaymentProvider } from './contexts/PaymentContext'
import { IntegrityProvider } from './contexts/IntegrityContext'
import { LearningProvider } from './contexts/LearningContext'
import { AchievementProvider } from './contexts/AchievementContext'
import { StudyGroupProvider } from './contexts/StudyGroupContext'
import { Toaster } from 'react-hot-toast'
import { initializeAppData } from './utils/dataInitializer.ts'
import './index.css'

// Initialize app data before rendering
initializeAppData();

// Display a toast message about the Supabase connection
const showConnectionInfo = () => {
  const infoToast = document.createElement('div');
  infoToast.className = 'bg-indigo-600 text-white p-3 rounded fixed top-4 right-4 max-w-xs shadow-lg z-50';
  infoToast.innerHTML = `
    <p class="font-medium mb-1">Database Connection Info</p>
    <p class="text-sm">
      This app can use Supabase but falls back to localStorage when not configured.
      Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to use your Supabase instance.
    </p>
    <button class="text-xs bg-white text-indigo-600 px-2 py-1 rounded mt-2">Dismiss</button>
  `;
  document.body.appendChild(infoToast);
  
  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    if (document.body.contains(infoToast)) {
      document.body.removeChild(infoToast);
    }
  }, 10000);
  
  // Dismiss on button click
  const dismissButton = infoToast.querySelector('button');
  if (dismissButton) {
    dismissButton.addEventListener('click', () => {
      document.body.removeChild(infoToast);
    });
  }
};

// Show the connection info toast after 2 seconds
setTimeout(showConnectionInfo, 2000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ServiceProvider>
          <PaymentProvider>
            <MessageProvider>
              <IntegrityProvider>
                <LearningProvider>
                  <AchievementProvider>
                    <StudyGroupProvider>
                      <App />
                      <Toaster position="top-right" />
                    </StudyGroupProvider>
                  </AchievementProvider>
                </LearningProvider>
              </IntegrityProvider>
            </MessageProvider>
          </PaymentProvider>
        </ServiceProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

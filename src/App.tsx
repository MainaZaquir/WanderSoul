import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import { setupGlobalErrorHandling } from './lib/errorLogger';
import { Layout } from './components/Layout';
import { CartProvider } from './context/CartContext';
import { CookieConsent } from './components/CookieConsent';

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const TripsPage = lazy(() => import('./pages/TripsPage').then(module => ({ default: module.TripsPage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(module => ({ default: module.ShopPage })));
const CommunityPage = lazy(() => import('./pages/CommunityPage').then(module => ({ default: module.CommunityPage })));
const SponsorshipPage = lazy(() => import('./pages/SponsorshipPage').then(module => ({ default: module.SponsorshipPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(module => ({ default: module.AuthPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));

setupGlobalErrorHandling();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/*" element={
                    <Layout>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/trips" element={<TripsPage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/sponsorship" element={<SponsorshipPage />} />
                      </Routes>
                    </Layout>
                  } />
                </Routes>
              </Suspense>
              
              <CookieConsent />
            </div>
          </Router>
        </CartProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
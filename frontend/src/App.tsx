// App.tsx
import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { LoadingProvider } from './contexts/LoadingContext.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import NavBarComponent from './layouts/NavBarComponent';
import PageTransitionWrapper from './components/PageTransitionWrapper';
import LazyPageWrapper from './components/LazyPageWrapper';
import Dashboard from './pages/Dashboard'; // Direct import, not lazy

// Lazy load other pages for better performance
const About = lazy(() => import('./pages/About'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const NewHome = lazy(() => import('./pages/NewHome'));
const ExampleI18nPage = lazy(() => import('./pages/ExampleI18nPage'));
const TestDashboard = lazy(() => import('./pages/TestDashboard'));
const AuthDebugTest = lazy(() => import('./components/AuthDebugTest'));
const RedirectTest = lazy(() => import('./components/RedirectTest'));

const App: React.FC = () => {
  return (
    <LoadingProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <NavBarComponent />
            <main className="flex-grow">
              <PageTransitionWrapper
                loadingMessages={[
                  'Loading...'
                ]}
                minimumLoadingTime={100}
              >
                <Routes>
                  <Route path="/" element={<NewHome />} />
                  <Route path="/about" element={
                    <LazyPageWrapper skeletonProps={{ title: true, paragraphs: 4 }}>
                      <About />
                    </LazyPageWrapper>
                  } />
                  <Route path="/login" element={
                    <LazyPageWrapper skeletonProps={{ title: true, paragraphs: 1, cards: 1 }}>
                      <Login />
                    </LazyPageWrapper>
                  } />
                  <Route path="/signup" element={
                    <LazyPageWrapper skeletonProps={{ title: true, paragraphs: 1, cards: 1 }}>
                      <Signup />
                    </LazyPageWrapper>
                  } />
                  <Route path="/i18n-example" element={
                    <LazyPageWrapper>
                      <ExampleI18nPage />
                    </LazyPageWrapper>
                  } />
                  <Route path="/debug-auth" element={
                    <LazyPageWrapper>
                      <AuthDebugTest />
                    </LazyPageWrapper>
                  } />
                  <Route path="/redirect-test" element={
                    <LazyPageWrapper>
                      <RedirectTest />
                    </LazyPageWrapper>
                  } />
                  <Route path="/test-dashboard" element={
                    <ProtectedRoute>
                      <LazyPageWrapper skeletonProps={{ title: true, paragraphs: 2, cards: 4 }}>
                        <TestDashboard />
                      </LazyPageWrapper>
                    </ProtectedRoute>
                  } />

                  {/* Main Dashboard Route - All users use this single dashboard */}
                  <Route
                    path="/dashboard/*"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </PageTransitionWrapper>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LoadingProvider>
  );
};

export default App;

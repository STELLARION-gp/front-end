// App.tsx
import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { LoadingProvider } from './contexts/LoadingContext.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import LazyPageWrapper from './components/LazyPageWrapper';
import BaseLayout from './layouts/BaseLayout';
import MainContentWrapper from './layouts/MainContentWrapper';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardRoutes from './routes/DashboardRoutes';
import NotFound from './pages/NotFound'; // Direct import, not lazy
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';


// Lazy load other pages for better performance
const About = lazy(() => import('./pages/About'));
//const Signup = lazy(() => import('./pages/Signup'));
//const Login = lazy(() => import('./pages/Login'));
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
          <Routes>
            {/* Auth routes outside of BaseLayout (no navbar) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Root Layout (Includes NavBar and persists across all routes) */}
            <Route element={<BaseLayout />}>
              {/* Main Content Routes (apply page transitions) */}
              <Route element={<MainContentWrapper />}>
                <Route path="/" element={<NewHome />} />
                <Route path="/about" element={
                  <LazyPageWrapper skeletonProps={{ title: true, paragraphs: 4 }}>
                    <About />
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

                {/* 404 Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Dashboard Layout - Protected and outside the main content wrapper */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                {/* Dashboard subroutes are handled by DashboardRoutes */}
                <Route path="*" element={<DashboardRoutes />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LoadingProvider>
  );
};

export default App;

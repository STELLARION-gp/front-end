// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavBarComponent from './layouts/NavBarComponent';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Login from './pages/Login';
import NewHome from './pages/NewHome';
import ExampleI18nPage from './pages/ExampleI18nPage';
import TestDashboard from './pages/TestDashboard';
import AuthDebugTest from './components/AuthDebugTest';
import RedirectTest from './components/RedirectTest';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <NavBarComponent />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<NewHome />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/i18n-example" element={<ExampleI18nPage />} />
              <Route path="/debug-auth" element={<AuthDebugTest />} />
              <Route path="/redirect-test" element={<RedirectTest />} />
              <Route path="/test-dashboard" element={
                <ProtectedRoute>
                  <TestDashboard />
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
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

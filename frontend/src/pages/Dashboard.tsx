import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ No <Router> here since it's handled in App.tsx
import Sidebar from '../components/Sidebar';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
// You can add more page components here
import '../styles/pages/Dashboard.scss';
import Chatbot from '../components/Chatbot';
import Auth from '../components/Auth';
import Preview from './learner/Preview';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <Auth />

      <main className="content">
        {/* ✅ Nested routes for Dashboard */}
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="signup" element={<div>Signup Page</div>} />
          <Route path="login" element={<div>Login Page</div>} />
          <Route path="profile" element={<Profile />} />
          <Route path="overview" element={<Preview />} />
          {/* Add more Route components for other dashboard pages like overview, chat, etc. */}
        </Routes>
      </main>

      <Chatbot />
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';
import { RoleGuard } from '../components/RoleGuard';
import Sidebar from '../components/Sidebar';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Button from '../components/Button';
import '../styles/pages/Dashboard.scss';
import Chatbot from '../components/Chatbot';
import Preview from './learner/Preview';
import NightCamps from './enthuasist/NightCamps';
import MediaUploadPanel from './guide/MediaUploadPanel';

// Create placeholder components for different pages
const BlogsPage = () => (
  <div className="dashboard-page">
    <h2>Blogs & Content</h2>
    <p>Create and manage your astronomy blog posts and articles.</p>
    <RoleGuard allowedRoles={['influencer', 'mentor', 'moderator', 'admin']}>
      <div className="advanced-features">
        <h3>Advanced Features</h3>
        <p>You have access to advanced blogging features.</p>
      </div>
    </RoleGuard>
  </div>
);

const MentorPage = () => (
  <div className="dashboard-page">
    <h2>Mentor Dashboard</h2>
    <p>Manage your mentoring sessions and students.</p>
    <div className="mentor-stats">
      <div className="stat-card">
        <h4>Active Students</h4>
        <span className="stat-value">12</span>
      </div>
      <div className="stat-card">
        <h4>Sessions This Month</h4>
        <span className="stat-value">24</span>
      </div>
    </div>
  </div>
);

const EventsPage = () => (
  <div className="dashboard-page">
    <h2>Events Management</h2>
    <p>Create and manage astronomy events and observations.</p>
  </div>
);

const ChatPage = () => (
  <div className="dashboard-page">
    <h2>Community Chat</h2>
    <p>Connect with fellow astronomy enthusiasts.</p>
  </div>
);

const SessionsPage = () => (
  <div className="dashboard-page">
    <h2>Learning Sessions</h2>
    <p>Manage your learning and teaching sessions.</p>
  </div>
);

const ModerationPage = () => (
  <div className="dashboard-page">
    <h2>Community Moderation</h2>
    <p>Moderate community content and manage user reports.</p>
  </div>
);

const AdminPage = () => (
  <div className="dashboard-page">
    <h2>System Administration</h2>
    <p>Manage system settings and user accounts.</p>
    <div className="admin-tools">
      <Button
        variant="success"
        size="medium"
        className="admin-btn"
      >
        User Management
      </Button>
      <Button
        variant="primary"
        size="medium"
        className="admin-btn"
      >
        System Settings
      </Button>
      <Button
        variant="secondary"
        size="medium"
        className="admin-btn"
      >
        Analytics
      </Button>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="content">
        <div className="dashboard-header">
          <h1>Welcome back, {userProfile.displayName}!</h1>
          <p className="role-badge">Role: {userProfile.role}</p>
        </div>

        <Routes>
          <Route path="overview" element={<Preview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />

          <Route
            path="blogs"
            element={
              <ProtectedRoute allowedRoles={['enthusiast', 'influencer', 'guide', 'mentor', 'moderator', 'admin']}>
                <BlogsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="mentor"
            element={
              <ProtectedRoute allowedRoles={['mentor', 'moderator', 'admin']}>
                <MentorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="events"
            element={
              <ProtectedRoute allowedRoles={['guide', 'mentor', 'moderator', 'admin']}>
                <EventsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="media"
            element={
              <ProtectedRoute allowedRoles={['guide']}>
                <div className="dashboard-page">
                  <MediaUploadPanel 
                    showSidebar={false}
                    maxFileSize={50}
                    allowedTypes={[
                      'image/jpeg', 
                      'image/png', 
                      'image/webp', 
                      'video/mp4', 
                      'video/webm', 
                      'video/quicktime'
                    ]}
                  />
                </div>
              </ProtectedRoute>
            }
          />

          <Route path="chat" element={<ChatPage />} />

          <Route
            path="sessions"
            element={
              <ProtectedRoute allowedRoles={['mentor', 'moderator', 'admin']}>
                <SessionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="moderation"
            element={
              <ProtectedRoute allowedRoles={['moderator', 'admin']}>
                <ModerationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route
          path="night-camps"
          element={
            <ProtectedRoute allowedRoles={['enthusiast','admin']}>
              <NightCamps />
            </ProtectedRoute>
          }
          />

          {/* Default redirect to overview */}
          <Route path="" element={<Navigate to="overview" replace />} />

          {/* Catch all route for unauthorized access */}
          <Route path="*" element={
            <div className="access-denied">
              <h2>Page Not Found</h2>
              <p>The page you're looking for doesn't exist or you don't have access to it.</p>
            </div>
          } />
        </Routes>
      </main>

      <Chatbot />
    </div>
  );
};

export default Dashboard;

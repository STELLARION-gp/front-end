import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDashboardLoading } from '../hooks/useDashboardLoading';
import { RoleGuard } from '../components/RoleGuard';
import Sidebar from '../components/Sidebar';
import ContentLoader from '../components/ContentLoader';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import DashboardOverview from '../pages/DashboardOverview';
import Button from '../components/Button';
import '../styles/pages/Dashboard.scss';
import Chatbot from '../components/Chatbot';
import DashboardFooter from '../components/DashboardFooter';

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
  const { isLoadingContent } = useDashboardLoading();

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <div className="routes-container">
          <ContentLoader isLoading={isLoadingContent}>
            <Routes>
              <Route path="overview" element={<DashboardOverview />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />

              <Route
                path="blogs"
                element={
                  <RoleGuard allowedRoles={['enthusiast', 'influencer', 'guide', 'mentor', 'moderator', 'admin']}>
                    <BlogsPage />
                  </RoleGuard>
                }
              />

              <Route
                path="mentor"
                element={
                  <RoleGuard allowedRoles={['mentor', 'moderator', 'admin']}>
                    <MentorPage />
                  </RoleGuard>
                }
              />

              <Route
                path="events"
                element={
                  <RoleGuard allowedRoles={['guide', 'mentor', 'moderator', 'admin']}>
                    <EventsPage />
                  </RoleGuard>
                }
              />

              <Route path="chat" element={<ChatPage />} />

              <Route
                path="sessions"
                element={
                  <RoleGuard allowedRoles={['mentor', 'moderator', 'admin']}>
                    <SessionsPage />
                  </RoleGuard>
                }
              />

              <Route
                path="moderation"
                element={
                  <RoleGuard allowedRoles={['moderator', 'admin']}>
                    <ModerationPage />
                  </RoleGuard>
                }
              />

              <Route
                path="admin"
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminPage />
                  </RoleGuard>
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
          </ContentLoader>
        </div>

        <DashboardFooter />
      </main>

      <Chatbot />
    </div>
  );
};

export default Dashboard;

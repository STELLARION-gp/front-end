import { memo } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { RoleGuard } from '../components/RoleGuard';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import DashboardOverview from '../pages/DashboardOverview';
import Button from '../components/Button';
import NightCamps from '../pages/enthuasist/NightCamps';
import Stargazing from '../pages/enthuasist/Stargazing';
import MediaUploadPanel from '../pages/guide/MediaUploadPanel';
import ServiceListing from '../pages/guide/ServiceListing';

// Create placeholder components for different pages - all memoized
const BlogsPage = memo(() => (
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
));

const MentorPage = memo(() => (
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
));

const EventsPage = memo(() => (
    <div className="dashboard-page">
        <h2>Events Management</h2>
        <p>Create and manage astronomy events and observations.</p>
    </div>
));

const ChatPage = memo(() => (
    <div className="dashboard-page">
        <h2>Community Chat</h2>
        <p>Connect with fellow astronomy enthusiasts.</p>
    </div>
));

const SessionsPage = memo(() => (
    <div className="dashboard-page">
        <h2>Learning Sessions</h2>
        <p>Manage your learning and teaching sessions.</p>
    </div>
));

const ModerationPage = memo(() => (
    <div className="dashboard-page">
        <h2>Community Moderation</h2>
        <p>Moderate community content and manage user reports.</p>
    </div>
));

const AdminPage = memo(() => (
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
));

const DashboardRoutes = () => {
    console.log('Dashboard Routes rendering');

    return (
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

            <Route
                path="night-camps"
                element={
                    <RoleGuard allowedRoles={['mentor', 'moderator', 'admin']}>
                        <NightCamps />
                    </RoleGuard>
                }
            />

            <Route
                path="stargazing"
                element={
                    <RoleGuard allowedRoles={['mentor', 'moderator', 'admin']}>
                        <Stargazing />
                    </RoleGuard>
                }
            />

            <Route
                path="media"
                element={
                    <RoleGuard allowedRoles={['guide', 'moderator', 'admin']}>
                        <MediaUploadPanel />
                    </RoleGuard>
                }
            />

            <Route
                path="services"
                element={
                    <RoleGuard allowedRoles={['guide', 'moderator', 'admin']}>
                        <ServiceListing />
                    </RoleGuard>
                }
            />

            {/* Default redirect to overview */}
            <Route path="" element={<Navigate to="overview" replace />} />

            {/* Catch all route for unauthorized access */}
            <Route path="*" element={
                <div className="dashboard-not-found">
                    <h2>Dashboard Page Not Found</h2>
                    <p>The dashboard page you're looking for doesn't exist or you don't have access to it.</p>
                    <div className="dashboard-not-found-actions">
                        <Link to="/dashboard/overview" className="dashboard-back-link">
                            Go to Dashboard Overview
                        </Link>
                    </div>
                </div>
            } />
        </Routes>
    );
};

export default memo(DashboardRoutes, () => true);

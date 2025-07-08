import { memo } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { RoleGuard } from '../components/RoleGuard';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import DashboardOverview from '../pages/DashboardOverview';
import PaymentProcessing from '../pages/guide/PaymentProcessing';
import Button from '../components/Button';

import Preview from '../pages/learner/Preview';
import BlogExplore from '../pages/learner/Blog_Explore';
import BlogDetailedPageWrapper from '../pages/learner/BlogDetailedPageWrapper';
import AuthorProfilePageWrapper from '../pages/learner/AuthorProfilePageWrapper';
import NasaImagesPage from '../pages/learner/NasaImagesPage';

import NightCamps from '../pages/enthuasist/NightCamps';
import Stargazing from '../pages/enthuasist/Stargazing';

import ServiceListing from '../pages/guide/ServiceListing';
import CreateService from '../pages/guide/CreateService';
import SetAvailability from '../pages/guide/SetAvailability';
import MediaUploadPanel from '../pages/guide/MediaUploadPanel';

import MentorProfile from '../pages/mentor/MentorProfile';
import EditMentor from '../pages/mentor/EditMentor';

import GuideMediaDashboard from '../pages/guide/GuideMediaDashboard';
// import MentorProfile from '../pages/mentor/MentorProfile';
// import BookingRequests from '../pages/guide/BookingRequests';
import ConfirmedBookings from '../pages/guide/ConfirmedBookings';
import TourChat from '../pages/guide/TourChat';

import BookingRequests from '../pages/guide/BookingRequests';
import AstroHub from '../pages/enthuasist/AstroHub';
import CelestialEventsPage from '../pages/learner/Celestial_Events_Page';
import Volunteering from '../pages/enthuasist/Volunteering';
import AstronomySessionsPage from '../pages/learner/AstronomySessionsPage';
import Sponsorships from '../pages/enthuasist/Sponsorships';
import RecordedSessionPage from '../pages/learner/Recorded_Session_Page';
import NightCampDetails from '../pages/learner/NightCampDetails';
import Influencers from '../pages/enthuasist/Influencers';
import Mentors from '../pages/learner/Mentors';
import ApplyMentor from '../pages/learner/ApplyMentor';
import AstronomyServices from '../pages/learner/AstronomyServices';
import AstronomyServiceDetails from '../pages/learner/AstronomyServiceDetails';
import Quizzes from '../pages/enthuasist/Quizzes';
import GuideDetails from '../pages/learner/GuideDetails';
import CompetitionPage from '../pages/learner/CompetitionPage';

// Create placeholder components for different pages - all memoized
// const BlogsPage = memo(() => (
//     <div className="dashboard-page">
//         <h2>Blogs & Content</h2>
//         <p>Create and manage your astronomy blog posts and articles.</p>
//         <RoleGuard allowedRoles={['influencer', 'mentor', 'moderator', 'admin']}>
//             <div className="advanced-features">
//                 <h3>Advanced Features</h3>
//                 <p>You have access to advanced blogging features.</p>
//             </div>
//         </RoleGuard>
//     </div>
// ));

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
            <Route 
            path="overview" 
            element={
                <RoleGuard allowedRoles={['learner']}>
                    <Preview />
                </RoleGuard>} 
            />
            <Route 
            path="dashboard-overview" 
            element={
                <RoleGuard allowedRoles={['enthusiast', 'influencer', 'guide', 'mentor', 'moderator', 'admin']}>
                    <DashboardOverview />
                </RoleGuard>} 
            />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />

            <Route
                path="blogs"
                element={
                    <RoleGuard allowedRoles={['enthusiast', 'influencer', 'guide', 'mentor', 'moderator', 'admin', 'learner']}>
                        <BlogExplore />
                    </RoleGuard>
                }
            />
            <Route
                path="blogs/:id"
                element={
                    <RoleGuard allowedRoles={['enthusiast', 'influencer', 'guide', 'mentor', 'moderator', 'admin', 'learner']}>
                        <BlogDetailedPageWrapper />
                    </RoleGuard>
                }
            />
            <Route 
                path="sessions"
                element={
                    <RoleGuard allowedRoles={['learner']}>
                        <AstronomySessionsPage />
                    </RoleGuard>
                }
            />
            <Route
                path='sessions/recorded-sessions/:id'
                element={
                    <RoleGuard allowedRoles={['learner']}>
                        <RecordedSessionPage />
                    </RoleGuard>
                }
            />
                <Route
                path="nasa-content"
                element={
                    <RoleGuard allowedRoles={['learner']}>
                        <NasaImagesPage />
                    </RoleGuard>
                }
            />
            <Route
                path='mentors'
                element={
                    <RoleGuard allowedRoles={['learner','enthusiast']}>
                        <Mentors />
                    </RoleGuard>
                }
            />
            <Route
                path="celestial-events"
                element={
                    <RoleGuard allowedRoles={['learner']}>
                        <CelestialEventsPage />
                    </RoleGuard>
                }
            />
            <Route
                path="night-camps/:campId"
                element={
                    <RoleGuard allowedRoles={['learner']}>
                        <NightCampDetails />
                    </RoleGuard>
                }
            />
            <Route
                path='astronomy-services'
                element={
                    <RoleGuard allowedRoles={['learner']}>
                        <AstronomyServices />
                    </RoleGuard>
                }
            />
            <Route
                path='astronomy-services/:id'
                element={
                    <RoleGuard allowedRoles={['learner']}>
                        <AstronomyServiceDetails />
                    </RoleGuard>
                }
            />
            <Route
                path='guide-profile'
                element={
                    <RoleGuard allowedRoles={['learner']}>
                        <GuideDetails />
                    </RoleGuard>
                }
            />
            <Route
                path="competition"
                element={
                    <RoleGuard allowedRoles={['learner']}>
                        <CompetitionPage />
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


            <Route
                path="booking-requests"
                element={
                    <RoleGuard allowedRoles={['influencer', 'guide', 'moderator', 'admin']}>
                        <BookingRequests />
                    </RoleGuard>
                }
            />

            <Route
                path="confirmed-bookings"
                element={<ConfirmedBookings />}
            />

            <Route
                path="tour-chat"
                element={
                    <RoleGuard allowedRoles={['guide', 'admin']}>
                        <TourChat />
                    </RoleGuard>
                }
            />

            <Route
                path="services/*"
                element={
                    <RoleGuard allowedRoles={['guide', 'admin']}>
                        <Routes>
                            <Route index element={<ServiceListing />} />
                            <Route path="create" element={<CreateService />} />
                            <Route path="availability" element={<SetAvailability />} />
                            <Route path=":serviceId/availability" element={<SetAvailability />} />
                        </Routes>
                    </RoleGuard>
                }
            />

            <Route
                path="media"
                element={
                    <RoleGuard allowedRoles={['guide', 'admin']}>
                        <GuideMediaDashboard />
                    </RoleGuard>
                }
            />

            <Route
                path="media/upload"
                element={
                    <RoleGuard allowedRoles={['guide', 'admin']}>
                        <MediaUploadPanel />
                    </RoleGuard>
                }
            />


            <Route path="chat" element={<ChatPage />} />

            
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
                path="author/:authorName"
                element={
                    <RoleGuard allowedRoles={['enthusiast', 'influencer', 'guide', 'mentor', 'moderator', 'admin', 'learner']}>
                        <AuthorProfilePageWrapper />
                    </RoleGuard>
                }
            />

            <Route
                path="mentorprofile"
                element={
                    <RoleGuard allowedRoles={['mentor', 'moderator', 'admin']}>
                        <MentorProfile />
                        </RoleGuard>
                }
            />

            <Route
                path="editmentor"
                element={
                    <RoleGuard allowedRoles={['mentor', 'moderator', 'admin']}>
                        <EditMentor />
                    </RoleGuard>
                }
            />

            <Route
                path="night-camps"
                element={
                    <RoleGuard allowedRoles={['enthusiast','learner','guide']}>
                        <NightCamps />
                    </RoleGuard>
                }
            />

                <Route
                path="stargazing"
                element={
                    <RoleGuard allowedRoles={['enthusiast', 'influencer','learner']}>
                        <Stargazing />
                    </RoleGuard>
                }
            />

            
                <Route
                path="astrohub"
                element={
                    <RoleGuard allowedRoles={['enthusiast', 'influencer','learner','guide']}>
                        <AstroHub />
                    </RoleGuard>
                }
            />

            <Route
                path="volunteering"
                element={
                    <RoleGuard allowedRoles={['enthusiast']}>
                        <Volunteering />
                    </RoleGuard>
                }
            />

            <Route
                path="sponsorships"
                element={
                    <RoleGuard allowedRoles={['enthusiast']}>
                        <Sponsorships />
                    </RoleGuard>
                }
            />  
    
            <Route
                path="influencers"
                element={
                    <RoleGuard allowedRoles={['enthusiast','learner']}>
                        <Influencers />
                    </RoleGuard>
                }
            />
                


            <Route
                path="apply-mentor/:mentorId"
                element={
                    <RoleGuard allowedRoles={['learner','enthusiast']}>
                        <ApplyMentor />
                    </RoleGuard>
                }
            />

            <Route
                path="quizzes"
                element={
                    <RoleGuard allowedRoles={['enthusiast']}>
                        <Quizzes />
                    </RoleGuard>
                }
            />

            <Route
                path="payments"
                element={
                    <RoleGuard allowedRoles={['guide', 'admin', 'moderator']}>
                        <PaymentProcessing />
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

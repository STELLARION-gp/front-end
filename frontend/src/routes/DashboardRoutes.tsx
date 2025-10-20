import GuideApplication from "../pages/learner/GuideApplication";

import { memo } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { RoleGuard } from "../components/RoleGuard";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import DashboardOverview from "../pages/DashboardOverview";

// Moderation Components
import Moderation from "../pages/moderator/Moderation";
import ContentModeration from "../pages/moderator/ContentModeration";
import ContentDetailPage from "../pages/moderator/ContentDetailPage";
import ProfileModeration from "../pages/moderator/ProfileModeration";
import ProfileDetails from "../pages/moderator/ProfileDetails";
import SessionModeration from "../pages/moderator/SessionModeration";
import SessionDetails from "../pages/moderator/SessionDetails";
import PollsModeration from "../pages/moderator/PollsModeration";
import PollsDetails from "../pages/moderator/PollsDetails";
import SpotsModeration from "../pages/moderator/SpotsModeration";
import SpotsDetails from "../pages/moderator/SpotsDetails";
import CreateNightCamp from "../pages/moderator/CreateNightCamp";
import NightCampsModeration from "../pages/moderator/NightCamps";
import EventModeration from "../pages/moderator/EventModeration";
import PaymentProcessing from "../pages/guide/PaymentProcessing";
import Button from "../components/Button";

import Preview from "../pages/learner/Preview";
import BlogExplore from "../pages/learner/Blog_Explore";
import BlogDetailedPageWrapper from "../pages/learner/BlogDetailedPageWrapper";
import AuthorProfilePageWrapper from "../pages/learner/AuthorProfilePageWrapper";
import NasaImagesPage from "../pages/learner/NasaImagesPage";

import NightCamps from "../pages/enthuasist/NightCamps";
import VolunteerManagement from "../pages/enthuasist/VolunteerManagement";
import Stargazing from "../pages/enthuasist/Stargazing";
import SpotDetails from "../pages/enthuasist/SpotDetails";

import ServiceListing from "../pages/guide/ServiceListing";
import CreateService from "../pages/guide/CreateService";
import SetAvailability from "../pages/guide/SetAvailability";
import MediaUploadPanel from "../pages/guide/MediaUploadPanel";

import MentorProfile from "../pages/mentor/MentorProfile";
import EditMentor from "../pages/mentor/EditMentor";
import MentorDashboard from "../pages/mentor/MentorDashboard";

// import MentorProfile from '../pages/mentor/MentorProfile';
// import BookingRequests from '../pages/guide/BookingRequests';

import GuideMediaDashboard from "../pages/guide/GuideMediaDashboard";
// import MentorProfile from '../pages/mentor/MentorProfile';
// import BookingRequests from '../pages/guide/BookingRequests';
import ConfirmedBookings from "../pages/guide/ConfirmedBookings";
import PreviousTours from "../pages/guide/PreviousTours";
import TourChat from "../pages/guide/TourChat";

import BookingRequests from "../pages/guide/BookingRequests";
import CampGuideApplication from "../pages/guide/CampGuideApplication";
import AstroHub from "../pages/enthuasist/AstroHub";
import CelestialEventsPage from "../pages/learner/Celestial_Events_Page";
import Volunteering from "../pages/enthuasist/Volunteering";
import AstronomySessionsPage from "../pages/learner/AstronomySessionsPage";
import Sponsorships from "../pages/enthuasist/Sponsorships";
import RecordedSessionPage from "../pages/learner/Recorded_Session_Page";
import NightCampDetails from "../pages/learner/NightCampDetails";
import Influencers from "../pages/enthuasist/Influencers";
import Mentors from "../pages/learner/Mentors";
import ApplyMentor from "../pages/learner/ApplyMentor";
import AstronomyServices from "../pages/learner/AstronomyServices";
import AstronomyServiceDetails from "../pages/learner/AstronomyServiceDetails";
import MyBookings from "../pages/learner/MyBookings";
import CompetitionPage from "../pages/learner/CompetitionPage";
//import Competitions from '../pages/influencer/competitions';
//import MyBlogs from '../pages/influencer/myblogs';
import Vlogs from "../pages/influencer/Vlogs";
import Quizzes from "../pages/enthuasist/Quizzes";
import Polls from "../pages/influencer/Polls";
import Sessions from "../pages/influencer/Sessions";
// import Performance from "../pages/influencer/Performance";
import MentorshipRequest from "../pages/mentor/MentorshipRequest";
import Mentees from "../pages/mentor/Mentees";
import MenteeProfile from "../pages/mentor/MenteeProfile";
import MenteeRequest from "../pages/mentor/MenteeRequest";
import MentorNotification from "../pages/mentor/MentorNotification";
import MyUniverse from "../pages/learner/MyUniverse";
//import { MentorPauseProvider } from '../contexts/MentorPauseContext';
import { MentorPauseProvider } from "../contexts/mentor/MentorPauseContext";
//import { MenteeProvider } from '../contexts/MenteeContext';
import OngoingCompetitionPage from "../pages/learner/OngoingcompetitionPage";
import { MenteeProvider } from "../contexts/mentor/MenteeContext";
import Competitions from "../pages/influencer/competitions";
import MyBlogs from "../pages/influencer/myblogs";
import LearnPath from "../pages/mentor/LearnPath";
import MentorMenteeConnectionPage from "../pages/learner/MentorMenteeConnectionPage";
import Performance from "../pages/influencer/Performance";

import Followers from "../pages/influencer/Followers";
import AdminModeratorsPage from "../pages/admin/AdminModeratorsPage";
import AdminOverview from "../pages/admin/AdminOverview";
import RevenueAnalytics from "../pages/admin/RevenueAnalytics";
import ProviderPayments from "../pages/admin/ProviderPayments";
import InfluencerApplication from "../pages/learner/InfluencerApplication";
import Mentor from "../pages/admin/Mentor";
import MentorApplication from "../pages/admin/MentorApplication";
import MentorProfiles from "../pages/admin/MentorProfiles";
import MentorProfileDetail from "../pages/admin/MentorProfileDetail";
import SubscriptionDashboard from "../pages/SubscriptionDashboard";
import NightCampDetailsModerator from "../pages/moderator/NightCampDetails";
import EditNightCamp from "../pages/moderator/EditNightCamp";
import CreateEvent from "../pages/moderator/CreateEvent";
import EventDetails from "../pages/moderator/EventDetails";
import MentorActiveLog from "../pages/mentor/MentorActiveLog";
import RecommendEventsPage from "../pages/mentor/RecommendEventsPage";
import RecommendedEvents from "../pages/mentor/RecommendedEvents";
import RecommendedContents from "../pages/mentor/RecommendedContents";
import PrivateChat from "../pages/mentor/PrivateChat";
import GroupChatPage from "../pages/mentor/GroupChatPage";
import { RecommendedEventsProvider } from "../contexts/mentor/RecommendedEventsContext";
import SelfContent from "../pages/mentor/SelfContent";
import MenteeApplications from "../pages/mentor/MenteeApplications";
import GuideProfile from "../pages/guide/GuideProfile";

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

// const MentorPage = memo(() => (
//     <div className="dashboard-page">
//         <h2>Mentor Dashboard</h2>
//         <p>Manage your mentoring sessions and students.</p>
//         <div className="mentor-stats">
//             <div className="stat-card">
//                 <h4>Active Students</h4>
//                 <span className="stat-value">12</span>
//             </div>
//             <div className="stat-card">
//                 <h4>Sessions This Month</h4>
//                 <span className="stat-value">24</span>
//             </div>
//         </div>
//     </div>
// ));

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

// const ModerationPage = memo(() => (
//     <div className="dashboard-page">
//         <h2>Community Moderation</h2>
//         <p>Moderate community content and manage user reports.</p>
//     </div>
// ));

const AdminPage = memo(() => (
  <div className="dashboard-page">
    <h2>System Administration</h2>
    <p>Manage system settings and user accounts.</p>
    <div className="admin-tools">
      <Button variant="success" size="medium" className="admin-btn">
        User Management
      </Button>
      <Button variant="primary" size="medium" className="admin-btn">
        System Settings
      </Button>
      <Button variant="secondary" size="medium" className="admin-btn">
        Analytics
      </Button>
    </div>
  </div>
));

const DashboardRoutes = () => {
  console.log("Dashboard Routes rendering");

  return (
    <Routes>
      <Route
        path="guide-application"
        element={
          <RoleGuard allowedRoles={["learner"]}>
            <GuideApplication />
          </RoleGuard>
        }
      />
      <Route
        path="influencer-application"
        element={
          <RoleGuard allowedRoles={["learner"]}>
            <InfluencerApplication />
          </RoleGuard>
        }
      />
      <Route
        path="overview"
        element={
          <RoleGuard
            allowedRoles={[
              "learner",
              "admin",
              "enthusiast",
              "guide",
              "influencer",
              "mentor",
              "moderator",
            ]}
          >
            <Preview />
          </RoleGuard>
        }
      />
      <Route
        path="dashboard-overview"
        element={
          <RoleGuard
            allowedRoles={[
              "enthusiast",
              "influencer",
              "guide",
              "mentor",
              "moderator",
              "admin",
            ]}
          >
            <DashboardOverview />
          </RoleGuard>
        }
      />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route
        path="subscription"
        element={
          <RoleGuard
            allowedRoles={[
              "learner",
              "enthusiast",
              "influencer",
              "guide",
              "mentor",
              "moderator",
              "admin",
            ]}
          >
            <SubscriptionDashboard />
          </RoleGuard>
        }
      />

      <Route
        path="blogs"
        element={
          <RoleGuard
            allowedRoles={[
              "enthusiast",
              "influencer",
              "guide",
              "mentor",
              "moderator",
              "admin",
              "learner",
            ]}
          >
            <BlogExplore />
          </RoleGuard>
        }
      />
      <Route
        path="blogs/:id"
        element={
          <RoleGuard
            allowedRoles={[
              "enthusiast",
              "influencer",
              "guide",
              "mentor",
              "moderator",
              "admin",
              "learner",
            ]}
          >
            <BlogDetailedPageWrapper />
          </RoleGuard>
        }
      />
      <Route
        path="sessions"
        element={
          <RoleGuard allowedRoles={["learner"]}>
            <AstronomySessionsPage />
          </RoleGuard>
        }
      />
      <Route
        path="sessions/recorded-sessions/:id"
        element={
          <RoleGuard allowedRoles={["learner"]}>
            <RecordedSessionPage />
          </RoleGuard>
        }
      />
      <Route
        path="nasa-content"
        element={
          <RoleGuard allowedRoles={["learner"]}>
            <NasaImagesPage />
          </RoleGuard>
        }
      />
      <Route
        path="mentors"
        element={
          <RoleGuard allowedRoles={["learner", "enthusiast"]}>
            <Mentors />
          </RoleGuard>
        }
      />
      <Route
        path="celestial-events"
        element={
          <RoleGuard allowedRoles={["learner"]}>
            <CelestialEventsPage />
          </RoleGuard>
        }
      />
      <Route
        path="night-camps/:campId"
        element={
          <RoleGuard allowedRoles={["learner"]}>
            <NightCampDetails />
          </RoleGuard>
        }
      />
      <Route
        path="astronomy-services"
        element={
          <RoleGuard allowedRoles={["learner", "enthusiast"]}>
            <AstronomyServices />
          </RoleGuard>
        }
      />
      <Route
        path="astronomy-services/:id"
        element={
          <RoleGuard allowedRoles={["learner", "enthusiast"]}>
            <AstronomyServiceDetails />
          </RoleGuard>
        }
      />
      <Route
        path="my-bookings"
        element={
          <RoleGuard allowedRoles={["learner", "enthusiast"]}>
            <MyBookings />
          </RoleGuard>
        }
      />
      {/* <Route
        path="guide-profile"
        element={
          <RoleGuard allowedRoles={["learner", "enthusiast"]}>
            <GuideDetails />
          </RoleGuard>
        }
      /> */}
      <Route
        path="competition"
        element={
          <RoleGuard allowedRoles={["learner"]}>
            <CompetitionPage />
          </RoleGuard>
        }
      />
      <Route
        path="my-universe"
        element={
          <RoleGuard allowedRoles={["learner"]}>
            <MyUniverse />
          </RoleGuard>
        }
      />
      <Route
        path="mentor-connection/:id"
        element={
          <RoleGuard allowedRoles={["learner", "influencer"]}>
            <MentorMenteeConnectionPage />
          </RoleGuard>
        }
      />
      <Route
        path="ongoingcompetition"
        element={
          <RoleGuard allowedRoles={["learner"]}>
            <OngoingCompetitionPage />
          </RoleGuard>
        }
      />
      <Route
        path="mentor"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator"]}>
            <Mentor />
          </RoleGuard>
        }
      />
      <Route
        path="system-mentors"
        element={
          <RoleGuard allowedRoles={["admin"]}>
            <MentorProfiles />
          </RoleGuard>
        }
      />
      <Route
        path="mentor-application"
        element={
          <RoleGuard allowedRoles={["admin", "moderator"]}>
            <MentorApplication />
          </RoleGuard>
        }
      />

      <Route
        path="events"
        element={
          <RoleGuard allowedRoles={["guide", "mentor", "moderator", "admin"]}>
            <EventsPage />
          </RoleGuard>
        }
      />

      <Route
        path="camp-guide-application"
        element={
          <RoleGuard allowedRoles={["guide"]}>
            <CampGuideApplication />
          </RoleGuard>
        }
      />

      <Route
        path="booking-requests"
        element={
          <RoleGuard
            allowedRoles={["influencer", "guide", "moderator", "admin"]}
          >
            <BookingRequests />
          </RoleGuard>
        }
      />

      <Route path="confirmed-bookings" element={<ConfirmedBookings />} />

      <Route path="previous-tours" element={<PreviousTours />} />

      <Route
        path="tour-chat"
        element={
          <RoleGuard allowedRoles={["guide", "admin"]}>
            <TourChat />
          </RoleGuard>
        }
      />

      <Route
        path="services/*"
        element={
          <RoleGuard allowedRoles={["guide", "admin"]}>
            <Routes>
              <Route index element={<ServiceListing />} />
              <Route path="create" element={<CreateService />} />
              <Route path="availability" element={<SetAvailability />} />
              <Route
                path=":serviceId/availability"
                element={<SetAvailability />}
              />
            </Routes>
          </RoleGuard>
        }
      />

      <Route
        path="media"
        element={
          <RoleGuard allowedRoles={["guide", "admin"]}>
            <GuideMediaDashboard />
          </RoleGuard>
        }
      />

      <Route
        path="media/upload"
        element={
          <RoleGuard allowedRoles={["guide", "admin"]}>
            <MediaUploadPanel />
          </RoleGuard>
        }
      />

      <Route path="chat" element={<ChatPage />} />

      {/* Moderation Routes */}
      <Route
        path="moderation"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <Moderation />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/content"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <ContentModeration />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/content/details/:id"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <ContentDetailPage />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/profile"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <ProfileModeration />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/profile/details/:id"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <ProfileDetails />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/session"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <SessionModeration />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/session/details/:id"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <SessionDetails />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/polls"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <PollsModeration />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/polls/details/:id"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <PollsDetails />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/spots"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <SpotsModeration />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/spots/details/:id"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <SpotsDetails />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/night-camps/details/:id"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <NightCampDetailsModerator />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/night-camps/edit/:id"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <EditNightCamp />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/night-camps/create"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <CreateNightCamp />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/create-night-camp"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <CreateNightCamp />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/night-camps"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <NightCampsModeration />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/events/details/:id"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <EventDetails />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/events/create"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <CreateEvent />
          </RoleGuard>
        }
      />
      <Route
        path="moderation/events"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <EventModeration />
          </RoleGuard>
        }
      />

      <Route
        path="admin"
        element={
          <RoleGuard allowedRoles={["admin"]}>
            <AdminPage />
          </RoleGuard>
        }
      />

      <Route
        path="admin-overview"
        element={
          <RoleGuard allowedRoles={["admin"]}>
            <AdminOverview />
          </RoleGuard>
        }
      />

      <Route
        path="revenue-analytics"
        element={
          <RoleGuard allowedRoles={["admin"]}>
            <RevenueAnalytics />
          </RoleGuard>
        }
      />

      <Route
        path="provider-payments"
        element={
          <RoleGuard allowedRoles={["admin"]}>
            <ProviderPayments />
          </RoleGuard>
        }
      />

      <Route
        path="author/:authorName"
        element={
          <RoleGuard
            allowedRoles={[
              "enthusiast",
              "influencer",
              "guide",
              "mentor",
              "moderator",
              "admin",
              "learner",
            ]}
          >
            <AuthorProfilePageWrapper />
          </RoleGuard>
        }
      />

      <Route
        path="mentorprofile"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <MentorProfile />
          </RoleGuard>
        }
      />

      <Route
        path="editmentor"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <EditMentor />
          </RoleGuard>
        }
      />
      <Route
        path="mentordashboard"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <MentorPauseProvider>
              <MentorDashboard />
            </MentorPauseProvider>
          </RoleGuard>
        }
      />

      <Route
        path="mentorshiprequest"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <MentorshipRequest />
          </RoleGuard>
        }
      />
      <Route
        path="mentees"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <Mentees />
          </RoleGuard>
        }
      />

      <Route
        path="mentee-profile/:id"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <MenteeProfile />
          </RoleGuard>
        }
      />
      <Route
        path="menteerequest"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <MenteeRequest />
          </RoleGuard>
        }
      />
      <Route
        path="mentor-selfcontent"
        element={
          <RoleGuard allowedRoles={["mentor"]}>
            <SelfContent />
          </RoleGuard>
        }
      />
      <Route
        path="mentee-requests"
        element={
          <RoleGuard allowedRoles={["mentor"]}>
            <MenteeApplications />
          </RoleGuard>
        }
      />
      <Route
        path="learnpath"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <LearnPath />
          </RoleGuard>
        }
      />
      {/* <Route
                {/* <Route
                    path="mentornotification"
                    element={
                        <RoleGuard allowedRoles={['mentor', 'moderator', 'admin']}>
                            <MentorPauseProvider>
                                <MentorNotification />
                            </MentorPauseProvider>
                        </RoleGuard>
                    }
                /> */}
      <Route
        path="recommended-contents"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <RecommendedContents />
          </RoleGuard>
        }
      />
      <Route
        path="recommended-events"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <RecommendedEventsProvider>
              <RecommendedEvents />
            </RecommendedEventsProvider>
          </RoleGuard>
        }
      />
      <Route
        path="recommend-events"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <RecommendedEventsProvider>
              <RecommendEventsPage />
            </RecommendedEventsProvider>
          </RoleGuard>
        }
      />

      <Route
        path="mentoractivelog"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <MentorActiveLog />
          </RoleGuard>
        }
      />

      <Route
        path="privatechat"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <PrivateChat />
          </RoleGuard>
        }
      />

      <Route
        path="groupchat"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <GroupChatPage />
          </RoleGuard>
        }
      />

      <Route
        path="night-camps"
        element={
          <RoleGuard
            allowedRoles={["enthusiast", "learner", "guide", "influencer"]}
          >
            <NightCamps />
          </RoleGuard>
        }
      />

      <Route
        path="volunteer-management/:nightCampId"
        element={
          <RoleGuard
            allowedRoles={["enthusiast", "influencer", "guide", "mentor"]}
          >
            <VolunteerManagement />
          </RoleGuard>
        }
      />

      <Route
        path="stargazing"
        element={
          <RoleGuard
            allowedRoles={[
              "enthusiast",
              "influencer",
              "learner",
              "mentor",
              "guide",
            ]}
          >
            <Stargazing />
          </RoleGuard>
        }
      />

      <Route
        path="enthusiast/stargazing/:id"
        element={
          <RoleGuard allowedRoles={["enthusiast", "influencer", "learner"]}>
            <SpotDetails />
          </RoleGuard>
        }
      />

      <Route
        path="astrohub"
        element={
          <RoleGuard
            allowedRoles={[
              "enthusiast",
              "influencer",
              "learner",
              "guide",
              "moderator",
              "mentor",
            ]}
          >
            <AstroHub />
          </RoleGuard>
        }
      />

      <Route
        path="volunteering"
        element={
          <RoleGuard allowedRoles={["enthusiast"]}>
            <Volunteering />
          </RoleGuard>
        }
      />

      <Route
        path="sponsorships"
        element={
          <RoleGuard allowedRoles={["enthusiast"]}>
            <Sponsorships />
          </RoleGuard>
        }
      />

      <Route
        path="influencers"
        element={
          <RoleGuard allowedRoles={["enthusiast", "learner"]}>
            <Influencers />
          </RoleGuard>
        }
      />

      <Route
        path="apply-mentor/:mentorId"
        element={
          <RoleGuard allowedRoles={["learner", "enthusiast"]}>
            <ApplyMentor />
          </RoleGuard>
        }
      />

      <Route
        path="quizzes"
        element={
          <RoleGuard allowedRoles={["enthusiast"]}>
            <Quizzes />
          </RoleGuard>
        }
      />

      <Route
        path="payments"
        element={
          <RoleGuard allowedRoles={["guide", "admin", "moderator"]}>
            <PaymentProcessing />
          </RoleGuard>
        }
      />

      <Route
        path="sessions-making"
        element={
          <RoleGuard allowedRoles={["influencer"]}>
            <Sessions />
          </RoleGuard>
        }
      />

      <Route
        path="performance"
        element={
          <RoleGuard allowedRoles={["influencer"]}>
            <Performance />
          </RoleGuard>
        }
      />

      <Route
        path="vlogs"
        element={
          <RoleGuard allowedRoles={["influencer"]}>
            <Vlogs />
          </RoleGuard>
        }
      />

      <Route
        path="polls"
        element={
          <RoleGuard allowedRoles={["influencer"]}>
            <Polls />
          </RoleGuard>
        }
      />

      <Route
        path="competitions"
        element={
          <RoleGuard allowedRoles={["influencer"]}>
            <Competitions />
          </RoleGuard>
        }
      />

      <Route
        path="myblogs"
        element={
          <RoleGuard allowedRoles={["influencer"]}>
            <MyBlogs />
          </RoleGuard>
        }
      />

      <Route
        path="followers"
        element={
          <RoleGuard allowedRoles={["influencer"]}>
            <Followers />
          </RoleGuard>
        }
      />
      {/* admin routes */}
      <Route
        path="moderators"
        element={
          <RoleGuard allowedRoles={["admin"]}>
            <AdminModeratorsPage />
          </RoleGuard>
        }
      />
      <Route
        path="mentor-profile/:id"
        element={
          <RoleGuard allowedRoles={["moderator", "admin"]}>
            <MentorProfileDetail />
          </RoleGuard>
        }
      />

      <Route
        path="financial-analytics"
        element={
          <RoleGuard allowedRoles={["admin"]}>
            <RevenueAnalytics />
          </RoleGuard>
        }
      />
      <Route
        path="guide-profile"
        element={
          <RoleGuard allowedRoles={["guide", "admin", "moderator","learner","enthusiast"]}>
            <GuideProfile />
          </RoleGuard>
        }
      />
      <Route
        path="guide-profile/:guideId"
        element={
          <RoleGuard allowedRoles={["guide", "admin", "moderator","learner","enthusiast"]}>
            <GuideProfile />
          </RoleGuard>
        }
      />

      {/* Default redirect to overview */}
      <Route path="" element={<Navigate to="overview" replace />} />

      {/* Catch all route for unauthorized access */}
      <Route
        path="*"
        element={
          <div className="dashboard-not-found">
            <h2>Dashboard Page Not Found</h2>
            <p>
              The dashboard page you're looking for doesn't exist or you don't
              have access to it.
            </p>
            <div className="dashboard-not-found-actions">
              <Link to="/dashboard/overview" className="dashboard-back-link">
                Go to Dashboard Overview
              </Link>
            </div>
          </div>
        }
      />

      <Route
        path="mentornotification"
        element={
          <RoleGuard allowedRoles={["mentor", "moderator", "admin"]}>
            <MentorPauseProvider>
              <MenteeProvider>
                <MentorNotification />
              </MenteeProvider>
            </MentorPauseProvider>
          </RoleGuard>
        }
      />
    </Routes>
  );
};

export default memo(DashboardRoutes, () => true);

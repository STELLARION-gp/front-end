import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/mentor/mentorDashboardSimplified.scss";
import { Button } from "@headlessui/react";
import {
  getMentorProfile,
  getMentorMentees,
  getMentorStats,
} from "../../services/mentorApi";
import type {
  MentorProfile,
  MentorMentee,
  MentorStats,
} from "../../services/mentorApi";
import { auth } from "../../firebase";
import AvailabilityToggle from "../../components/mentor/AvailabilityToggle";
import MenteeCounter from "../../components/mentor/MenteeCounter";

// Mock data — replace with real context/API
const MOCK_MENTOR: MentorProfile = {
  id: 0,
  name: "Dr. Stella Orion",
  avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  email: "stella.orion@astrohub.com",
  specialties: ["Exoplanets", "Data Analysis", "Astrophotography"],
  bio: "Passionate astronomer with 10+ years of experience mentoring young scientists. I help early-career astronomers build research skills and portfolios.",
  qualifications: [
    "PhD in Astronomy",
    "Published 25+ research papers",
    "10 years teaching experience",
  ],
  isAvailable: true,
  menteeCount: 12,
  maxMentees: 15,
};

// Legacy mocks removed; dashboard now uses live data with safe fallbacks

const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(
    null
  );
  const [mentees, setMentees] = useState<MentorMentee[]>([]);
  const [stats, setStats] = useState<MentorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for mentor controls
  const [isAccepting, setIsAccepting] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [maxMentees, setMaxMentees] = useState(15);

  // Handlers for mentee count
  const handleIncreaseMaxMentees = () => {
    setMaxMentees((prev) => Math.min(prev + 1, 50)); // Max 50 mentees
  };

  const handleDecreaseMaxMentees = () => {
    setMaxMentees((prev) => Math.max(prev - 1, 1)); // Min 1 mentee
  };

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          setError("Please log in to view your dashboard");
          return;
        }

        const token = await user.getIdToken();
        console.log("🔑 Fetching mentor profile with token...");

        const [profile, menteesData, statsData] = await Promise.all([
          getMentorProfile(token),
          getMentorMentees(token).catch(() => []),
          getMentorStats(token).catch(() => null),
        ]);
        console.log("✅ Received mentor profile:", profile);
        console.log("👥 Mentees:", menteesData);
        console.log("� Stats:", statsData);
        console.log("�📊 Profile details:", {
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          specialties: profile.specialties,
          qualifications: profile.qualifications,
          isAvailable: profile.isAvailable,
          maxMentees: profile.maxMentees,
          menteeCount: profile.menteeCount,
        });

        setMentorProfile(profile);
        setMentees(menteesData || []);
        setStats(statsData);
        setError(null);
      } catch (err: unknown) {
        console.error("❌ Error fetching mentor profile:", err);
        console.error(
          "Error details:",
          (err as { response?: { data?: unknown } }).response?.data
        );

        // For new mentors or errors, use basic user info
        const currentUser = auth.currentUser;
        if (currentUser) {
          setMentorProfile({
            id: 0,
            name: currentUser.displayName || "New Mentor",
            email: currentUser.email || "",
            avatarUrl: currentUser.photoURL || MOCK_MENTOR.avatarUrl,
            bio: "Welcome! Please complete your mentor profile to get started.",
            specialties: [],
            qualifications: [],
            isAvailable: true,
            menteeCount: 0,
            maxMentees: 15,
          });
        } else {
          const errorMessage =
            (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error || "Failed to load mentor profile";
          setError(errorMessage);
          // Fall back to mock data
          setMentorProfile(MOCK_MENTOR);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMentorProfile();
  }, []);

  // Use fetched data or fallback to mock
  const mentor = mentorProfile || MOCK_MENTOR;

  if (loading) {
    return (
      <div className="mentor-dashboard-main">
        <div className="loading-container">
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mentor-dashboard-main">
      {/* Header Section */}
      <div className="dashboard-header-section">
        <div className="greeting-section">
          <h1 className="dashboard-title">
            Welcome back,{" "}
            {mentor.name.split(" ")[mentor.name.split(" ").length - 1]} 👋
          </h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your mentorship program today.
          </p>
        </div>
        <div className="header-actions">
          <Button onClick={() => navigate("/dashboard/mentor-selfcontent")}>
            Add and Change Profile
          </Button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Main Content Row */}
      <div className="main-content-row">
        {/* Left Column - Controls */}
        <div className="controls-column">
          <div className="controls-section_1">
            <h3 className="section-title">Mentorship Controls</h3>
            <AvailabilityToggle
              isAccepting={isAccepting}
              onToggle={setIsAccepting}
              isPaused={isPaused}
              onPauseToggle={setIsPaused}
            />
            <MenteeCounter
              maxMentees={maxMentees}
              onIncrease={handleIncreaseMaxMentees}
              onDecrease={handleDecreaseMaxMentees}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Sessions Held</h3>
              <div className="stat-value">{stats?.sessionsHeld ?? 0}</div>
              <div className="stat-change positive">This month</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>Average Rating</h3>
              <div className="stat-value">
                {Number(stats?.avgRating ?? 0).toFixed(1)}/5.0
              </div>
              <div className="stat-change neutral">Excellent</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <h3>Hours Mentored</h3>
              <div className="stat-value">{stats?.hoursMentored ?? 0}h</div>
              <div className="stat-change positive">+12h this week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor Profile Details */}
      <div className="mentor-profile-details">
        <div className="profile-header">
          <img
            src={mentor.avatarUrl || MOCK_MENTOR.avatarUrl}
            alt={mentor.name}
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2 className="profile-name">{mentor.name}</h2>
            <p className="profile-email">{mentor.email}</p>
            <div className="availability-badge">
              <span
                className={`status-dot ${
                  mentor.isAvailable ? "available" : "unavailable"
                }`}
              ></span>
              {mentor.isAvailable ? "Available for mentoring" : "Not available"}
            </div>
          </div>
        </div>

        <div className="profile-content">
          {/* About Section - Full Width */}
          <div className="profile-section about-section">
            <div className="section-icon">📝</div>
            <div className="section-content">
              <h3>About Me</h3>
              <p>{mentor.bio || "No bio available"}</p>
            </div>
          </div>

          {/* Specialties and Qualifications - Side by Side */}
          <div className="profile-grid">
            <div className="profile-section specialties-section">
              <div className="section-icon">🌟</div>
              <div className="section-content">
                <h3>Specialties</h3>
                <div className="specialties-chips">
                  {mentor.specialties && mentor.specialties.length > 0 ? (
                    mentor.specialties.map((specialty, index) => (
                      <span key={index} className="specialty-chip">
                        <span className="chip-icon">✨</span>
                        {specialty}
                      </span>
                    ))
                  ) : (
                    <p className="empty-message">No specialties added yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-section qualifications-section">
              <div className="section-icon">🎓</div>
              <div className="section-content">
                <h3>Qualifications</h3>
                <ul className="qualifications-list">
                  {mentor.qualifications && mentor.qualifications.length > 0 ? (
                    mentor.qualifications.map((qualification, index) => (
                      <li key={index}>
                        <span className="check-icon">✓</span>
                        {qualification}
                      </li>
                    ))
                  ) : (
                    <li className="empty-message">
                      No qualifications added yet
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content-grid">
        {/* Center Column - Mentees Only */}
        <div className="center-column">
          {/* Mentees Section */}
          <div className="mentees-section">
            <div className="section-header">
              <h2>
                Your Mentees ({mentees.length || mentor.menteeCount || 0})
              </h2>
              <button
                className="btn-link"
                onClick={() => navigate("/dashboard/mentees")}
              >
                View All →
              </button>
            </div>

            <div className="mentees-grid">
              {(mentees.length > 0 ? mentees : []).map((mentee) => (
                <div
                  key={mentee.id}
                  className="mentee-card"
                  onClick={() => navigate(`/dashboard/mentees`)}
                >
                  <img
                    src={mentee.avatarUrl || "https://i.pravatar.cc/100"}
                    alt={mentee.name}
                    className="mentee-avatar"
                  />
                  <div className="mentee-info">
                    <h4>{mentee.name}</h4>
                    <div className="mentee-status-badge">
                      <span
                        className={`status-dot ${
                          mentee.status === "active" ? "active" : "inactive"
                        }`}
                      ></span>
                      <span className="status-text">
                        {mentee.status || "Active"}
                      </span>
                    </div>
                    <p className="mentee-email">{mentee.email}</p>
                  </div>
                </div>
              ))}
              {mentees.length === 0 && (
                <div
                  className="empty-message"
                  style={{ padding: "1rem", opacity: 0.8 }}
                >
                  No active mentees yet. Once you accept applications, your
                  mentees will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;

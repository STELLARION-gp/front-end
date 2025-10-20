// pages/learner/MyUniverse.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/pages/learner/MyUniverse.scss";
import {
  Star,
  BookOpen,
  CalendarDays,
  User,
  ShoppingCart,
} from "lucide-react";
import QuizCard from "../../components/Learner/QuizCard";
import Button from "../../components/Button";
import QuizModal from "../../components/Learner/QuizModal";
import AstronomyBlogCard from "../../components/Learner/blogcard";
import { blogService } from '../../services/blogService';
import type { Blog } from '../../services/blogService';
import { useNavigate } from "react-router-dom";
import MentorCard from "../../components/Learner/mentor/MentorCard";
import ServicesTab from "./ServicesTab";
import * as quizService from "../../services/quizService";
import { useToast } from "../../contexts/ToastContext";
import { getErrorMessage } from "../../utils/errorHandler";
import FullScreenLoader from "../../components/FullScreenLoader";
import {
  getMyApplications,
  type MenteeApplication,
} from "../../services/menteeApplicationApi";
import { sessionsService, type Session } from "../../services/sessionsService";
import RecordedSessionCard from "../../components/Learner/RecordedSessionCard";
import SessionDetailsModal from "../../components/Learner/SessionDetailsModal";

const tabs = [
  { name: "Quizzes", icon: <BookOpen size={16} /> },
  { name: "Favorites", icon: <Star size={16} /> },
  // { name: "Competitions", icon: <Trophy size={16} /> },
  { name: "Services", icon: <CalendarDays size={16} /> },
  { name: "Mentors", icon: <User size={16} /> },
  // { name: "Influencers", icon: <Users size={16} /> },
  { name: "Sessions", icon: <ShoppingCart size={16} /> },
];

interface Quiz {
  id: number;
  name: string;
  description: string;
  level: string;
  time_limit: number;
  question_count: number;
  participants_count: number;
  hasParticipated?: boolean;
  userScore?: number | null;
  // status removed
}

export interface ParticipatedQuiz {
  quiz_id: number;
  quiz_name: string;
  quiz_description: string;
  quiz_level: string;
  time_limit: number;
  question_count: number;
  score: number;
  correct_answers: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
}

// interface ServiceBooking {
//   id: number;
//   serviceType: string;
//   providerName: string;
//   date: string;
//   status: 'Confirmed' | 'Pending';
// }


// (Removed duplicate function MyUniverse)
// const userCompetitions: Competition[] = [
//   {
//     id: 1,
//     name: "Astronomy Olympiad",
//     date: "2025-07-20",
//     status: "Registered",
//   },
//   {
//     id: 2,
//     name: "Galaxy Challenge",
//     date: "2025-06-10",
//     status: "Completed",
//     score: 85,
//     rank: 3,
//   },
//   {
//     id: 3,
//     name: "Nebula Sketch Contest",
//     date: "2025-07-18",
//     status: "Pending",
//   },
//   {
//     id: 4,
//     name: "Astro Coding Jam",
//     date: "2025-05-22",
//     status: "Completed",
//     score: 92,
//     rank: 1,
//   },
// ];
// const registeredCompetitions = [
//   {
//     id: 1,
//     coverImage:
//       "https://png.pngtree.com/png-vector/20221020/ourmid/pngtree-happy-children-with-medals-on-school-competition-on-contest-png-image_6331904.png",
//     name: "Galactic Quiz",
//     date: "2025-07-20",
//     description: "Test your astronomy knowledge!",
//     status: "ongoing", // could also be "completed", etc.
//   },
//   {
//     id: 2,
//     coverImage:
//       "https://w7.pngwing.com/pngs/731/996/png-transparent-competition-winners-hand-table-tree-thumbnail.png",
//     name: "Star Mapping Challenge",
//     date: "2025-08-02",
//     description: "Map constellations with precision.",
//     status: "upcoming",
//   },
// ];
// const bookedServices: ServiceBooking[] = [
//   {
//     id: 1,
//     serviceType: 'Telescope Rental',
//     providerName: 'AstroLens Pvt Ltd',
//     date: '2025-07-25',
//     status: 'Confirmed',
//   },
//   {
//     id: 2,
//     serviceType: 'Planetarium Visit Guide',
//     providerName: 'Dr. Nova Stellar',
//     date: '2025-07-28',
//     status: 'Pending',
//   },
// ];
const MyUniverse = () => {
  const { showError } = useToast();
  // Connected mentors state
  const [connectedMentors, setConnectedMentors] = useState<MenteeApplication[]>(
    []
  );
  const [loadingMentors, setLoadingMentors] = useState(false);

  const navigate = useNavigate();

 


  // Favourites (blogs liked by user)
  const [favouriteBlogs, setFavouriteBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  useEffect(() => {
    // Fetch only blogs liked by the user
    const fetchLikedBlogs = async () => {
      setBlogsLoading(true);
      try {
        const res = await blogService.getLikedBlogs();
        // API shape: { success, data: { blogs: Blog[], pagination } }
        const blogs = res?.data?.blogs || [];
        setFavouriteBlogs(blogs);
      } catch (err: any) {
        showError('Failed to load favourite blogs');
      } finally {
        setBlogsLoading(false);
      }
    };
    fetchLikedBlogs();
  }, [showError]);

  const [activeTab, setActiveTab] = useState("Quizzes");
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<quizService.Quiz | null>(
    null
  );
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [participatedQuizzes, setParticipatedQuizzes] = useState<
    ParticipatedQuiz[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Derived stats computed from fetched quizzes so we can display stat cards immediately
  const derivedStats = useMemo(() => {
    const quizzes = availableQuizzes || []
    const totalQuizzes = quizzes.length
    const totalParticipants = quizzes.reduce((sum, q) => sum + (q.participants_count ?? 0), 0)
    const totalQuestions = quizzes.reduce((sum, q) => sum + (q.question_count ?? 0), 0)
    const avgQuestionsPerQuiz = totalQuizzes > 0 ? (totalQuestions / totalQuizzes).toFixed(1) : '0'
    const participatedCount = participatedQuizzes.length
    return { totalQuizzes, totalParticipants, totalQuestions, avgQuestionsPerQuiz, participatedCount }
  }, [availableQuizzes, participatedQuizzes])

  // Fetch available quizzes
  const fetchAvailableQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const quizzes = await quizService.getAllQuizzes();

      // Transform to match local Quiz interface (status removed)
      const transformedQuizzes: Quiz[] = quizzes.map((q) => ({
        id: q.id,
        name: q.name,
        description: q.description,
        level: q.level,
        time_limit: q.time_limit,
        question_count: q.question_count,
        participants_count: q.participants_count,
        hasParticipated: q.hasParticipated,
        userScore: q.userScore,
        // status: q.status, // REMOVED
      }));

      setAvailableQuizzes(transformedQuizzes);
    } catch (error) {
      showError(getErrorMessage(error, "Failed to load quizzes"));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Fetch participated quizzes
  const fetchParticipatedQuizzes = async () => {
    try {
      const myQuizzes = await quizService.getAllQuizzes();
      const participated = myQuizzes.filter((q) => q.hasParticipated);

      // Fetch results for each participated quiz
      const resultsPromises = participated.map(async (quiz) => {
        try {
          const result = await quizService.getMyQuizResult(quiz.id);
          return {
            quiz_id: quiz.id,
            quiz_name: quiz.name,
            quiz_description: quiz.description,
            quiz_level: quiz.level,
            time_limit: quiz.time_limit,
            question_count: quiz.question_count,
            score: result.score,
            correct_answers: result.correct_answers,
            total_questions: result.total_questions,
            percentage: result.percentage,
            completed_at: new Date().toISOString(),
          };
        } catch (error) {
          console.error(`Failed to fetch result for quiz ${quiz.id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(resultsPromises);
      const validResults = results.filter(
        (r) => r !== null
      ) as ParticipatedQuiz[];
      setParticipatedQuizzes(validResults);
    } catch (error) {
      console.error("Error fetching participated quizzes:", error);
    }
  };

  // Fetch connected mentors
  const fetchConnectedMentors = useCallback(async () => {
    try {
      setLoadingMentors(true);
      const applications = await getMyApplications();
      // Filter only accepted applications
      const accepted = applications.filter(
        (app) => app.application_status === "accepted"
      );
      setConnectedMentors(accepted);
    } catch (error) {
      console.error("Error fetching connected mentors:", error);
      showError(getErrorMessage(error, "Failed to load connected mentors"));
    } finally {
      setLoadingMentors(false);
    }
  }, [showError]);

  // Load data on component mount and tab change
  useEffect(() => {
    if (activeTab === "Quizzes") {
      fetchAvailableQuizzes();
      fetchParticipatedQuizzes();
    } else if (activeTab === "Mentors") {
      fetchConnectedMentors();
    }
  }, [activeTab, fetchAvailableQuizzes, fetchConnectedMentors]);

  const handleParticipate = (quiz: Quiz) => {
    const fullQuiz = availableQuizzes.find((q) => q.id === quiz.id);
    if (fullQuiz) {
      setSelectedQuiz({
        id: fullQuiz.id,
        name: fullQuiz.name,
        description: fullQuiz.description,
        level: fullQuiz.level,
        time_limit: fullQuiz.time_limit,
        question_count: fullQuiz.question_count,
        participants_count: fullQuiz.participants_count,
        category: "",
        time: null,
        user_id: 0,
        created_at: "",
        modified_at: "",
        status: "approved",
        creator: { id: 0 },
        questions: [],
        participants: [],
      } as quizService.Quiz);
      setShowQuizModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowQuizModal(false);
    setSelectedQuiz(null);
    // Refresh the quizzes list to update participation status
    fetchAvailableQuizzes();
    fetchParticipatedQuizzes();
  };

  const handleEdit = (quiz: Quiz) => {
    alert(`Edit clicked for quiz: ${quiz.name}`);
  };

  // Sessions state and data
  const [sessionFilter, setSessionFilter] = useState("All Sessions");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);

  // Fetch enrolled sessions
  useEffect(() => {
    if (activeTab === "Sessions") {
      fetchEnrolledSessions();
    }
  }, [activeTab]);

  const fetchEnrolledSessions = async () => {
    try {
      setLoadingSessions(true);
      setSessionsError(null);
      const response = await sessionsService.getEnrolledSessions({
        limit: 100,
        sort_by: 'enrollment_date',
        sort_order: 'desc'
      });
      setSessions(response.data);
    } catch (err: any) {
      console.error('Error fetching enrolled sessions:', err);
      setSessionsError(err.message || 'Failed to load your enrolled sessions');
    } finally {
      setLoadingSessions(false);
    }
  };

  // Helper: get filtered sessions
  const filteredSessions = sessions.filter((session) => {
    if (sessionFilter === "All Sessions") return true;
    if (sessionFilter === "Live") return session.session_type === "live";
    if (sessionFilter === "Recorded") return session.session_type === "recorded";
    return true;
  });

  // Calendar logic for sessions
  const dateSessionMap = Object.fromEntries(
    sessions.map(s => {
      const dateStr = new Date(s.session_date).toISOString().slice(0, 10);
      return [dateStr, s.title];
    })
  );

  // Calendar tile className
  const sessionTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateStr = date.toISOString().slice(0, 10);
      if (dateSessionMap[dateStr]) {
        return "calendar-booked";
      }
    }
    return "";
  };

  // Tooltip for session name
  const [hoveredSessionDate, setHoveredSessionDate] = useState<string | null>(null);

  const handleSessionDateMouseOver = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    if (dateSessionMap[dateStr]) {
      setHoveredSessionDate(dateStr);
    } else {
      setHoveredSessionDate(null);
    }
  };
  
  const handleSessionDateMouseOut = () => setHoveredSessionDate(null);

  return (
    <div className="universe-my-universe">
      <div className="juniverse-summary-card">
        <h2>My Universe</h2>
        <div>
          ⭐ Favorites: 6 &nbsp;| 📚 Mentor Courses:
          1 &nbsp;| 🪐 Services: 2
        </div>
      </div>

      {/* Tabs */}
      <div className="universe-tabs">
        {tabs.map((tab) => (
          <Button
            key={tab.name}
            variant={activeTab === tab.name ? "primary" : "secondary"}
            className="flex items-center gap-2 text-sm font-semibold"
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.icon}
            {tab.name}
          </Button>
        ))}
      </div>

      {/* Content Container */}
      <div className="universe-tab-content">
        {activeTab === "Quizzes" && (
          <>
            {loading ? (
              <div className="loading-message">
                <FullScreenLoader isVisible={true} />
              </div>
            ) : (
              <>
                <div
                  className="universe-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {/* Quick overview stats so users see metrics without refresh */}
                  <div className="universe-stats" style={{ gridColumn: '1/-1', marginBottom: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div className="stat-card" style={{ padding: '0.5rem 0.75rem', minWidth: 120, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{derivedStats.totalQuizzes}</div>
                      <div style={{ fontSize: '0.75rem', color: '#93a0bf' }}>Total Quizzes</div>
                    </div>
                    <div className="stat-card" style={{ padding: '0.5rem 0.75rem', minWidth: 120, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{derivedStats.participatedCount}</div>
                      <div style={{ fontSize: '0.75rem', color: '#93a0bf' }}>Participated</div>
                    </div>
                    <div className="stat-card" style={{ padding: '0.5rem 0.75rem', minWidth: 120, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{derivedStats.totalQuestions}</div>
                      <div style={{ fontSize: '0.75rem', color: '#93a0bf' }}>Total Questions</div>
                    </div>
                    <div className="stat-card" style={{ padding: '0.5rem 0.75rem', minWidth: 120, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{derivedStats.avgQuestionsPerQuiz}</div>
                      <div style={{ fontSize: '0.75rem', color: '#93a0bf' }}>Avg Questions/Quiz</div>
                    </div>
                  </div>
                  {availableQuizzes.length > 0 ? (
                    availableQuizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.id}
                        quiz={{
                          id: quiz.id,
                          name: quiz.name,
                          description: quiz.description,
                          level: quiz.level,
                          time: quiz.time_limit,
                          questionCount: quiz.question_count,
                          participantsCount: quiz.participants_count,
                        }}
                        onParticipate={() => handleParticipate(quiz)}
                        onEdit={() => handleEdit(quiz)}
                        isMyQuiz={false}
                      />
                    ))
                  ) : (
                    <div className="no-quizzes-message">
                      <p>
                        No approved quizzes available at the moment. Check back
                        later!
                      </p>
                    </div>
                  )}
                </div>

                {/* Participated Quizzes Table */}
                {participatedQuizzes.length > 0 && (
                  <div className="participated-quizzes-table mt-12">
                    <h2 className="participated-quizzes-table-h3">
                      My Participated Quizzes
                    </h2>
                    <table className="participated-quizzes-table-table">
                      <thead className="participated-quizzes-table-thead">
                        <tr className="participated-quizzes-table-tr">
                          <th className="participated-quizzes-table-th">
                            Quiz Name
                          </th>
                          <th className="participated-quizzes-table-th">
                            Level
                          </th>
                          <th className="participated-quizzes-table-th">
                            Score
                          </th>
                          <th className="participated-quizzes-table-th">
                            Correct Answers
                          </th>
                          <th className="participated-quizzes-table-th">
                            Total Questions
                          </th>
                          <th className="participated-quizzes-table-th">
                            Percentage
                          </th>
                          <th className="participated-quizzes-table-th">
                            Completed At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="participated-quizzes-table-tbody">
                        {participatedQuizzes.map((quiz) => (
                          <tr
                            key={quiz.quiz_id}
                            className="participated-quizzes-table-tr"
                          >
                            <td
                              data-label="Quiz Name"
                              className="participated-quizzes-table-td"
                            >
                              {quiz.quiz_name}
                            </td>
                            <td
                              data-label="Level"
                              className="participated-quizzes-table-td"
                            >
                              <span
                                className={`level-badge ${quiz.quiz_level.toLowerCase()}`}
                              >
                                {quiz.quiz_level}
                              </span>
                            </td>
                            <td
                              data-label="Score"
                              className="participated-quizzes-table-td"
                            >
                              <strong>{quiz.score}</strong>
                            </td>
                            <td
                              data-label="Correct Answers"
                              className="participated-quizzes-table-td"
                            >
                              {quiz.correct_answers}
                            </td>
                            <td
                              data-label="Total Questions"
                              className="participated-quizzes-table-td"
                            >
                              {quiz.total_questions}
                            </td>
                            <td
                              data-label="Percentage"
                              className="participated-quizzes-table-td"
                            >
                              <span
                                className={
                                  quiz.percentage >= 70
                                    ? "text-green"
                                    : quiz.percentage >= 50
                                    ? "text-yellow"
                                    : "text-red"
                                }
                              >
                                {quiz.percentage.toFixed(1)}%
                              </span>
                            </td>
                            <td
                              data-label="Completed At"
                              className="participated-quizzes-table-td"
                            >
                              {new Date(quiz.completed_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === "Favorites" && (
          <>
            <h2>Favorite Blogs</h2>
            {blogsLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : favouriteBlogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8b93ab' }}>No favorite blogs found.</div>
            ) : (
              <div className="astronomy-card-container">
                {favouriteBlogs.map((blog) => (
                  <AstronomyBlogCard
                    key={blog.id}
                    image={blog.featured_image || blog.image_url || ''}
                    title={blog.title}
                    author={blog.author_display_name || blog.author_name || 'Unknown'}
                    createdAt={blog.created_at}
                    rating={typeof blog.like_count === 'number' ? blog.like_count / 2 : 4.5}
                    content={blog.content}
                    onClick={() => navigate(`/dashboard/blogs/${blog.id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}
        {activeTab === "Services" && (
          <div>
            <ServicesTab />
          </div>
        )}

        {activeTab === "Mentors" && (
          <>
            <h2>Connected Mentors</h2>
            {loadingMentors ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "#c7d0e6",
                }}
              >
                Loading your connected mentors...
              </div>
            ) : connectedMentors.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "#8b93ab",
                  background: "#19223a",
                  borderRadius: "12px",
                  border: "2px dashed #2e3a5e",
                }}
              >
                <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                  📚 No mentors connected yet
                </p>
                <p style={{ marginBottom: "1.5rem" }}>
                  Apply to mentors to start your learning journey!
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/dashboard/mentors")}
                >
                  Explore Mentors
                </Button>
              </div>
            ) : (
              <div className="mentor-card-list">
                {connectedMentors.map((application) => {
                  const mentor = application.mentor;
                  const displayName =
                    mentor?.display_name ||
                    `${mentor?.first_name || ""} ${
                      mentor?.last_name || ""
                    }`.trim() ||
                    "Mentor";

                  // Get profile picture from mentor's profile_data or use default
                  const profileData = mentor?.profile_data as
                    | Record<string, unknown>
                    | undefined;
                  console.log("🖼️ Mentor profile data:", {
                    mentorName: displayName,
                    profileData: profileData,
                    hasAvatarUrl: !!profileData?.avatarUrl,
                    hasProfilePicture: !!profileData?.profilePicture,
                    hasAvatar: !!profileData?.avatar,
                  });

                  const profilePicture =
                    (profileData?.avatarUrl as string) ||
                    (profileData?.profilePicture as string) ||
                    (profileData?.avatar as string) ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      displayName
                    )}&background=4f8cff&color=fff&size=200`;

                  console.log("🖼️ Using profile picture:", profilePicture);

                  return (
                    <MentorCard
                      key={application.application_id}
                      mentor={{
                        id: application.application_id,
                        name: displayName,
                        expertise: "Mentor",
                        description: `Connected since ${new Date(
                          application.reviewed_at || application.submitted_at
                        ).toLocaleDateString()}`,
                        availableSlots: 1,
                        image: profilePicture,
                        accepting: true,
                      }}
                      onOpen={(id: number) =>
                        navigate(`/dashboard/mentor-connection/${id}`)
                      }
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        

        {showQuizModal && selectedQuiz && (
          <QuizModal quiz={selectedQuiz} onClose={handleCloseModal} />
        )}

        {activeTab === "Sessions" && (
          <div className="sessions-tab-main-layout">
            <div className="sessions-tab-content">
              {loadingSessions ? (
                <div style={{ color: '#60a5fa', marginTop: '1.5rem', fontSize: '1.1rem', textAlign: 'center' }}>
                  Loading your sessions...
                </div>
              ) : sessionsError ? (
                <div>
                  <div style={{ color: '#ef4444', marginTop: '1.5rem', fontSize: '1.1rem', textAlign: 'center' }}>
                    {sessionsError}
                  </div>
                  <button 
                    onClick={fetchEnrolledSessions}
                    style={{
                      display: 'block',
                      margin: '1rem auto',
                      padding: '0.5rem 1rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div className="sessions-header">
                    <h2>My Sessions</h2>
                    <p className="sessions-subtitle">
                      View and access all your enrolled sessions
                    </p>
                  </div>
                  
                  <div className="sessions-filters">
                    <select
                      value={sessionFilter}
                      onChange={(e) => setSessionFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="All Sessions">All Sessions</option>
                      <option value="Live">Live Sessions</option>
                      <option value="Recorded">Recorded Sessions</option>
                    </select>
                  </div>

                  {filteredSessions.length === 0 ? (
                    <div className="no-sessions">
                      {sessionFilter !== "All Sessions" ? (
                        <div>
                          <p>No sessions found matching your filters.</p>
                          <button 
                            onClick={() => setSessionFilter("All Sessions")}
                            className="clear-filters-btn"
                          >
                            Clear Filters
                          </button>
                        </div>
                      ) : (
                        <div className="empty-state">
                          <div className="empty-icon">📚</div>
                          <h4>No Enrolled Sessions Yet</h4>
                          <p>You haven't enrolled in any sessions yet.</p>
                          <p>Browse our live and recorded sessions to get started!</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="sessions-count">
                        Showing {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
                      </div>
                      <div className="my-sessions-list">
                        {filteredSessions.map((session) => {
                          const creatorName = session.creator?.display_name || 
                            `${session.creator?.first_name || ''} ${session.creator?.last_name || ''}`.trim() || 
                            'Unknown';
                          
                          const sessionDate = new Date(session.session_date);
                          const formattedDate = sessionDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          });
                          
                          return (
                            <RecordedSessionCard
                              key={session.id}
                              id={session.id}
                              title={session.title}
                              date={formattedDate}
                              instructor={creatorName}
                              category={session.payment_type}
                              difficulty={session.difficulty_level}
                              description={session.description}
                              duration={session.duration}
                              price={session.price}
                              onViewDetails={() => {
                                setSelectedSession(session);
                                setSessionModalOpen(true);
                              }}
                            />
                          );
                        })}
                      </div>
                    </>
                  )}

                  <SessionDetailsModal
                    session={selectedSession}
                    open={sessionModalOpen}
                    onClose={() => setSessionModalOpen(false)}
                    onEnrollmentSuccess={fetchEnrolledSessions}
                    isEnrolled={true}
                  />
                </>
              )}
            </div>

            {/* Calendar Section */}
            <div className="sessions-tab-calendar">
              <h3>Sessions Calendar</h3>
              <Calendar
                tileContent={({ date, view }: { date: Date; view: string }) => {
                  if (view === "month") {
                    const dateStr = date.toISOString().slice(0, 10);
                    if (dateSessionMap[dateStr]) {
                      return (
                        <div
                          className="calendar-dot"
                          onMouseEnter={() => handleSessionDateMouseOver(date)}
                          onMouseLeave={handleSessionDateMouseOut}
                        />
                      );
                    }
                  }
                  return null;
                }}
                tileClassName={sessionTileClassName}
              />
              {hoveredSessionDate && (
                <div className="calendar-tooltip">
                  {dateSessionMap[hoveredSessionDate]}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyUniverse;

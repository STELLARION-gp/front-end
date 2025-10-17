// pages/learner/MyUniverse.tsx
import  { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/pages/learner/MyUniverse.scss';
import {
  Star,
  BookOpen,
  CalendarDays,
  Users,
  User,
  Trophy,
  ShoppingCart
} from 'lucide-react';
import QuizCard from '../../components/Learner/QuizCard';
import Button from '../../components/Button';
import QuizModal from '../../components/Learner/QuizModal';
import AstronomyBlogCard from '../../components/Learner/blogcard';
import { useNavigate } from 'react-router-dom';
import AstronomyCompetitionCard from '../../components/Learner/AstronomyCompetitionCard';
import MentorCard from '../../components/Learner/mentor/MentorCard';
import InfluencerCard from '../../components/Learner/InfluencerCard';
import ServicesTab from './ServicesTab';
import * as quizService from '../../services/quizService';
import { useToast } from '../../contexts/ToastContext';
import { getErrorMessage } from '../../utils/errorHandler';
import FullScreenLoader from '../../components/FullScreenLoader';


const tabs = [
  { name: 'Quizzes', icon: <BookOpen size={16} /> },
  { name: 'Favorites', icon: <Star size={16} /> },
  { name: 'Competitions', icon: <Trophy size={16} /> },
  { name: 'Services', icon: <CalendarDays size={16} /> },
  { name: 'Mentors', icon: <User size={16} /> },
  { name: 'Influencers', icon: <Users size={16} /> },
  { name: 'Sessions', icon: <ShoppingCart size={16} /> }
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
interface Competition {
  id: number;
  name: string;
  date: string;
  status: 'Registered' | 'Pending' | 'Completed';
  score?: number;
  rank?: number;
}
// interface ServiceBooking {
//   id: number;
//   serviceType: string;
//   providerName: string;
//   date: string;
//   status: 'Confirmed' | 'Pending';
// }

const favourite_blogs = [
  {
    id: 1,
    image: "https://kielderobservatory.org/images/stories/virtuemart/product/Orion%20Nebula%20-%20AS%20-%20med.jpg",
    title: "The Orion Nebula: A Stellar Nursery",
    author: "Dr. Jane Skywalker",
    createdAt: "2025-06-20",
    rating: 4.7,
    content: "The Orion Nebula is one of the brightest nebulae visible to the naked eye. Located around 1,344 light-years away, it is a region where new stars are born. In this article, we explore its structure, the Trapezium cluster, and how the nebula helps astronomers understand stellar evolution."
  },
  {
    id: 2,
    image: "https://cdn.arstechnica.net/wp-content/uploads/2024/03/cosmology-astronomy-discoveries.jpg",
    title: "Exploring the Expanding Universe",
    author: "Prof. John Cosmos",
    createdAt: "2025-06-18",
    rating: 4.9,
    content: "Ever since Edwin Hubble’s discovery, the expanding universe has intrigued cosmologists. This blog delves into redshift, the cosmic microwave background radiation, and the implications of dark energy in accelerating the expansion of our universe."
  },
  {
    id: 3,
    image: "https://static.vecteezy.com/system/resources/previews/027/100/104/large_2x/the-starry-night-sky-with-the-milky-way-galaxy-space-dust-and-a-planet-in-the-background-all-free-photo.jpg",
    title: "The Magic of Solar Eclipses",
    author: "Luna Rivera",
    createdAt: "2025-06-15",
    rating: 4.6,
    content: "Solar eclipses offer a rare chance to study the Sun's corona and impact public interest in astronomy. This article covers the types of solar eclipses, historical significance, safety tips, and upcoming eclipse dates visible from Earth."
  },

]
const userCompetitions: Competition[] = [
  { id: 1, name: 'Astronomy Olympiad', date: '2025-07-20', status: 'Registered' },
  { id: 2, name: 'Galaxy Challenge', date: '2025-06-10', status: 'Completed', score: 85, rank: 3 },
  { id: 3, name: 'Nebula Sketch Contest', date: '2025-07-18', status: 'Pending' },
  { id: 4, name: 'Astro Coding Jam', date: '2025-05-22', status: 'Completed', score: 92, rank: 1 }
];
const registeredCompetitions = [
  {
    id: 1,
    coverImage: "https://png.pngtree.com/png-vector/20221020/ourmid/pngtree-happy-children-with-medals-on-school-competition-on-contest-png-image_6331904.png",
    name: "Galactic Quiz",
    date: "2025-07-20",
    description: "Test your astronomy knowledge!",
    status: "ongoing", // could also be "completed", etc.
  },
  {
    id: 2,
    coverImage: "https://w7.pngwing.com/pngs/731/996/png-transparent-competition-winners-hand-table-tree-thumbnail.png",
    name: "Star Mapping Challenge",
    date: "2025-08-02",
    description: "Map constellations with precision.",
    status: "upcoming",
  },
];
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
  // Sample connected influencers
  const [connectedInfluencers] = useState([
    {
      id: 1,
      name: 'Dr. Jane Skywalker',
      expertise: 'Astronomy Communication',
      description: 'Sharing cosmic discoveries and science news with the world.',
      image: 'https://randomuser.me/api/portraits/women/50.jpg',
      isFollowed: true
    },
    {
      id: 2,
      name: 'Prof. John Cosmos',
      expertise: 'Space Exploration',
      description: 'Updates on missions, telescopes, and the future of space travel.',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      isFollowed: true
    }
  ]);

  const navigate = useNavigate();
  
  const handleOpenInfluencer = (name: string) => {
    const encodedName = encodeURIComponent(name);
    navigate(`/dashboard/author/${encodedName}`);
  };

  const { showError } = useToast();
  
  const [activeTab, setActiveTab] = useState('Quizzes');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<quizService.Quiz | null>(null);
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [participatedQuizzes, setParticipatedQuizzes] = useState<ParticipatedQuiz[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch available quizzes
  const fetchAvailableQuizzes = async () => {
    try {
      setLoading(true);
      const quizzes = await quizService.getAllQuizzes();
      
      // Transform to match local Quiz interface
      const transformedQuizzes: Quiz[] = quizzes.map(q => ({
        id: q.id,
        name: q.name,
        description: q.description,
        level: q.level,
        time_limit: q.time_limit,
        question_count: q.question_count,
        participants_count: q.participants_count,
        hasParticipated: q.hasParticipated,
        userScore: q.userScore
      }));
      
      setAvailableQuizzes(transformedQuizzes);
    } catch (error) {
      showError(getErrorMessage(error, 'Failed to load quizzes'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch participated quizzes
  const fetchParticipatedQuizzes = async () => {
    try {
      const myQuizzes = await quizService.getAllQuizzes();
      const participated = myQuizzes.filter(q => q.hasParticipated);
      
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
            completed_at: new Date().toISOString()
          };
        } catch (error) {
          console.error(`Failed to fetch result for quiz ${quiz.id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(resultsPromises);
      const validResults = results.filter(r => r !== null) as ParticipatedQuiz[];
      setParticipatedQuizzes(validResults);
    } catch (error) {
      console.error('Error fetching participated quizzes:', error);
    }
  };

  // Load data on component mount and tab change
  useEffect(() => {
    if (activeTab === 'Quizzes') {
      fetchAvailableQuizzes();
      fetchParticipatedQuizzes();
    }
  }, [activeTab]);

  const handleParticipate = (quiz: Quiz) => {
    const fullQuiz = availableQuizzes.find(q => q.id === quiz.id);
    if (fullQuiz) {
      setSelectedQuiz({
        id: fullQuiz.id,
        name: fullQuiz.name,
        description: fullQuiz.description,
        level: fullQuiz.level,
        time_limit: fullQuiz.time_limit,
        question_count: fullQuiz.question_count,
        participants_count: fullQuiz.participants_count,
        category: '',
        time: null,
        user_id: 0,
        created_at: '',
        modified_at: '',
        status: 'approved',
        creator: { id: 0 },
        questions: [],
        participants: []
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

  // Sample session data
  const [sessionFilter, setSessionFilter] = useState('All Sessions');
  const [sessions] = useState([
    {
      id: 1,
      name: 'Exploring Exoplanets',
      date: '2025-07-20',
      time: '18:00',
      host: 'Dr. Stella Orion',
      type: 'Live',
      status: 'Upcoming',
      isRegistered: true,
      isBought: false,
      isCompleted: false,
      isRecorded: false,
    },
    {
      id: 2,
      name: 'Cosmic Mysteries Revealed',
      date: '2025-07-22',
      time: '20:00',
      host: 'Prof. Leo Pulsar',
      type: 'Recorded',
      status: 'Completed',
      isRegistered: false,
      isBought: true,
      isCompleted: true,
      isRecorded: true,
    },
    {
      id: 3,
      name: 'Live Q&A: Black Holes',
      date: '2025-07-19',
      time: '17:00',
      host: 'Dr. Jane Skywalker',
      type: 'Live',
      status: 'Active',
      isRegistered: true,
      isBought: false,
      isCompleted: false,
      isRecorded: false,
    },
    {
      id: 4,
      name: 'Recorded: Solar System Tour',
      date: '2025-07-10',
      time: '15:00',
      host: 'Prof. John Cosmos',
      type: 'Recorded',
      status: 'Completed',
      isRegistered: false,
      isBought: true,
      isCompleted: true,
      isRecorded: true,
    },
    {
      id: 5,
      name: 'Upcoming: Meteor Showers',
      date: '2025-07-21',
      time: '19:00',
      host: 'Dr. Nova Stellar',
      type: 'Live',
      status: 'Upcoming',
      isRegistered: true,
      isBought: false,
      isCompleted: false,
      isRecorded: false,
    },
  ]);

  // Helper: get filtered sessions
  const filteredSessions = sessions.filter((session) => {
    if (sessionFilter === 'All Sessions') return true;
    if (sessionFilter === 'Live') return session.type === 'Live';
    if (sessionFilter === 'Recorded') return session.type === 'Recorded';
    if (sessionFilter === 'Completed') return session.isCompleted;
    return true;
  });


  // Calendar logic for sessions
  const sessionDates = sessions.filter(s => s.status === 'Upcoming' || s.status === 'Active');
  const dateSessionMap: { [date: string]: string } = Object.fromEntries(
    sessionDates.map(s => [s.date, s.name])
  );

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

  const sessionTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
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
  };
  const sessionTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().slice(0, 10);
      if (dateSessionMap[dateStr]) {
        return 'calendar-booked';
      }
    }
    return '';
  };

  // Helper: countdown for sessions within 24h
const getCountdown = (dateStr: string, timeStr: string): string | null => {
  const sessionDate = new Date(`${dateStr}T${timeStr}:00`);
  const now = new Date();
  const diffMs = sessionDate.getTime() - now.getTime();
  if (diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }
  return null;
};

  // Use react-calendar for sessions

  return (
    <div className="universe-my-universe">
      <div className="juniverse-summary-card">
        <h2>My Universe</h2>
        <div>
          ⭐ Favorites: 6 &nbsp;| 🎯 Competitions: 3 &nbsp;| 📚 Mentor Courses: 1 &nbsp;| 🪐 Services: 2
        </div>
      </div>

      {/* Tabs */}
      <div className="universe-tabs">
        {tabs.map((tab) => (
          <Button
            key={tab.name}
            variant={activeTab === tab.name ? 'primary' : 'secondary'}
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
        {activeTab === 'Quizzes' && (
          <>
            {loading ? (
              <div className="loading-message">
                <FullScreenLoader isVisible={true} />
              </div>
            ) : (
              <>
                <div className="universe-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
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
                          participantsCount: quiz.participants_count
                        }}
                        onParticipate={() => handleParticipate(quiz)}
                        onEdit={() => handleEdit(quiz)}
                        isMyQuiz={false}
                      />
                    ))
                  ) : (
                    <div className="no-quizzes-message">
                      <p>No approved quizzes available at the moment. Check back later!</p>
                    </div>
                  )}
                </div>

                {/* Participated Quizzes Table */}
                {participatedQuizzes.length > 0 && (
                  <div className="participated-quizzes-table mt-12">
                    <h2 className='participated-quizzes-table-h3'>My Participated Quizzes</h2>
                    <table className='participated-quizzes-table-table'>
                      <thead className='participated-quizzes-table-thead'>
                        <tr className='participated-quizzes-table-tr'>
                          <th className='participated-quizzes-table-th'>Quiz Name</th>
                          <th className='participated-quizzes-table-th'>Level</th>
                          <th className='participated-quizzes-table-th'>Score</th>
                          <th className='participated-quizzes-table-th'>Correct Answers</th>
                          <th className='participated-quizzes-table-th'>Total Questions</th>
                          <th className='participated-quizzes-table-th'>Percentage</th>
                          <th className='participated-quizzes-table-th'>Completed At</th>
                        </tr>
                      </thead>
                      <tbody className='participated-quizzes-table-tbody'>
                        {participatedQuizzes.map((quiz) => (
                          <tr key={quiz.quiz_id} className='participated-quizzes-table-tr'>
                            <td data-label="Quiz Name" className='participated-quizzes-table-td'>{quiz.quiz_name}</td>
                            <td data-label="Level" className='participated-quizzes-table-td'>
                              <span className={`level-badge ${quiz.quiz_level.toLowerCase()}`}>{quiz.quiz_level}</span>
                            </td>
                            <td data-label="Score" className='participated-quizzes-table-td'><strong>{quiz.score}</strong></td>
                            <td data-label="Correct Answers" className='participated-quizzes-table-td'>{quiz.correct_answers}</td>
                            <td data-label="Total Questions" className='participated-quizzes-table-td'>{quiz.total_questions}</td>
                            <td data-label="Percentage" className='participated-quizzes-table-td'>
                              <span className={quiz.percentage >= 70 ? 'text-green' : quiz.percentage >= 50 ? 'text-yellow' : 'text-red'}>
                                {quiz.percentage.toFixed(1)}%
                              </span>
                            </td>
                            <td data-label="Completed At" className='participated-quizzes-table-td'>
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

        {activeTab === 'Favorites' && (
          <>
            <h2>Favorite Blogs</h2>
            <div className="astronomy-card-container">
              {favourite_blogs.map((blog) => (
                  <AstronomyBlogCard
                  key={blog.id}
                  image={blog.image}
                  title={blog.title}
                  author={blog.author}
                  createdAt={blog.createdAt}
                  rating={blog.rating}
                  content={blog.content}
                  onClick={() => navigate(`/dashboard/blogs/${blog.id}`)}
                />
              ))}
            </div>

            
            
          </>
        )}
        {activeTab === 'Competitions' && (
          <>
            <div className="competitions-section">
              <div className="registered-competitions-section">
                <h2>Your Registered Competitions</h2>
                <div className="competition-cards-wrapper">
                  {registeredCompetitions.map((comp) => (
                    <div className="card-with-status-badge" key={comp.id}>
                      <AstronomyCompetitionCard
                        coverImage={comp.coverImage}
                        name={comp.name}
                        date={comp.date}
                        description={comp.description}
                        onClick={() =>
                          comp.status === "ongoing"
                            ? navigate("/dashboard/ongoingcompetition")
                            : navigate("/dashboard/competition")
                        }
                      />
                      {comp.status === "ongoing" && (
                        <span className="competition-status-badge">Ongoing</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>


              <h3 className="mb-4">My Competitions</h3>
              <table className="my-competitions-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Score</th>
                    <th>Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {userCompetitions.map((comp) => (
                    <tr key={comp.id}>
                      <td>{comp.name}</td>
                      <td>{comp.date}</td>
                      <td>
                        <span
                          className={`my-competition-status-badge ${
                            comp.status === 'Completed' ? 'completed' : comp.status === 'Registered' ? 'registered' : 'pending'
                          }`}
                        >
                          {comp.status}
                        </span>
                      </td>
                      <td>{comp.status === 'Completed' ? comp.score : '-'}</td>
                      <td>{comp.status === 'Completed' ? `#${comp.rank}` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          </>
          
        )}
        {activeTab === 'Services' && (
          <div>
            <ServicesTab />
          </div>
        )}

        {activeTab === 'Mentors' && (
          <>
            <h2>Connected Mentors</h2>
            <div className="mentor-card-list">
              {[{
                id: 1,
                name: 'Dr. Stella Orion',
                expertise: 'Astrophysics & Space Science',
                description: 'Expert in stellar evolution, black holes, and cosmic phenomena.',
                availableSlots: 2,
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                accepting: true
              }, {
                id: 2,
                name: 'Prof. Leo Pulsar',
                expertise: 'Exoplanets & Cosmology',
                description: 'Specializes in exoplanet discovery and cosmological simulations.',
                availableSlots: 1,
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
                accepting: true
              }].map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onOpen={(id: number) => navigate(`/dashboard/mentor-connection/${id}`)}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'Influencers' && (
          <>
            <h2>Connected Influencers</h2>
            <div className="influencer-card-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {connectedInfluencers.map((influencer) => (
              <InfluencerCard
                key={influencer.id}
                influencer={influencer}
                onFollow={() => {}}
                onOpen={handleOpenInfluencer}
              />
            ))}
            </div>
          </>
        )}




        {showQuizModal && selectedQuiz && (
          <QuizModal quiz={selectedQuiz} onClose={handleCloseModal} />
        )}

        {activeTab === 'Sessions' && (
          <div className="sessions-tab-content">
            <div className="sessions-header">
              <h2>My Sessions</h2>
              <div className="sessions-filter-dropdown">
                <label htmlFor="session-filter">Filter:</label>
                <select
                  id="session-filter"
                  value={sessionFilter}
                  onChange={(e) => setSessionFilter(e.target.value)}
                >
                  <option>All Sessions</option>
                  <option>Live</option>
                  <option>Recorded</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            <div className="session-calendar">
              <h3>Upcoming Sessions Calendar</h3>
              <Calendar
                tileContent={sessionTileContent}
                tileClassName={sessionTileClassName}
              />
              {hoveredSessionDate && (
                <div className="calendar-tooltip">
                  {dateSessionMap[hoveredSessionDate]}
                </div>
              )}
            </div>
            <div className="session-card-list">
              {filteredSessions.length === 0 ? (
                <div className="no-sessions">No sessions found for this filter.</div>
              ) : (
                filteredSessions.map((session) => {
                  const countdown = getCountdown(session.date, session.time);
                  return (
                    <div
                      key={session.id}
                      className={`session-card session-type-${session.type.toLowerCase()} session-status-${session.status.toLowerCase()}`}
                    >
                      <div className="session-card-main">
                        <div className="session-card-header">
                          <span className="session-name">{session.name}</span>
                          <span className="session-type-badge">{session.type}</span>
                        </div>
                        <div className="session-card-details">
                          <span className="session-date">{session.date}</span>
                          <span className="session-time">{session.time}</span>
                          <span className="session-host">Host: {session.host}</span>
                          <span className="session-status">Status: {session.status}</span>
                        </div>
                        {countdown && (
                          <div className="session-countdown">
                            Starts in <span className="countdown-timer">{countdown}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        {session.status === 'Active' && session.type === 'Live' && (
                          <Button variant="primary" onClick={() => alert('Joining live session...')}>Join Live</Button>
                        )}
                        {session.isCompleted && session.isRecorded && (
                          <Button variant="secondary" onClick={() => alert('Watching again...')}>Watch Again</Button>
                        )}
                        {session.isCompleted && !session.isRecorded && (
                          <Button variant="secondary" onClick={() => alert('Reviewing session...')}>Review</Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyUniverse;

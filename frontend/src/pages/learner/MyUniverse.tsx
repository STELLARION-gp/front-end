// pages/learner/MyUniverse.tsx
import  { useState } from 'react';
import '../../styles/pages/learner/MyUniverse.scss';
import {
  Star,
  BookOpen,
  CalendarDays,
  Users,
  User,
  ImageIcon,
  Trophy
} from 'lucide-react';
import QuizCard from '../../components/Learner/QuizCard';
import Button from '../../components/Button';
import QuizModal from '../../components/Learner/QuizModal';

const tabs = [
  { name: 'Quizzes', icon: <BookOpen size={16} /> },
  { name: 'Favorites', icon: <Star size={16} /> },
  { name: 'Competitions', icon: <Trophy size={16} /> },
  { name: 'Services', icon: <CalendarDays size={16} /> },
  { name: 'Mentors', icon: <User size={16} /> },
  { name: 'Influencers', icon: <Users size={16} /> },
  { name: 'My Content', icon: <ImageIcon size={16} /> }
];

interface Quiz {
  id: number;
  name: string;
  description: string;
  level: string;
  time: number;
  questionCount: number;
  participantsCount: number;
}

const sampleQuizzes: Quiz[] = [
  {
    id: 1,
    name: 'Galaxies & Clusters',
    description: 'Test your knowledge about galaxies and star clusters.',
    level: 'Intermediate',
    time: 20,
    questionCount: 15,
    participantsCount: 1234
  },
  {
    id: 2,
    name: 'Astrobiology Basics',
    description: 'Explore the basics of life beyond Earth.',
    level: 'Beginner',
    time: 15,
    questionCount: 10,
    participantsCount: 890
  },
  {
    id: 3,
    name: 'Black Holes Quiz',
    description: 'Dive into the mysteries of black holes.',
    level: 'Advanced',
    time: 25,
    questionCount: 20,
    participantsCount: 456
  }
];

const sampleLeaderboard = [
  {
    id: 1,
    username: 'Alice',
    avatar: '🧑‍🚀',
    rank: 1,
    totalScore: 9800,
    quizzesCompleted: 45,
    averageScore: 92,
    badges: ['Galaxy Master', 'Quiz Streak']
  },
  {
    id: 2,
    username: 'Bob',
    avatar: '👨‍🔬',
    rank: 2,
    totalScore: 9000,
    quizzesCompleted: 40,
    averageScore: 88,
    badges: ['Stellar Student']
  },
  {
    id: 3,
    username: 'You',
    avatar: '🧑‍💻',
    rank: 3,
    totalScore: 8700,
    quizzesCompleted: 38,
    averageScore: 90,
    badges: ['Quiz Warrior', 'Time Challenger', 'Fast Learner']
  }
];

const MyUniverse = () => {
  const [activeTab, setActiveTab] = useState('Quizzes');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const handleParticipate = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizModal(true);
  };

  const handleCloseModal = () => {
    setShowQuizModal(false);
    setSelectedQuiz(null);
  };

  const handleEdit = (quiz: Quiz) => {
    alert(`Edit clicked for quiz: ${quiz.name}`);
  };

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
            variant={activeTab === tab.name ? 'secondary' : 'ghost'}
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
            <div className="universe-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {sampleQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onParticipate={handleParticipate}
                  onEdit={handleEdit}
                  isMyQuiz={false}
                />
              ))}
            </div>

            <div className="leaderboard-section mt-10">
              <div className="leaderboard-header">
                <h2>Leaderboard</h2>
                <p style={{marginLeft:'500px'}}>Top performers in astronomy quizzes</p>
              </div>

              <div className="leaderboard-table">
                <div className="leaderboard-table-header">
                  <div>Rank</div>
                  <div>User</div>
                  <div>Total Score</div>
                  <div>Quizzes</div>
                  <div>Average</div>
                  <div>Badges</div>
                </div>

                <div className="leaderboard-entries">
                  {sampleLeaderboard.map((entry) => (
                    <div
                      key={entry.id}
                      className={`leaderboard-entry ${entry.username === "You" ? "current-user" : ""}`}
                    >
                      <div className="rank-col">
                        <div className={`rank-badge ${entry.rank <= 3 ? `rank-${entry.rank}` : ""}`}>
                          {entry.rank <= 3 && (
                            <svg className="trophy-icon" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 2h12v3h2a1 1 0 011 1v6a3 3 0 01-3 3h-2.17l1.79 4.47A1 1 0 0116.82 21H7.18a1 1 0 01-.89-1.53L8.17 15H6a3 3 0 01-3-3V6a1 1 0 011-1h2V2zm2 3v10h8V5H8zm6 11H10l-.5 1.25h4l-.5-1.25z" />
                            </svg>
                          )}
                          #{entry.rank}
                        </div>
                      </div>

                      <div className="user-col">
                        <div className="user-info">
                          <span className="user-avatar">{entry.avatar}</span>
                          <div className="user-details">
                            <span className="username">{entry.username}</span>
                            {entry.username === "You" && (
                              <span className="current-user-badge">You</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="score-col">
                        <span className="score-number">{entry.totalScore.toLocaleString()}</span>
                      </div>

                      <div className="quizzes-col">
                        <span className="quiz-count">{entry.quizzesCompleted}</span>
                      </div>

                      <div className="average-col">
                        <span className="average-score">{entry.averageScore}%</span>
                      </div>

                      <div className="badges-col">
                        <div className="badges-list">
                          {entry.badges.length > 0 ? (
                            entry.badges.slice(0, 2).map((badge, index) => (
                              <span key={index} className="badge">{badge}</span>
                            ))
                          ) : (
                            <span className="no-badges">-</span>
                          )}
                          {entry.badges.length > 2 && (
                            <span className="more-badges">+{entry.badges.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="leaderboard-footer">
                <div className="ranking-info">
                  <h4>How Rankings Work</h4>
                  <ul>
                    <li>Rankings are based on total points earned across all completed quizzes</li>
                    <li>Points are awarded based on quiz difficulty and completion time</li>
                    <li>Badges are earned for various achievements and milestones</li>
                    <li>Rankings are updated in real-time as new quizzes are completed</li>
                  </ul>
                </div>
              </div>
            </div>


          </>
        )}

        {activeTab === 'Favorites' && (
          <>
            <h3>Favorite Blogs</h3>
            <ul>
              <li>“10 Facts About Exoplanets”</li>
              <li>“James Webb Discoveries 2025”</li>
            </ul>

            <h3>Favorite Images</h3>
            <div className="universe-grid">
              <div className="universe-rounded-box">🌠 Pillars of Creation</div>
              <div className="universe-rounded-box">📷 Rosette Nebula</div>
            </div>
          </>
        )}

        {showQuizModal && selectedQuiz && (
          <QuizModal quiz={selectedQuiz} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default MyUniverse;

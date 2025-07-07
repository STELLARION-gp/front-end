import React, { useState } from 'react'
import '../../styles/pages/enthusiast/Quizzes.scss'
import Button from '../../components/Button'

interface Quiz {
  id: string
  name: string
  description: string
  time: number // in minutes
  questionCount: number
  participantsCount: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  isMyQuiz?: boolean
}

const Quizzes = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all')
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [showQuizModal, setShowQuizModal] = useState(false)

  const sampleQuizzes: Quiz[] = [
    {
      id: '1',
      name: 'Solar System Basics',
      description: 'Test your knowledge about planets, moons, and the structure of our solar system.',
      time: 15,
      questionCount: 20,
      participantsCount: 1247,
      level: 'Beginner'
    },
    {
      id: '2',
      name: 'Black Holes and Galaxies',
      description: 'Explore the mysteries of black holes, galaxy formation, and cosmic phenomena.',
      time: 25,
      questionCount: 30,
      participantsCount: 892,
      level: 'Advanced'
    },
    {
      id: '3',
      name: 'Space Missions History',
      description: 'Journey through the history of space exploration and famous missions.',
      time: 20,
      questionCount: 25,
      participantsCount: 654,
      level: 'Intermediate'
    },
    {
      id: '4',
      name: 'My Custom Space Quiz',
      description: 'A personalized quiz covering various space topics I created.',
      time: 30,
      questionCount: 35,
      participantsCount: 23,
      level: 'Intermediate',
      isMyQuiz: true
    }
  ]

  const filteredQuizzes = activeTab === 'all' 
    ? sampleQuizzes 
    : sampleQuizzes.filter(quiz => quiz.isMyQuiz)

  const handleParticipate = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setShowQuizModal(true)
  }

  const handleStartQuiz = () => {
    if (selectedQuiz) {
      console.log(`Starting quiz: ${selectedQuiz.name}`)
      // Here you would typically navigate to the quiz page or start the quiz
      setShowQuizModal(false)
      setSelectedQuiz(null)
    }
  }

  const closeModal = () => {
    setShowQuizModal(false)
    setSelectedQuiz(null)
  }

  return (
    <div className="quizzes-container">
        <div className="quizzes-header">
          <h1 className="page-title">Space Explorer Quizzes</h1>
          <p className="page-subtitle">
            Test your knowledge about space exploration and astronomy with our interactive quizzes.
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="quizzes-tabs">
          <Button
            onClick={() => setActiveTab('all')}
            variant={activeTab === 'all' ? 'primary' : 'secondary'}
          >
            All Quizzes
          </Button>
          <Button
            onClick={() => setActiveTab('my')}
            variant={activeTab === 'my' ? 'primary' : 'secondary'}
          >
            My Quizzes
          </Button>
        </div>

        {/* Section Title */}
        <div className="section-header">
          <h2 className="section-title">
            {activeTab === 'all' ? 'All Available Quizzes' : 'My Created Quizzes'}
          </h2>

        </div>

        {/* Quiz Cards Grid */}
        <div className="quiz-grid">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <div className="card-content">
                <div className="card-header">
                  <h3 className="quiz-title">{quiz.name}</h3>
                  <span className={`level-badge ${quiz.level.toLowerCase()}`}>
                    {quiz.level}
                  </span>
                </div>
                
                <p className="quiz-description">{quiz.description}</p>
                
                <div className="quiz-stats">
                  <div className="stat-item">
                    <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{quiz.time} minutes</span>
                  </div>
                  
                  <div className="stat-item">
                    <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{quiz.questionCount} questions</span>
                  </div>
                  
                  <div className="stat-item">
                    <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{quiz.participantsCount.toLocaleString()} participants</span>
                  </div>
                </div>
                
                <Button 
                  className="participate-btn"
                  onClick={() => handleParticipate(quiz)}
                >
                  Participate
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="empty-title">No quizzes found</h3>
            <p className="empty-text">
              {activeTab === 'my' ? "You haven't created any quizzes yet." : "No quizzes available at the moment."}
            </p>
          </div>
        )}

        {/* Quiz Participation Modal */}
        {showQuizModal && selectedQuiz && (
          <div className="quiz-modal-overlay" onClick={closeModal}>
            <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
              <div className="quiz-modal-header">
                <h2>{selectedQuiz.name}</h2>
                <button className="close-button" onClick={closeModal}>
                  ×
                </button>
              </div>
              
              <div className="quiz-modal-body">
                <div className="quiz-summary">
                  <p><strong>Description:</strong> {selectedQuiz.description}</p>
                  <p><strong>Level:</strong> {selectedQuiz.level}</p>
                  <p><strong>Duration:</strong> {selectedQuiz.time} minutes</p>
                  <p><strong>Questions:</strong> {selectedQuiz.questionCount}</p>
                  <p><strong>Participants:</strong> {selectedQuiz.participantsCount.toLocaleString()}</p>
                </div>

                <div className="quiz-instructions">
                  <h3>Quiz Instructions</h3>
                  <ul>
                    <li>Read each question carefully before selecting your answer</li>
                    <li>You have {selectedQuiz.time} minutes to complete all {selectedQuiz.questionCount} questions</li>
                    <li>Once you start, you cannot pause the quiz</li>
                    <li>Make sure you have a stable internet connection</li>
                    <li>Your progress will be automatically saved</li>
                  </ul>
                </div>

                <div className="quiz-actions">
                  <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleStartQuiz}>
                    Start Quiz
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  
  )
}

export default Quizzes




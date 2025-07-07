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

  return (
    <div className="quizzes-container">
      <div className="quizzes-wrapper">
        <h1 className="page-title">Space Explorer Quizzes</h1>
        
        {/* Tab Navigation */}
        <div className="tabs-container">
          <div className="tabs-nav">
            <nav className="tab-buttons">
              <Button
                onClick={() => setActiveTab('all')}
                className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              >
                All Quizzes
              </Button>
              <Button
                onClick={() => setActiveTab('my')}
                className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
              >
                My Quizzes
              </Button>
            </nav>
          </div>
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
                
                <Button className="participate-btn">
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
      </div>
    </div>
  )
}

export default Quizzes

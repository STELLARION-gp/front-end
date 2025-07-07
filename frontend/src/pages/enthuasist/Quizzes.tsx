import React, { useState, useEffect } from 'react'
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

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

const Quizzes = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'create'>('all')
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showReview, setShowReview] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null)
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null)
  
  // Create Quiz Form State
  const [createQuizForm, setCreateQuizForm] = useState({
    name: '',
    description: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    time: 15,
    category: '',
    questions: [] as {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }[]
  })
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  })

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

  const sampleQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: 'Which planet is known as the "Red Planet"?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
      explanation: 'Mars is called the Red Planet due to iron oxide (rust) on its surface.'
    },
    {
      id: '2',
      question: 'What is the largest planet in our solar system?',
      options: ['Saturn', 'Neptune', 'Jupiter', 'Uranus'],
      correctAnswer: 2,
      explanation: 'Jupiter is the largest planet in our solar system, with a mass greater than all other planets combined.'
    },
    {
      id: '3',
      question: 'How many moons does Earth have?',
      options: ['0', '1', '2', '3'],
      correctAnswer: 1,
      explanation: 'Earth has one natural satellite, the Moon.'
    },
    {
      id: '4',
      question: 'What is the closest star to Earth?',
      options: ['Alpha Centauri', 'Sirius', 'The Sun', 'Proxima Centauri'],
      correctAnswer: 2,
      explanation: 'The Sun is the closest star to Earth at about 93 million miles away.'
    },
    {
      id: '5',
      question: 'Which planet has the most extensive ring system?',
      options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
      correctAnswer: 1,
      explanation: 'Saturn has the most extensive and visible ring system in our solar system.'
    }
  ]

  const filteredQuizzes = activeTab === 'all' 
    ? sampleQuizzes 
    : sampleQuizzes.filter(quiz => quiz.isMyQuiz)

  // Timer effect
  useEffect(() => {
    if (isQuizStarted && timeRemaining > 0 && !isQuizCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && isQuizStarted) {
      handleQuizSubmit()
    }
  }, [timeRemaining, isQuizStarted, isQuizCompleted])

  const handleParticipate = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setShowQuizModal(true)
  }

  const handleStartQuiz = () => {
    if (selectedQuiz) {
      setIsQuizStarted(true)
      setTimeRemaining(selectedQuiz.time * 60) // Convert minutes to seconds
      setCurrentQuestionIndex(0)
      setSelectedAnswers(new Array(sampleQuestions.length).fill(-1))
      setIsQuizCompleted(false)
      setScore(0)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleQuizSubmit()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleQuizSubmit = () => {
    let correctAnswers = 0
    selectedAnswers.forEach((answer, index) => {
      if (answer === sampleQuestions[index].correctAnswer) {
        correctAnswers++
      }
    })
    setScore(correctAnswers)
    setIsQuizCompleted(true)
  }

  const handleShowReview = () => {
    setShowReview(true)
  }

  const handleBackToResults = () => {
    setShowReview(false)
  }

  const closeModal = () => {
    setShowQuizModal(false)
    setSelectedQuiz(null)
    setIsQuizStarted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setTimeRemaining(0)
    setIsQuizCompleted(false)
    setScore(0)
    setShowReview(false)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-400'
    if (percentage >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const handleCreateQuiz = () => {
    // Here you would typically send the quiz data to your backend
    console.log('Creating quiz:', createQuizForm)
    // Reset form and show success message
    setCreateQuizForm({
      name: '',
      description: '',
      level: 'Beginner',
      time: 15,
      category: '',
      questions: []
    })
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    })
    alert('Quiz created successfully!')
    setActiveTab('my')
  }

  const handleEditQuiz = (quiz: Quiz) => {
    // Populate form with existing quiz data
    setCreateQuizForm({
      name: quiz.name,
      description: quiz.description,
      level: quiz.level,
      time: quiz.time,
      category: 'Astronomy', // Default category for editing
      questions: [] // In real app, load actual questions
    })
    setIsEditing(true)
    setEditingQuizId(quiz.id)
    setActiveTab('create')
  }

  const handleUpdateQuiz = () => {
    // Here you would typically update the quiz in your backend
    console.log('Updating quiz:', editingQuizId, createQuizForm)
    
    // Reset form and editing state
    setCreateQuizForm({
      name: '',
      description: '',
      level: 'Beginner',
      time: 15,
      category: '',
      questions: []
    })
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    })
    setIsEditing(false)
    setEditingQuizId(null)
    alert('Quiz updated successfully!')
    setActiveTab('my')
  }

  const handleCancelEdit = () => {
    setCreateQuizForm({
      name: '',
      description: '',
      level: 'Beginner',
      time: 15,
      category: '',
      questions: []
    })
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    })
    setIsEditing(false)
    setEditingQuizId(null)
    setActiveTab('my')
  }

  const handleAddQuestion = () => {
    if (currentQuestion.question.trim() && currentQuestion.options.every(opt => opt.trim())) {
      if (editingQuestionIndex !== null) {
        // Update existing question
        setCreateQuizForm(prev => ({
          ...prev,
          questions: prev.questions.map((q, index) => 
            index === editingQuestionIndex ? { ...currentQuestion } : q
          )
        }))
        setEditingQuestionIndex(null)
      } else {
        // Add new question
        setCreateQuizForm(prev => ({
          ...prev,
          questions: [...prev.questions, { ...currentQuestion }]
        }))
      }
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      })
    }
  }

  const handleRemoveQuestion = (index: number) => {
    setCreateQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
    // If we're editing this question, cancel the edit
    if (editingQuestionIndex === index) {
      setEditingQuestionIndex(null)
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      })
    }
  }

  const handleEditQuestion = (index: number) => {
    const questionToEdit = createQuizForm.questions[index]
    setCurrentQuestion({
      question: questionToEdit.question,
      options: [...questionToEdit.options],
      correctAnswer: questionToEdit.correctAnswer,
      explanation: questionToEdit.explanation
    })
    setEditingQuestionIndex(index)
  }

  const handleCancelQuestionEdit = () => {
    setEditingQuestionIndex(null)
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    })
  }

  const renderCreateQuizContent = () => (
    <div className="create-quiz-section">
      <div className="create-quiz-form">
        <div className="form-section">
          <h3 className="section-title">
            {isEditing ? 'Edit Quiz Information' : 'Quiz Information'}
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="quiz-name">Quiz Name *</label>
              <input
                id="quiz-name"
                type="text"
                value={createQuizForm.name}
                onChange={(e) => setCreateQuizForm(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter quiz name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quiz-category">Category *</label>
              <input
                id="quiz-category"
                type="text"
                value={createQuizForm.category}
                onChange={(e) => setCreateQuizForm(prev => ({ ...prev, category: e.target.value }))
                }
                placeholder="e.g., Astronomy, Physics"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quiz-level">Difficulty Level</label>
              <select
                id="quiz-level"
                value={createQuizForm.level}
                onChange={(e) => setCreateQuizForm(prev => ({ 
                  ...prev, 
                  level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' 
                }))
                }
                className="form-select"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quiz-time">Time Limit (minutes)</label>
              <input
                id="quiz-time"
                type="number"
                min="5"
                max="180"
                value={createQuizForm.time}
                onChange={(e) => setCreateQuizForm(prev => ({ ...prev, time: parseInt(e.target.value) }))
                }
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="quiz-description">Description *</label>
            <textarea
              id="quiz-description"
              value={createQuizForm.description}
              onChange={(e) => setCreateQuizForm(prev => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe what this quiz covers..."
              className="form-textarea"
              rows={3}
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Add Questions</h3>
          
          <div className="question-form">
            <div className="form-group">
              <label htmlFor="current-question">Question *</label>
              <textarea
                id="current-question"
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))
                }
                placeholder="Enter your question here..."
                className="form-textarea"
                rows={2}
              />
            </div>

            <div className="options-grid">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="option-group">
                  <label htmlFor={`option-${index}`}>
                    Option {String.fromCharCode(65 + index)} *
                  </label>
                  <div className="option-input-group">
                    <input
                      id={`option-${index}`}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options]
                        newOptions[index] = e.target.value
                        setCurrentQuestion(prev => ({ ...prev, options: newOptions }))
                      }}
                      placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                      className="form-input"
                    />
                    <input
                      type="radio"
                      name="correct-answer"
                      checked={currentQuestion.correctAnswer === index}
                      onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))
                      }
                      className="correct-radio"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="explanation">Explanation (Optional)</label>
              <textarea
                id="explanation"
                value={currentQuestion.explanation}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))
                }
                placeholder="Explain why this answer is correct..."
                className="form-textarea"
                rows={2}
              />
            </div>

            <Button 
              onClick={handleAddQuestion}
              disabled={!currentQuestion.question.trim() || !currentQuestion.options.every(opt => opt.trim())}
              className="add-question-btn"
            >
              {editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}
            </Button>

            {editingQuestionIndex !== null && (
              <Button 
                onClick={handleCancelQuestionEdit}
                variant="secondary"
                className="cancel-edit-btn"
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </div>

        {createQuizForm.questions.length > 0 && (
          <div className="form-section">
            <h3 className="section-title">
              Questions Added ({createQuizForm.questions.length})
            </h3>
            
            <div className="questions-list">
              {createQuizForm.questions.map((q, index) => (
                <div key={index} className="question-preview">
                  <div className="question-header">
                    <span className="question-number">Question {index + 1}</span>
                    <div className="question-actions">
                      <button
                        onClick={() => handleEditQuestion(index)}
                        className="edit-question-btn"
                        disabled={editingQuestionIndex === index}
                      >
                        {editingQuestionIndex === index ? 'Editing...' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleRemoveQuestion(index)}
                        className="remove-question-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="question-text">{q.question}</p>
                  <div className="options-preview">
                    {q.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`option-preview ${optIndex === q.correctAnswer ? 'correct' : ''}`}
                      >
                        <span className="option-letter">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span>{option}</span>
                        {optIndex === q.correctAnswer && (
                          <span className="correct-indicator">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          {isEditing ? (
            <>
              <Button onClick={handleCancelEdit} variant="secondary">
                Cancel Edit
              </Button>
              <Button
                onClick={handleUpdateQuiz}
                disabled={!createQuizForm.name.trim() || !createQuizForm.description.trim() || createQuizForm.questions.length === 0}
                variant="primary"
              >
                Update Quiz
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setCreateQuizForm({
                    name: '',
                    description: '',
                    level: 'Beginner',
                    time: 15,
                    category: '',
                    questions: []
                  })
                  setCurrentQuestion({
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                    explanation: ''
                  })
                }}
                variant="secondary"
              >
                Reset Form
              </Button>
              <Button
                onClick={handleCreateQuiz}
                disabled={!createQuizForm.name.trim() || !createQuizForm.description.trim() || createQuizForm.questions.length === 0}
                variant="primary"
              >
                Create Quiz
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )

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
          <Button
            onClick={() => setActiveTab('create')}
            variant={activeTab === 'create' ? 'primary' : 'secondary'}
          >
            Create Quiz
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab !== 'create' && (
          <>
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
                    
                    <div className="event-actions">
                      {activeTab !== 'my' && (
                        <Button 
                          className="participate-btn"
                          onClick={() => handleParticipate(quiz)}
                          variant="secondary"
                        >
                          Participate
                        </Button>
                      )}
                      
                      {quiz.isMyQuiz && (
                        <Button 
                          className="edit-quiz-btn"
                          onClick={() => handleEditQuiz(quiz)}
                          variant="primary"
                        >
                          Edit Quiz
                        </Button>
                      )}
                    </div>
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
          </>
        )}

        {activeTab === 'create' && renderCreateQuizContent()}

        {/* Quiz Participation Modal */}
        {showQuizModal && selectedQuiz && (
          <div className="quiz-modal-overlay" onClick={!isQuizStarted ? closeModal : undefined}>
            <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
              {!isQuizStarted ? (
                // Quiz Instructions Modal
                <>
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
                </>
              ) : (
                // Quiz Interface
                <>
                  <div className="quiz-modal-header">
                    <h2>{selectedQuiz.name}</h2>
                    {!isQuizCompleted && !showReview && (
                      <div className="quiz-progress">
                        <span className="question-counter">
                          Question {currentQuestionIndex + 1} of {sampleQuestions.length}
                        </span>
                        <span className="quiz-timer">
                          Time: {formatTime(timeRemaining)}
                        </span>
                      </div>
                    )}
                    {(isQuizCompleted || showReview) && (
                      <div className="quiz-progress">
                        <span className="review-mode">
                          {showReview ? 'Review Mode' : 'Quiz Completed'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="quiz-modal-body">
                    {!isQuizCompleted ? (
                      <div className="quiz-question-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${((currentQuestionIndex + 1) / sampleQuestions.length) * 100}%` }}
                          ></div>
                        </div>

                        <div className="question-section">
                          <h3 className="question-text">
                            {sampleQuestions[currentQuestionIndex].question}
                          </h3>

                          <div className="options-container">
                            {sampleQuestions[currentQuestionIndex].options.map((option, index) => (
                              <button
                                key={index}
                                className={`option-button ${
                                  selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''
                                }`}
                                onClick={() => handleAnswerSelect(index)}
                              >
                                <span className="option-letter">
                                  {String.fromCharCode(65 + index)}
                                </span>
                                <span className="option-text">{option}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="quiz-navigation">
                          <Button 
                            variant="secondary" 
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                          >
                            Previous
                          </Button>
                          
                          <Button 
                            variant="primary" 
                            onClick={handleNextQuestion}
                            disabled={selectedAnswers[currentQuestionIndex] === -1}
                          >
                            {currentQuestionIndex === sampleQuestions.length - 1 ? 'Submit Quiz' : 'Next'}
                          </Button>
                        </div>
                      </div>
                    ) : showReview ? (
                      // Quiz Review Section
                      <div className="quiz-review">
                        <div className="review-header">
                          <h3>Quiz Review</h3>
                          <p>Review all questions with correct answers and explanations</p>
                        </div>

                        <div className="review-questions">
                          {sampleQuestions.map((question, index) => {
                            const userAnswer = selectedAnswers[index]
                            const isCorrect = userAnswer === question.correctAnswer
                            
                            return (
                              <div key={question.id} className="review-question">
                                <div className="review-question-header">
                                  <div className="question-number">
                                    Question {index + 1}
                                  </div>
                                  <div className={`question-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                                    {isCorrect ? (
                                      <>
                                        <svg className="result-icon" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                        </svg>
                                        Correct
                                      </>
                                    ) : (
                                      <>
                                        <svg className="result-icon" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                        </svg>
                                        Incorrect
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="review-question-content">
                                  <h4 className="question-text">{question.question}</h4>

                                  <div className="review-options">
                                    {question.options.map((option, optionIndex) => {
                                      const isUserSelected = userAnswer === optionIndex
                                      const isCorrectAnswer = question.correctAnswer === optionIndex
                                      
                                      let optionClass = 'review-option'
                                      if (isCorrectAnswer) {
                                        optionClass += ' correct-answer'
                                      } else if (isUserSelected && !isCorrectAnswer) {
                                        optionClass += ' user-wrong-answer'
                                      } else if (isUserSelected) {
                                        optionClass += ' user-selected'
                                      }

                                      return (
                                        <div key={optionIndex} className={optionClass}>
                                          <span className="option-letter">
                                            {String.fromCharCode(65 + optionIndex)}
                                          </span>
                                          <span className="option-text">{option}</span>
                                          <div className="option-indicators">
                                            {isCorrectAnswer && (
                                              <span className="correct-indicator">
                                                <svg className="indicator-icon" fill="currentColor" viewBox="0 0 24 24">
                                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                                </svg>
                                                Correct Answer
                                              </span>
                                            )}
                                            {isUserSelected && !isCorrectAnswer && (
                                              <span className="user-indicator">
                                                Your Answer
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>

                                  {question.explanation && (
                                    <div className="explanation-section">
                                      <h5>Explanation:</h5>
                                      <p>{question.explanation}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <div className="review-actions">
                          <Button variant="secondary" onClick={handleBackToResults}>
                            Back to Results
                          </Button>
                          <Button variant="primary" onClick={closeModal}>
                            Close Quiz
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Quiz Results
                      <div className="quiz-results">
                        <div className="results-header">
                          <h3>Quiz Completed!</h3>
                          <div className={`final-score ${getScoreColor(score, sampleQuestions.length)}`}>
                            {score} / {sampleQuestions.length}
                          </div>
                          <div className="score-percentage">
                            {Math.round((score / sampleQuestions.length) * 100)}%
                          </div>
                        </div>

                        <div className="results-summary">
                          <div className="summary-item">
                            <span>Correct Answers:</span>
                            <span className="text-green-400">{score}</span>
                          </div>
                          <div className="summary-item">
                            <span>Incorrect Answers:</span>
                            <span className="text-red-400">{sampleQuestions.length - score}</span>
                          </div>
                          <div className="summary-item">
                            <span>Total Questions:</span>
                            <span>{sampleQuestions.length}</span>
                          </div>
                        </div>

                        <div className="results-actions">
                          <Button variant="secondary" onClick={closeModal}>
                            Close
                          </Button>
                          <Button variant="primary" onClick={handleShowReview}>
                            Review Questions
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
  
  )
}

export default Quizzes




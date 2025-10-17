import { useState, useEffect, useCallback } from 'react'
import '../../styles/pages/enthusiast/Quizzes.scss'
import '../../styles/pages/enthusiast/Leaderboard.scss'
import Button from '../../components/Button'
import TimeIcon from '../../assets/svg/TimeIcon'
import QuestionIcon from '../../assets/svg/QuestionIcon'
import ParticipantsIcon from '../../assets/svg/ParticipantsIcon'
import * as quizService from '../../services/quizService'
import { useToast } from '../../contexts/ToastContext'
import { getErrorMessage } from '../../utils/errorHandler'

type TabType = 'my' | 'create' | 'leaderboard'

const Quizzes = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  const [activeTab, setActiveTab] = useState<TabType>('my')
  const [myQuizzes, setMyQuizzes] = useState<quizService.Quiz[]>([])
  const [leaderboard, setLeaderboard] = useState<quizService.LeaderboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Quiz taking state
  const [selectedQuiz, setSelectedQuiz] = useState<quizService.Quiz | null>(null)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: string }>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [quizResult, setQuizResult] = useState<quizService.QuizResult | null>(null)
  const [showReview, setShowReview] = useState(false)

  // Quiz creation/editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null)
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null)
  
  const [createQuizForm, setCreateQuizForm] = useState<quizService.CreateQuizData>({
    title: '',
    description: '',
    level: 'Beginner',
    time_limit: 15,
    category: '',
    questions: []
  })
  
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    answers: ['', '', '', ''],
    correct_answer: '',
    question_explanation: ''
  })

  // Fetch data based on active tab
  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      if (activeTab === 'my') {
        const quizzes = await quizService.getMyQuizzes()
        setMyQuizzes(quizzes)
      } else if (activeTab === 'leaderboard') {
        const data = await quizService.getQuizLeaderboard()
        setLeaderboard(data)
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Unable to load data. Please try again.')
      setError(errorMessage)
      showError(errorMessage)
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Timer effect
  useEffect(() => {
    if (isQuizStarted && timeRemaining > 0 && !isQuizCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && isQuizStarted && !isQuizCompleted) {
      handleQuizSubmit()
    }
  }, [timeRemaining, isQuizStarted, isQuizCompleted])

  const handleParticipate = async (quiz: quizService.Quiz) => {
    try {
      // Check if already participated
      if (quiz.hasParticipated) {
        showWarning('You have already completed this quiz!')
        return
      }
      
      const quizData = await quizService.startQuiz(quiz.id)
      setSelectedQuiz(quizData)
      setShowQuizModal(true)
    } catch (err: any) {
      showError(getErrorMessage(err, 'Unable to start quiz. Please try again.'))
    }
  }

  const handleStartQuiz = () => {
    if (selectedQuiz) {
      setIsQuizStarted(true)
      setTimeRemaining(selectedQuiz.time_limit * 60)
      setCurrentQuestionIndex(0)
      setSelectedAnswers({})
      setIsQuizCompleted(false)
      setQuizResult(null)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    if (selectedQuiz) {
      const questionId = selectedQuiz.questions[currentQuestionIndex].id
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }))
    }
  }

  const handleNextQuestion = () => {
    if (selectedQuiz && currentQuestionIndex < selectedQuiz.questions.length - 1) {
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

  const handleQuizSubmit = useCallback(async () => {
    if (!selectedQuiz) return

    try {
      const answers = selectedQuiz.questions.map(q => ({
        question_id: q.id,
        selected_answer: selectedAnswers[q.id] || ''
      }))

      const result = await quizService.submitQuizAnswers(selectedQuiz.id, { answers })
      setQuizResult(result)
      setIsQuizCompleted(true)
      
      // Refresh quiz lists if on my quizzes tab
      if (activeTab === 'my') {
        const quizzes = await quizService.getMyQuizzes()
        setMyQuizzes(quizzes)
      }
    } catch (err: any) {
      showError(getErrorMessage(err, 'Unable to submit quiz answers. Please try again.'))
    }
  }, [selectedQuiz, selectedAnswers, activeTab, showError])

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
    setSelectedAnswers({})
    setTimeRemaining(0)
    setIsQuizCompleted(false)
    setQuizResult(null)
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

  // Quiz CRUD operations
  const handleCreateQuiz = async () => {
    if (createQuizForm.questions.length === 0) {
      showWarning('Please add at least one question to create a quiz')
      return
    }

    try {
      setLoading(true)
      await quizService.createQuiz(createQuizForm)
      
      // Reset form
      setCreateQuizForm({
        title: '',
        description: '',
        level: 'Beginner',
        time_limit: 15,
        category: '',
        questions: []
      })
      setCurrentQuestion({
        question: '',
        answers: ['', '', '', ''],
        correct_answer: '',
        question_explanation: ''
      })
      
      showSuccess('Quiz created successfully!')
      showInfo('Your quiz has been submitted for approval and will appear once reviewed by an admin.')
      setActiveTab('my')
    } catch (err: any) {
      showError(getErrorMessage(err, 'Unable to create quiz. Please check your inputs and try again.'))
    } finally {
      setLoading(false)
    }
  }

  const handleEditQuiz = (quiz: quizService.Quiz) => {
    setCreateQuizForm({
      title: quiz.name,
      description: quiz.description,
      level: quiz.level,
      time_limit: quiz.time_limit,
      category: quiz.category,
      questions: quiz.questions.map(q => ({
        question: q.question,
        answers: q.answers,
        correct_answer: q.correct_answer || '',
        question_explanation: q.question_explanation || ''
      }))
    })
    setIsEditing(true)
    setEditingQuizId(quiz.id)
    setActiveTab('create')
  }

  const handleUpdateQuiz = async () => {
    if (!editingQuizId) return

    if (createQuizForm.questions.length === 0) {
      showWarning('Please add at least one question to update the quiz')
      return
    }

    try {
      setLoading(true)
      await quizService.updateQuiz(editingQuizId, createQuizForm)
      
      // Reset form
      setCreateQuizForm({
        title: '',
        description: '',
        level: 'Beginner',
        time_limit: 15,
        category: '',
        questions: []
      })
      setCurrentQuestion({
        question: '',
        answers: ['', '', '', ''],
        correct_answer: '',
        question_explanation: ''
      })
      setIsEditing(false)
      setEditingQuizId(null)
      
      showSuccess('Quiz updated successfully!')
      setActiveTab('my')
    } catch (err: any) {
      showError(getErrorMessage(err, 'Unable to update quiz. Please check your inputs and try again.'))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return
    }

    try {
      setLoading(true)
      await quizService.deleteQuiz(quizId)
      showSuccess('Quiz deleted successfully!')
      
      // Refresh my quizzes
      const quizzes = await quizService.getMyQuizzes()
      setMyQuizzes(quizzes)
    } catch (err: any) {
      showError(getErrorMessage(err, 'Unable to delete quiz. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setCreateQuizForm({
      title: '',
      description: '',
      level: 'Beginner',
      time_limit: 15,
      category: '',
      questions: []
    })
    setCurrentQuestion({
      question: '',
      answers: ['', '', '', ''],
      correct_answer: '',
      question_explanation: ''
    })
    setIsEditing(false)
    setEditingQuizId(null)
    setActiveTab('my')
  }

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim() || !currentQuestion.answers.every(opt => opt.trim())) {
      showWarning('Please fill in all question fields')
      return
    }

    if (!currentQuestion.correct_answer.trim()) {
      showWarning('Please select a correct answer')
      return
    }

    if (!currentQuestion.answers.includes(currentQuestion.correct_answer)) {
      showWarning('Correct answer must be one of the answer options')
      return
    }

    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...createQuizForm.questions]
      updatedQuestions[editingQuestionIndex] = currentQuestion
      setCreateQuizForm(prev => ({
        ...prev,
        questions: updatedQuestions
      }))
      setEditingQuestionIndex(null)
      showSuccess('Question updated successfully!')
    } else {
      // Add new question
      setCreateQuizForm(prev => ({
        ...prev,
        questions: [...prev.questions, currentQuestion]
      }))
      showSuccess('Question added successfully!')
    }

    // Reset current question
    setCurrentQuestion({
      question: '',
      answers: ['', '', '', ''],
      correct_answer: '',
      question_explanation: ''
    })
  }

  const handleRemoveQuestion = (index: number) => {
    setCreateQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))

    if (editingQuestionIndex === index) {
      setEditingQuestionIndex(null)
      setCurrentQuestion({
        question: '',
        answers: ['', '', '', ''],
        correct_answer: '',
        question_explanation: ''
      })
    }
  }

  const handleEditQuestion = (index: number) => {
    const questionToEdit = createQuizForm.questions[index]
    setCurrentQuestion({
      question: questionToEdit.question,
      answers: [...questionToEdit.answers],
      correct_answer: questionToEdit.correct_answer,
      question_explanation: questionToEdit.question_explanation || ''
    })
    setEditingQuestionIndex(index)
  }

  const handleCancelQuestionEdit = () => {
    setEditingQuestionIndex(null)
    setCurrentQuestion({
      question: '',
      answers: ['', '', '', ''],
      correct_answer: '',
      question_explanation: ''
    })
  }

  const renderCreateQuizContent = () => (
    <div className="create-quiz-section">
      <h2 className="text-2xl font-bold text-white mb-6">
        {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
      </h2>

      <div className="quiz-form">
        {/* Basic Info */}
        <div className="form-section">
          <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
          
          <div className="form-group">
            <label>Quiz Title *</label>
            <input
              type="text"
              value={createQuizForm.title}
              onChange={(e) => setCreateQuizForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter quiz title"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={createQuizForm.description}
              onChange={(e) => setCreateQuizForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter quiz description"
              className="form-input"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                value={createQuizForm.category}
                onChange={(e) => setCreateQuizForm(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Astronomy, Space Science"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Difficulty Level *</label>
              <select
                value={createQuizForm.level}
                onChange={(e) => setCreateQuizForm(prev => ({ ...prev, level: e.target.value as any }))}
                className="form-input"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label>Time Limit (minutes) *</label>
              <input
                type="number"
                value={createQuizForm.time_limit}
                onChange={(e) => setCreateQuizForm(prev => ({ ...prev, time_limit: parseInt(e.target.value) || 15 }))}
                min="5"
                max="180"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="form-section">
          <h3 className="text-xl font-semibold text-white mb-4">Questions</h3>
          
          {/* Question Input */}
          <div className="question-input-section">
            <div className="form-group">
              <label>Question {editingQuestionIndex !== null ? `(Editing #${editingQuestionIndex + 1})` : `(New)`}</label>
              <input
                type="text"
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter your question"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Answer Options *</label>
              {currentQuestion.answers.map((answer, index) => (
                <input
                  key={index}
                  type="text"
                  value={answer}
                  onChange={(e) => {
                    const newAnswers = [...currentQuestion.answers]
                    newAnswers[index] = e.target.value
                    setCurrentQuestion(prev => ({ ...prev, answers: newAnswers }))
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="form-input mb-2"
                />
              ))}
            </div>

            <div className="form-group">
              <label>Correct Answer *</label>
              <select
                value={currentQuestion.correct_answer}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correct_answer: e.target.value }))}
                className="form-input"
              >
                <option value="">Select correct answer</option>
                {currentQuestion.answers.filter(a => a.trim()).map((answer, index) => (
                  <option key={index} value={answer}>{answer}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Explanation (Optional)</label>
              <textarea
                value={currentQuestion.question_explanation}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question_explanation: e.target.value }))}
                placeholder="Explain why this answer is correct"
                className="form-input"
                rows={2}
              />
            </div>

            <div className="button-group">
              <Button
                onClick={handleAddQuestion}
                
              >
                {editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}
              </Button>
              {editingQuestionIndex !== null && (
                <Button
                  onClick={handleCancelQuestionEdit}
                  
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </div>

          {/* Questions List */}
          {createQuizForm.questions.length > 0 && (
            <div className="questions-list mt-6">
              <h4 className="text-lg font-semibold text-white mb-3">
                Added Questions ({createQuizForm.questions.length})
              </h4>
              {createQuizForm.questions.map((q, index) => (
                <div key={index} className="question-item">
                  <div className="question-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className="question-text">{q.question}</span>
                  </div>
                  <div className="question-answers">
                    {q.answers.map((answer, aIndex) => (
                      <div
                        key={aIndex}
                        className={`answer-option ${answer === q.correct_answer ? 'correct' : ''}`}
                      >
                        {answer}
                        {answer === q.correct_answer && <span className="ml-2">✓</span>}
                      </div>
                    ))}
                  </div>
                  <div className="question-actions">
                    <Button
                      onClick={() => handleEditQuestion(index)}
                      
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleRemoveQuestion(index)}
                      
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="form-actions">
          <Button
            onClick={isEditing ? handleUpdateQuiz : handleCreateQuiz}
            
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Quiz' : 'Create Quiz')}
          </Button>
          <Button
            onClick={handleCancelEdit}
           
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )

  const renderLeaderboardContent = () => {
    if (!leaderboard) return null

    return (
      <div className="leaderboard-section">
        <h2 className="text-2xl font-bold text-white mb-6">Global Leaderboard</h2>

        {/* Stats */}
        <div className="stats-grid mb-8">
          <div className="stat-card">
            <div className="stat-value">{leaderboard.stats.totalParticipants}</div>
            <div className="stat-label">Total Participants</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{leaderboard.stats.totalQuizAttempts}</div>
            <div className="stat-label">Total Quiz Attempts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{leaderboard.stats.averageScore}%</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{leaderboard.stats.highestScore}%</div>
            <div className="stat-label">Highest Score</div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="leaderboard-table">
          <div className="table-header">
            <div className="col-rank">Rank</div>
            <div className="col-user">User</div>
            <div className="col-score">Total Score</div>
            <div className="col-completed">Quizzes</div>
            <div className="col-average">Avg Score</div>
          </div>
          {leaderboard.leaderboard.map((entry) => (
            <div
              key={entry.user_id}
              className={`table-row ${leaderboard.userRank?.entry.user_id === entry.user_id ? 'highlighted' : ''}`}
            >
              <div className="col-rank">
                <span className={`rank-badge rank-${entry.rank <= 3 ? entry.rank : 'other'}`}>
                  #{entry.rank}
                </span>
              </div>
              <div className="col-user">
                <div className="user-info">
                  <div className="user-name">
                    {entry.display_name || entry.username}
                    {leaderboard.userRank?.entry.user_id === entry.user_id && (
                      <span className="ml-2 text-yellow-400">(You)</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-score">{entry.total_score}</div>
              <div className="col-completed">{entry.quizzes_completed}</div>
              <div className="col-average">{entry.average_score}%</div>
            </div>
          ))}
        </div>

        {leaderboard.userRank && (
          <div className="your-rank-card mt-6">
            <h3 className="text-lg font-semibold text-white mb-2">Your Rank</h3>
            <p className="text-gray-300">
              You are ranked #{leaderboard.userRank.rank} with {leaderboard.userRank.entry.total_score} points
              across {leaderboard.userRank.entry.quizzes_completed} quizzes.
            </p>
          </div>
        )}
      </div>
    )
  }

  const renderQuizCard = (quiz: quizService.Quiz, isMyQuiz: boolean = false) => (
    <div key={quiz.id} className="quiz-card">
      <div className="card-content">
        <div className="card-header">
          <h3 className="quiz-title">{quiz.name}</h3>
          <span className={`level-badge ${quiz.level.toLowerCase()}`}>
            {quiz.level}
          </span>
        </div>
        
        {isMyQuiz && (
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: quiz.status === 'pending' ? 'rgba(251, 191, 36, 0.2)' : 
                         quiz.status === 'approved' ? 'rgba(34, 197, 94, 0.2)' : 
                         quiz.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 
                         'rgba(107, 114, 128, 0.2)',
              color: quiz.status === 'pending' ? '#fbbf24' : 
                    quiz.status === 'approved' ? '#22c55e' : 
                    quiz.status === 'rejected' ? '#ef4444' : 
                    '#9ca3af',
              border: quiz.status === 'pending' ? '1px solid rgba(251, 191, 36, 0.3)' : 
                     quiz.status === 'approved' ? '1px solid rgba(34, 197, 94, 0.3)' : 
                     quiz.status === 'rejected' ? '1px solid rgba(239, 68, 68, 0.3)' : 
                     '1px solid rgba(107, 114, 128, 0.3)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              {quiz.status}
            </span>
          </div>
        )}
        
        <p className="quiz-description">{quiz.description}</p>
        
        <div className="quiz-stats">
          <div className="stat-item">
            <TimeIcon className="stat-icon" size={16} />
            <span>{quiz.time_limit} min</span>
          </div>
          
          <div className="stat-item">
            <QuestionIcon className="stat-icon" size={16} />
            <span>{quiz.question_count} questions</span>
          </div>
          
          <div className="stat-item">
            <ParticipantsIcon className="stat-icon" size={16} />
            <span>{quiz.participants_count} participants</span>
          </div>
        </div>
        
        <div className="event-actions">
          {!isMyQuiz ? (
            <Button
              onClick={() => handleParticipate(quiz)}
              variant="primary"
              size="small"
              disabled={quiz.hasParticipated}
            >
              {quiz.hasParticipated ? 'Completed' : 'Take Quiz'}
            </Button>
          ) : (
            <>
              {quiz.status === 'pending' && (
                <span style={{ color: '#fbbf24', fontSize: '0.875rem', marginRight: '0.5rem' }}>
                  Awaiting Approval
                </span>
              )}
              {quiz.status === 'rejected' && (
                <span style={{ color: '#ef4444', fontSize: '0.875rem', marginRight: '0.5rem' }}>
                  Rejected
                </span>
              )}
              <Button
                onClick={() => handleEditQuiz(quiz)}
                variant="secondary"
                size="small"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteQuiz(quiz.id)}
                variant="secondary"
                size="small"
              >
                Delete
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
        <Button
          onClick={() => setActiveTab('leaderboard')}
          variant={activeTab === 'leaderboard' ? 'primary' : 'secondary'}
        >
          Leaderboard
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab !== 'create' && activeTab !== 'leaderboard' && (
        <>
          {/* Section Title */}
          <div className="section-header">
            <h2 className="section-title">
              My Created Quizzes
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="loading-message">
              Loading...
            </div>
          )}

          {/* Quiz Cards Grid */}
          {!loading && (
            <>
              <div className="quiz-grid">
                {myQuizzes.map((quiz) => 
                  renderQuizCard(quiz, true)
                )}
              </div>

              {myQuizzes.length === 0 && (
                <div className="empty-state">
                  <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="empty-title">No quizzes found</h3>
                  <p className="empty-text">
                    You haven't created any quizzes yet.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab === 'create' && renderCreateQuizContent()}

      {activeTab === 'leaderboard' && (
        <>
          {/* Section Title */}
          <div className="section-header">
            <h2 className="section-title">Quiz Champions</h2>
          </div>
          {!loading && renderLeaderboardContent()}
          {loading && (
            <div className="loading-message">
              Loading...
            </div>
          )}
        </>
      )}

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
                    <p><strong>Questions:</strong> {selectedQuiz.question_count}</p>
                    <p><strong>Time Limit:</strong> {selectedQuiz.time_limit} minutes</p>
                    <p><strong>Difficulty:</strong> {selectedQuiz.level}</p>
                    <p><strong>Category:</strong> {selectedQuiz.category}</p>
                  </div>

                  <div className="quiz-instructions">
                    <h3>Quiz Instructions</h3>
                    <ul>
                      <li>Read each question carefully before selecting your answer</li>
                      <li>You can navigate back to previous questions using the Previous button</li>
                      <li>Your quiz will be automatically submitted when time runs out</li>
                      <li>Make sure to review your answers before final submission</li>
                      <li>Click "Submit" on the last question to finish the quiz</li>
                    </ul>
                  </div>

                  <div className="quiz-actions">
                    <Button onClick={handleStartQuiz} variant="primary">
                      Start Quiz
                    </Button>
                    <Button onClick={closeModal} variant="secondary">
                      Cancel
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
                      <div className="question-progress">
                        Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                      </div>
                      <div className={`quiz-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                        ⏱ {formatTime(timeRemaining)}
                      </div>
                    </div>
                  )}
                  {(isQuizCompleted || showReview) && (
                    <button className="close-button" onClick={closeModal}>
                      ×
                    </button>
                  )}
                </div>

                <div className="quiz-modal-body">
                  {!isQuizCompleted ? (
                    <div className="quiz-question-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
                        />
                      </div>

                      <div className="question-section">
                        <p className="question-text">
                          {selectedQuiz.questions[currentQuestionIndex].question}
                        </p>

                        <div className="options-container">
                          {selectedQuiz.questions[currentQuestionIndex].answers.map((answer, index) => (
                            <button
                              key={index}
                              className={`option-button ${
                                selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === answer
                                  ? 'selected'
                                  : ''
                              }`}
                              onClick={() => handleAnswerSelect(answer)}
                            >
                              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                              <span className="option-text">{answer}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="quiz-navigation">
                        <Button
                          onClick={handlePreviousQuestion}
                          disabled={currentQuestionIndex === 0}
                          variant="secondary"
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={handleNextQuestion}
                          variant="primary"
                        >
                          {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Submit' : 'Next'}
                        </Button>
                      </div>
                    </div>
                  ) : showReview ? (
                    <div className="quiz-review">
                      <div className="review-header">
                        <h3>Answer Review</h3>
                        <p>Review your answers and learn from explanations</p>
                      </div>

                      <div className="review-questions">
                        {quizResult!.answers.map((answer, index) => (
                          <div key={index} className="review-question">
                            <div className="review-question-header">
                              <span className="question-number">Question {index + 1}</span>
                              <span className={`question-result ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                                <span className="result-icon">{answer.is_correct ? '✓' : '✗'}</span>
                                {answer.is_correct ? 'Correct' : 'Incorrect'}
                              </span>
                            </div>

                            <div className="review-question-content">
                              <p className="question-text">{answer.question}</p>
                            </div>

                            <div className="review-options">
                              {selectedQuiz.questions[index].answers.map((opt, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`review-option ${
                                    opt === answer.correct_answer ? 'correct-answer' : ''
                                  } ${
                                    opt === answer.selected_answer && !answer.is_correct ? 'user-wrong-answer' : ''
                                  } ${
                                    opt === answer.selected_answer && answer.is_correct ? 'user-selected' : ''
                                  }`}
                                >
                                  <span className="option-letter">{String.fromCharCode(65 + optIndex)}</span>
                                  <span className="option-text">{opt}</span>
                                  <div className="option-indicators">
                                    {opt === answer.correct_answer && (
                                      <span className="correct-indicator">
                                        <svg className="indicator-icon" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Correct
                                      </span>
                                    )}
                                    {opt === answer.selected_answer && opt !== answer.correct_answer && (
                                      <span className="user-indicator">Your Answer</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {answer.explanation && (
                              <div className="explanation-section">
                                <h5>Explanation</h5>
                                <p>{answer.explanation}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="review-actions">
                        <Button onClick={handleBackToResults} variant="secondary">
                          Back to Results
                        </Button>
                        <Button onClick={closeModal} variant="primary">
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="quiz-results">
                      <div className="results-header">
                        <h3>Quiz Completed!</h3>
                        <div className={`final-score ${getScoreColor(quizResult!.correct_answers, quizResult!.total_questions)}`}>
                          {quizResult!.percentage}%
                        </div>
                        <p className="score-percentage">
                          You got {quizResult!.correct_answers} out of {quizResult!.total_questions} questions correct!
                        </p>
                      </div>

                      <div className="results-summary">
                        <div className="summary-item">
                          <span>Total Questions:</span>
                          <strong>{quizResult!.total_questions}</strong>
                        </div>
                        <div className="summary-item">
                          <span>Correct Answers:</span>
                          <strong className="text-green-400">{quizResult!.correct_answers}</strong>
                        </div>
                        <div className="summary-item">
                          <span>Incorrect Answers:</span>
                          <strong className="text-red-400">{quizResult!.total_questions - quizResult!.correct_answers}</strong>
                        </div>
                        <div className="summary-item">
                          <span>Your Score:</span>
                          <strong>{quizResult!.percentage}%</strong>
                        </div>
                      </div>

                      <div className="results-actions">
                        <Button onClick={handleShowReview} variant="primary">
                          Review Answers
                        </Button>
                        <Button onClick={closeModal} variant="secondary">
                          Close
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

import { useState, useEffect, useCallback } from 'react'
import '../../styles/pages/enthusiast/Quizzes.scss'
import '../../styles/pages/enthusiast/Leaderboard.scss'
import Button from '../../components/Button'
import TimeIcon from '../../assets/svg/TimeIcon'
import QuestionIcon from '../../assets/svg/QuestionIcon'
import ParticipantsIcon from '../../assets/svg/ParticipantsIcon'
import * as quizService from '../../services/quizService'

type TabType = 'all' | 'my' | 'create' | 'leaderboard'

const Quizzes = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [allQuizzes, setAllQuizzes] = useState<quizService.Quiz[]>([])
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
      if (activeTab === 'all') {
        const quizzes = await quizService.getAllQuizzes()
        setAllQuizzes(quizzes)
      } else if (activeTab === 'my') {
        const quizzes = await quizService.getMyQuizzes()
        setMyQuizzes(quizzes)
      } else if (activeTab === 'leaderboard') {
        const data = await quizService.getQuizLeaderboard()
        setLeaderboard(data)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data')
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
        alert('You have already taken this quiz!')
        return
      }
      
      const quizData = await quizService.startQuiz(quiz.id)
      setSelectedQuiz(quizData)
      setShowQuizModal(true)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to start quiz')
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
      
      // Refresh quiz lists
      if (activeTab === 'all') {
        const quizzes = await quizService.getAllQuizzes()
        setAllQuizzes(quizzes)
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit quiz')
    }
  }, [selectedQuiz, selectedAnswers, activeTab])

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
      alert('Please add at least one question')
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
      
      alert('Quiz created successfully!')
      setActiveTab('my')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create quiz')
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
      alert('Please add at least one question')
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
      
      alert('Quiz updated successfully!')
      setActiveTab('my')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm('Are you sure you want to delete this quiz?')) {
      return
    }

    try {
      setLoading(true)
      await quizService.deleteQuiz(quizId)
      alert('Quiz deleted successfully!')
      
      // Refresh my quizzes
      const quizzes = await quizService.getMyQuizzes()
      setMyQuizzes(quizzes)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete quiz')
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
      alert('Please fill in all question fields')
      return
    }

    if (!currentQuestion.correct_answer.trim()) {
      alert('Please select a correct answer')
      return
    }

    if (!currentQuestion.answers.includes(currentQuestion.correct_answer)) {
      alert('Correct answer must be one of the answer options')
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
    } else {
      // Add new question
      setCreateQuizForm(prev => ({
        ...prev,
        questions: [...prev.questions, currentQuestion]
      }))
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
                className="btn-primary"
              >
                {editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}
              </Button>
              {editingQuestionIndex !== null && (
                <Button
                  onClick={handleCancelQuestionEdit}
                  className="btn-secondary"
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
                    <button
                      onClick={() => handleEditQuestion(index)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveQuestion(index)}
                      className="btn-delete"
                    >
                      Remove
                    </button>
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
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Quiz' : 'Create Quiz')}
          </Button>
          <Button
            onClick={handleCancelEdit}
            className="btn-secondary"
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
      <div className="quiz-header">
        <h3 className="quiz-title">{quiz.name}</h3>
        <span className={`difficulty-badge difficulty-${quiz.level.toLowerCase()}`}>
          {quiz.level}
        </span>
      </div>

      <p className="quiz-description">{quiz.description}</p>

      <div className="quiz-stats">
        <div className="stat">
          <TimeIcon />
          <span>{quiz.time_limit} min</span>
        </div>
        <div className="stat">
          <QuestionIcon />
          <span>{quiz.question_count} questions</span>
        </div>
        <div className="stat">
          <ParticipantsIcon />
          <span>{quiz.participants_count} participants</span>
        </div>
      </div>

      <div className="quiz-footer">
        <span className="quiz-category">{quiz.category}</span>
        {isMyQuiz ? (
          <div className="quiz-actions">
            <Button
              onClick={() => handleEditQuiz(quiz)}
              className="btn-edit-small"
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDeleteQuiz(quiz.id)}
              className="btn-delete-small"
            >
              Delete
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => handleParticipate(quiz)}
            className="btn-primary-small"
            disabled={quiz.hasParticipated}
          >
            {quiz.hasParticipated ? 'Completed' : 'Take Quiz'}
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="quizzes-container">
      <div className="quizzes-header">
        <h1 className="page-title">Quizzes</h1>
        <p className="page-description">Test your space knowledge and compete with others!</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Quizzes
        </button>
        <button
          className={`tab ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          My Quizzes
        </button>
        <button
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Quiz
        </button>
        <button
          className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && activeTab !== 'create' && (
        <div className="loading-message">
          Loading...
        </div>
      )}

      {/* All Quizzes Tab */}
      {activeTab === 'all' && !loading && (
        <div className="quizzes-grid">
          {allQuizzes.length === 0 ? (
            <p className="text-gray-400">No quizzes available at the moment.</p>
          ) : (
            allQuizzes.map(quiz => renderQuizCard(quiz, false))
          )}
        </div>
      )}

      {/* My Quizzes Tab */}
      {activeTab === 'my' && !loading && (
        <div className="quizzes-grid">
          {myQuizzes.length === 0 ? (
            <p className="text-gray-400">You haven't created any quizzes yet.</p>
          ) : (
            myQuizzes.map(quiz => renderQuizCard(quiz, true))
          )}
        </div>
      )}

      {/* Create Quiz Tab */}
      {activeTab === 'create' && renderCreateQuizContent()}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && !loading && renderLeaderboardContent()}

      {/* Quiz Taking Modal */}
      {showQuizModal && selectedQuiz && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content quiz-modal" onClick={(e) => e.stopPropagation()}>
            {!isQuizStarted ? (
              // Quiz Introduction
              <div className="quiz-intro">
                <h2 className="text-2xl font-bold text-white mb-4">{selectedQuiz.name}</h2>
                <p className="text-gray-300 mb-6">{selectedQuiz.description}</p>

                <div className="quiz-details">
                  <div className="detail-item">
                    <strong>Questions:</strong> {selectedQuiz.question_count}
                  </div>
                  <div className="detail-item">
                    <strong>Time Limit:</strong> {selectedQuiz.time_limit} minutes
                  </div>
                  <div className="detail-item">
                    <strong>Difficulty:</strong> {selectedQuiz.level}
                  </div>
                </div>

                <div className="modal-actions mt-6">
                  <Button onClick={handleStartQuiz} className="btn-primary">
                    Start Quiz
                  </Button>
                  <Button onClick={closeModal} className="btn-secondary">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : !isQuizCompleted ? (
              // Quiz Questions
              <div className="quiz-taking">
                <div className="quiz-header-info">
                  <div className="question-progress">
                    Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                  </div>
                  <div className={`timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                    ⏱ {formatTime(timeRemaining)}
                  </div>
                </div>

                <div className="question-section">
                  <h3 className="question-text">
                    {selectedQuiz.questions[currentQuestionIndex].question}
                  </h3>

                  <div className="answers-grid">
                    {selectedQuiz.questions[currentQuestionIndex].answers.map((answer, index) => (
                      <button
                        key={index}
                        className={`answer-option ${
                          selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === answer
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() => handleAnswerSelect(answer)}
                      >
                        {answer}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="quiz-navigation">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="btn-secondary"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    className="btn-primary"
                  >
                    {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Submit' : 'Next'}
                  </Button>
                </div>
              </div>
            ) : !showReview ? (
              // Quiz Results
              <div className="quiz-results">
                <h2 className="text-2xl font-bold text-white mb-4">Quiz Completed!</h2>

                <div className="results-summary">
                  <div className={`score-display ${getScoreColor(quizResult!.correct_answers, quizResult!.total_questions)}`}>
                    {quizResult!.percentage}%
                  </div>
                  <p className="text-gray-300 text-lg mb-4">
                    You got {quizResult!.correct_answers} out of {quizResult!.total_questions} questions correct!
                  </p>
                </div>

                <div className="modal-actions">
                  <Button onClick={handleShowReview} className="btn-primary">
                    Review Answers
                  </Button>
                  <Button onClick={closeModal} className="btn-secondary">
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              // Answer Review
              <div className="quiz-review">
                <h2 className="text-2xl font-bold text-white mb-4">Answer Review</h2>

                <div className="review-list">
                  {quizResult!.answers.map((answer, index) => (
                    <div key={index} className={`review-item ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                      <div className="review-header">
                        <span className="question-number">Question {index + 1}</span>
                        <span className={`result-badge ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                          {answer.is_correct ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                      <p className="review-question">{answer.question}</p>
                      <div className="review-answers">
                        <div className="your-answer">
                          <strong>Your answer:</strong> {answer.selected_answer || 'No answer'}
                        </div>
                        {!answer.is_correct && (
                          <div className="correct-answer">
                            <strong>Correct answer:</strong> {answer.correct_answer}
                          </div>
                        )}
                        {answer.explanation && (
                          <div className="explanation">
                            <strong>Explanation:</strong> {answer.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="modal-actions mt-6">
                  <Button onClick={handleBackToResults} className="btn-secondary">
                    Back to Results
                  </Button>
                  <Button onClick={closeModal} className="btn-primary">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Quizzes

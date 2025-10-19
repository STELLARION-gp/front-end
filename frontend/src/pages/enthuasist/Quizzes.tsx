import { useState, useEffect, useCallback } from 'react'
import '../../styles/pages/enthusiast/Quizzes.scss'
import '../../styles/pages/enthusiast/Leaderboard.scss'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/ConfirmDialog'
import TimeIcon from '../../assets/svg/TimeIcon'
import QuestionIcon from '../../assets/svg/QuestionIcon'
import ParticipantsIcon from '../../assets/svg/ParticipantsIcon'
import * as quizService from '../../services/quizService'
import { useToast } from '../../contexts/ToastContext'
import { getErrorMessage } from '../../utils/errorHandler'

type TabType = 'my' | 'create' | 'analytics'

const Quizzes = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  const [activeTab, setActiveTab] = useState<TabType>('my')
  const [myQuizzes, setMyQuizzes] = useState<quizService.Quiz[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
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

  // Delete confirmation dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<{ id: number; name: string } | null>(null)

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
      } else if (activeTab === 'analytics') {
        const quizzes = await quizService.getMyQuizzes()
        // Calculate analytics from quizzes
        const totalQuizzes = quizzes.length
        const approvedQuizzes = quizzes.filter(q => q.status === 'approved').length
        const pendingQuizzes = quizzes.filter(q => q.status === 'pending').length
        const rejectedQuizzes = quizzes.filter(q => q.status === 'rejected').length
        const totalParticipants = quizzes.reduce((sum, q) => sum + (q.participants_count || 0), 0)
        const totalQuestions = quizzes.reduce((sum, q) => sum + (q.question_count || 0), 0)
        const avgQuestionsPerQuiz = totalQuizzes > 0 ? (totalQuestions / totalQuizzes).toFixed(1) : 0
        const avgParticipantsPerQuiz = totalQuizzes > 0 ? (totalParticipants / totalQuizzes).toFixed(1) : 0
        
        setAnalytics({
          totalQuizzes,
          approvedQuizzes,
          pendingQuizzes,
          rejectedQuizzes,
          totalParticipants,
          totalQuestions,
          avgQuestionsPerQuiz,
          avgParticipantsPerQuiz,
          quizzes: quizzes.map(q => ({
            id: q.id,
            name: q.name,
            status: q.status,
            participants_count: q.participants_count || 0,
            question_count: q.question_count || 0,
            level: q.level,
            created_at: q.created_at
          }))
        })
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

  const handleDeleteQuiz = (quizId: number, quizName: string) => {
    setQuizToDelete({ id: quizId, name: quizName })
    setShowDeleteConfirm(true)
  }

  const confirmDeleteQuiz = async () => {
    if (!quizToDelete) return

    try {
      setLoading(true)
      await quizService.deleteQuiz(quizToDelete.id)
      
      // Close the dialog first
      setShowDeleteConfirm(false)
      setQuizToDelete(null)
      
      // Show success message
      showSuccess('Quiz deleted successfully!')
      
      // Refresh my quizzes
      const quizzes = await quizService.getMyQuizzes()
      setMyQuizzes(quizzes)
    } catch (err: any) {
      showError(getErrorMessage(err, 'Unable to delete quiz. Please try again.'))
      // Close dialog even on error
      setShowDeleteConfirm(false)
      setQuizToDelete(null)
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

  const renderAnalyticsContent = () => {
    if (!analytics) return null

    return (
      <div className="analytics-section">
        <h2 className="text-2xl font-bold text-white mb-6">Quiz Analytics</h2>

        {/* Overview Stats */}
        <div className="stats-grid mb-8">
          <div className="stat-card">
            <div className="stat-icon-wrapper total">
              <svg className="stat-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-value">{analytics.totalQuizzes}</div>
            <div className="stat-label">Total Quizzes</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper approved">
              <svg className="stat-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-value">{analytics.approvedQuizzes}</div>
            <div className="stat-label">Approved</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper pending">
              <svg className="stat-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-value">{analytics.pendingQuizzes}</div>
            <div className="stat-label">Pending Approval</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper rejected">
              <svg className="stat-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-value">{analytics.rejectedQuizzes}</div>
            <div className="stat-label">Rejected</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper participants">
              <svg className="stat-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div className="stat-value">{analytics.totalParticipants}</div>
            <div className="stat-label">Total Participants</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper questions">
              <svg className="stat-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-value">{analytics.totalQuestions}</div>
            <div className="stat-label">Total Questions</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper average">
              <svg className="stat-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div className="stat-value">{analytics.avgQuestionsPerQuiz}</div>
            <div className="stat-label">Avg Questions/Quiz</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper average">
              <svg className="stat-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
            <div className="stat-value">{analytics.avgParticipantsPerQuiz}</div>
            <div className="stat-label">Avg Participants/Quiz</div>
          </div>
        </div>

        {/* Quiz Performance Table */}
        <div className="analytics-table-section">
          <h3 className="text-xl font-semibold text-white mb-4">Quiz Performance</h3>
          <div className="analytics-table">
            <div className="table-header">
              <div className="col-name">Quiz Name</div>
              <div className="col-status">Status</div>
              <div className="col-level">Level</div>
              <div className="col-participants">Participants</div>
              <div className="col-questions">Questions</div>
              <div className="col-date">Created</div>
            </div>
            {analytics.quizzes.length > 0 ? (
              analytics.quizzes.map((quiz: any) => (
                <div key={quiz.id} className="table-row">
                  <div className="col-name">{quiz.name}</div>
                  <div className="col-status">
                    <span className={`status-badge status-${quiz.status}`}>
                      {quiz.status}
                    </span>
                  </div>
                  <div className="col-level">
                    <span className={`level-badge ${quiz.level.toLowerCase()}`}>
                      {quiz.level}
                    </span>
                  </div>
                  <div className="col-participants">{quiz.participants_count}</div>
                  <div className="col-questions">{quiz.question_count}</div>
                  <div className="col-date">
                    {new Date(quiz.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="table-empty">
                <p>No quizzes found. Create your first quiz to see analytics!</p>
              </div>
            )}
          </div>
        </div>
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
                onClick={() => handleDeleteQuiz(quiz.id, quiz.name)}
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
          onClick={() => {
            // Reset editing state when switching to create tab
            if (isEditing) {
              setIsEditing(false)
              setEditingQuizId(null)
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
              setEditingQuestionIndex(null)
            }
            setActiveTab('create')
          }}
          variant={activeTab === 'create' ? 'primary' : 'secondary'}
        >
          Create Quiz
        </Button>
        <Button
          onClick={() => setActiveTab('analytics')}
          variant={activeTab === 'analytics' ? 'primary' : 'secondary'}
        >
          Analytics
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab !== 'create' && activeTab !== 'analytics' && (
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

      {activeTab === 'analytics' && (
        <>
          {/* Section Title */}
          <div className="section-header">
            <h2 className="section-title">Quiz Analytics Dashboard</h2>
          </div>
          {!loading && renderAnalyticsContent()}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Quiz"
        message={
          quizToDelete
            ? `Are you sure you want to delete "${quizToDelete.name}"? This action cannot be undone and all quiz data will be permanently removed.`
            : 'Are you sure you want to delete this quiz?'
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDeleteQuiz}
        onCancel={() => {
          setShowDeleteConfirm(false)
          setQuizToDelete(null)
        }}
      />
    </div>
  )
}

export default Quizzes

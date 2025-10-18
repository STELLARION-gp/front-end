// components/Learner/QuizModal.tsx
import React, { useState, useEffect } from 'react';
import Button from '../Button';
import '../../styles/components/learner/QuizModal.scss';
import * as quizService from '../../services/quizService';
import { useToast } from '../../contexts/ToastContext';
import { getErrorMessage } from '../../utils/errorHandler';

interface Quiz {
  id: number;
  name: string;
  description: string;
  level: string;
  time_limit: number;
  question_count: number;
  participants_count: number;
  questions?: any[];
}

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose }) => {
  const { showSuccess, showError, showWarning } = useToast();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  // Load quiz questions when modal opens
  useEffect(() => {
    const loadQuizQuestions = async () => {
      try {
        setLoading(true);
        const quizData = await quizService.getQuizById(quiz.id);
        setQuestions(quizData.questions || []);
        setTimeRemaining(quiz.time_limit * 60); // Convert minutes to seconds
      } catch (error) {
        showError(getErrorMessage(error, 'Failed to load quiz questions'));
        onClose();
      } finally {
        setLoading(false);
      }
    };

    loadQuizQuestions();
  }, [quiz.id]);

  // Timer countdown
  useEffect(() => {
    if (quizStarted && timeRemaining > 0 && !showResult) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining, showResult]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = async () => {
    try {
      await quizService.startQuiz(quiz.id);
      setQuizStarted(true);
      showSuccess('Quiz started! Good luck! 🚀');
    } catch (error) {
      showError(getErrorMessage(error, 'Failed to start quiz'));
    }
  };

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentQuestionIndex].id]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedAnswers).length === 0) {
      showWarning('Please answer at least one question before submitting');
      return;
    }

    // Check if all questions are answered
    const unansweredCount = questions.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0) {
      const confirmed = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Submit anyway?`
      );
      if (!confirmed) return;
    }

    try {
      setLoading(true);
      const answers = questions.map(q => ({
        question_id: q.id,
        selected_answer: selectedAnswers[q.id] || ''
      }));

      const result = await quizService.submitQuizAnswers(quiz.id, { answers });
      setQuizResult(result);
      setShowResult(true);
      showSuccess(`Quiz completed! You scored ${result.score} points! 🎉`);
    } catch (error) {
      showError(getErrorMessage(error, 'Failed to submit quiz'));
    } finally {
      setLoading(false);
    }
  };

  if (loading || questions.length === 0) {
    return (
      <div className="quiz-modal-overlay" onClick={onClose}>
        <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
          <div className="quiz-modal-header">
            <h2>Loading Quiz...</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="quiz-modal-body">
            <div className="loading-container">
              <p>Please wait while we load the quiz questions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestion?.id];

  return (
    <div className="quiz-modal-overlay" onClick={onClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quiz-modal-header">
          <h2>{quiz.name}</h2>
          {quizStarted && !showResult && (
            <div className="timer-display">
              <span>⏱️ {formatTime(timeRemaining)}</span>
            </div>
          )}
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="quiz-modal-body">
          {showResult ? (
            <div className="quiz-result-view">
              <h2>🎉 Quiz Completed!</h2>
              <div className="result-summary">
                <div className="result-stat">
                  <span className="stat-label">Score:</span>
                  <span className="stat-value">{quizResult.score}</span>
                </div>
                <div className="result-stat">
                  <span className="stat-label">Correct Answers:</span>
                  <span className="stat-value">{quizResult.correct_answers} / {quizResult.total_questions}</span>
                </div>
                <div className="result-stat">
                  <span className="stat-label">Percentage:</span>
                  <span className={`stat-value ${quizResult.percentage >= 70 ? 'success' : quizResult.percentage >= 50 ? 'warning' : 'danger'}`}>
                    {quizResult.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {quizResult.answers && (
                <div className="answers-review">
                  <h3>Answers Review</h3>
                  <div className="answers-list">
                    {quizResult.answers.map((answer: any, index: number) => (
                      <div key={index} className={`answer-item ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                        <div className="answer-header">
                          <span className="question-number">Q{index + 1}:</span>
                          <span className={`answer-status ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                            {answer.is_correct ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        </div>
                        <p className="question-text">{answer.question}</p>
                        <p className="answer-detail">
                          <strong>Your answer:</strong> {answer.selected_answer || 'Not answered'}
                        </p>
                        {!answer.is_correct && (
                          <p className="answer-detail correct-answer">
                            <strong>Correct answer:</strong> {answer.correct_answer}
                          </p>
                        )}
                        {answer.explanation && (
                          <p className="answer-explanation">
                            <strong>Explanation:</strong> {answer.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="quiz-actions">
                <Button variant="primary" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : quizStarted ? (
            <div className="quiz-question-view">
              <div className="question-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>

              <h3 className="question-text">{currentQuestion.question}</h3>

              <ul className="options-list">
                {currentQuestion.answers.map((answer: string, index: number) => (
                  <li
                    key={index}
                    className={`option ${selectedAnswer === answer ? 'selected' : ''}`}
                    onClick={() => handleSelectAnswer(answer)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-text">{answer}</span>
                  </li>
                ))}
              </ul>

              <div className="quiz-navigation">
                <div className="answered-count">
                  Answered: {Object.keys(selectedAnswers).length} / {questions.length}
                </div>
                <div className="quiz-actions">
                  <Button 
                    variant="secondary" 
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button variant="primary" onClick={handleNext}>
                      Next
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      onClick={handleSubmitQuiz}
                      disabled={loading}
                    >
                      Submit Quiz
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="quiz-summary">
                <p><strong>Description:</strong> {quiz.description}</p>
                <p><strong>Level:</strong> <span className={`level-badge ${quiz.level.toLowerCase()}`}>{quiz.level}</span></p>
                <p><strong>Duration:</strong> {quiz.time_limit} minutes</p>
                <p><strong>Questions:</strong> {quiz.question_count}</p>
                <p><strong>Participants:</strong> {quiz.participants_count.toLocaleString()}</p>
              </div>

              <div className="quiz-instructions">
                <h3>Quiz Instructions</h3>
                <ul>
                  <li>Read each question carefully before selecting your answer.</li>
                  <li>You have {quiz.time_limit} minutes to complete all {quiz.question_count} questions.</li>
                  <li>Once you start, the timer will begin and cannot be paused.</li>
                  <li>Make sure you have a stable internet connection.</li>
                  <li>You can navigate between questions using Previous/Next buttons.</li>
                  <li>Submit your answers before the timer runs out!</li>
                </ul>
              </div>

              <div className="quiz-actions">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleStartQuiz}>
                  Start Quiz
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;

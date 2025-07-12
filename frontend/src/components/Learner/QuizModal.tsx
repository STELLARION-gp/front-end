// components/Learner/QuizModal.tsx
import React, { useState } from 'react';
import Button from '../Button';
import '../../styles/components/learner/QuizModal.scss';

interface Quiz {
  id: number;
  name: string;
  description: string;
  level: string;
  time: number;
  questionCount: number;
  participantsCount: number;
}

const sampleQuestions = [
  {
    id: 1,
    text: 'What is the largest galaxy in the Local Group?',
    options: ['Andromeda', 'Milky Way', 'Triangulum', 'Sombrero'],
    correct: 0
  },
  {
    id: 2,
    text: 'What type of galaxy is the Milky Way?',
    options: ['Elliptical', 'Spiral', 'Irregular', 'Lenticular'],
    correct: 1
  }
];

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      alert('🎉 Quiz Completed!');
      onClose();
    }
  };

  return (
    <div className="quiz-modal-overlay" onClick={onClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quiz-modal-header">
          <h2>{quiz.name}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="quiz-modal-body">
          {quizStarted ? (
            <div className="quiz-question-view">
              <h3>
                Question {currentQuestion + 1} of {sampleQuestions.length}
              </h3>
              <p className="question-text">
                {sampleQuestions[currentQuestion].text}
              </p>

              <ul className="options-list">
                {sampleQuestions[currentQuestion].options.map((option, index) => (
                  <li
                    key={index}
                    className={`option ${selectedOption === index ? 'selected' : ''}`}
                    onClick={() => setSelectedOption(index)}
                  >
                    {option}
                  </li>
                ))}
              </ul>

              <div className="quiz-actions">
                <Button variant="secondary" onClick={onClose}>
                  Quit
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={selectedOption === null}
                >
                  {currentQuestion === sampleQuestions.length - 1
                    ? 'Finish'
                    : 'Next'}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="quiz-summary">
                <p><strong>Description:</strong> {quiz.description}</p>
                <p><strong>Level:</strong> {quiz.level}</p>
                <p><strong>Duration:</strong> {quiz.time} minutes</p>
                <p><strong>Questions:</strong> {quiz.questionCount}</p>
                <p><strong>Participants:</strong> {quiz.participantsCount.toLocaleString()}</p>
              </div>

              <div className="quiz-instructions">
                <h3>Quiz Instructions</h3>
                <ul>
                  <li>Read each question carefully before selecting your answer.</li>
                  <li>You have {quiz.time} minutes to complete all {quiz.questionCount} questions.</li>
                  <li>Once you start, you cannot pause the quiz.</li>
                  <li>Make sure you have a stable internet connection.</li>
                  <li>Your progress will be automatically saved.</li>
                </ul>
              </div>

              <div className="quiz-actions">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setQuizStarted(true)}>
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

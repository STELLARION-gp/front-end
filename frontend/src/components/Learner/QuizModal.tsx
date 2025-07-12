// QuizModal.tsx
import React from 'react';
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

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
  onStart: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose, onStart }) => {
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
            <Button variant="primary" onClick={onStart}>
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;

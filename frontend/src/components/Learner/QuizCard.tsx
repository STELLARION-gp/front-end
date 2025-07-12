import React from "react";
import { Clock, ListOrdered, Users } from "lucide-react";
import Button from "../Button";
import "../../styles/components/learner/QuizCard.scss";

// Define Quiz type
interface Quiz {
  id: number;
  name: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced" | string;
  time: number;
  questionCount: number;
  participantsCount: number;
  isMyQuiz?: boolean;
}

// Props interface
interface QuizCardProps {
  quiz: Quiz;
  onParticipate: (quiz: Quiz) => void;
  onEdit: (quiz: Quiz) => void;
  isMyQuiz?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onParticipate, onEdit, isMyQuiz = false }) => {
  return (
    <div className="quiz-card">
      <div className="card-content">
        <div className="card-header">
          <h3 className="quiz-title">{quiz.name}</h3>
          <span className={`level-badge ${quiz.level.toLowerCase()}`}>{quiz.level}</span>
        </div>

        <p className="quiz-description">{quiz.description}</p>

        <div className="quiz-stats">
          <div className="stat-item">
            <Clock size={16} className="stat-icon" />
            <span>{quiz.time} min</span>
          </div>
          <div className="stat-item">
            <ListOrdered size={16} className="stat-icon" />
            <span>{quiz.questionCount} questions</span>
          </div>
          <div className="stat-item">
            <Users size={16} className="stat-icon" />
            <span>{quiz.participantsCount.toLocaleString()} joined</span>
          </div>
        </div>

        <div className="quiz-actions">
          {isMyQuiz ? (
            <Button variant="secondary" onClick={() => onEdit(quiz)}>
              Edit Quiz
            </Button>
          ) : (
            <Button variant="primary" onClick={() => onParticipate(quiz)}>
              Participate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;

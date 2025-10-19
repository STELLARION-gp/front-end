import React from "react";
import { Clock, ListOrdered, Users } from "lucide-react";
import Button from "../Button";
import "../../styles/components/learner/QuizCard.scss";

// Define Quiz type
interface Quiz {
  id: number;
  name: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Hard" | "Advanced" | string;
  time: number;
  questionCount: number;
  participantsCount: number;
  isMyQuiz?: boolean;
}

// Props interface
interface QuizCardProps {
  quiz: Quiz;
  onParticipate: () => void;
  onEdit: () => void;
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
            <Clock size={14} className="stat-icon" />
            <span>{quiz.time} min</span>
          </div>
          <div className="stat-item">
            <ListOrdered size={14} className="stat-icon" />
            <span>{quiz.questionCount} questions</span>
          </div>
          <div className="stat-item">
            <Users size={14} className="stat-icon" />
            <span>{quiz.participantsCount.toLocaleString()} joined</span>
          </div>
        </div>

        <div className="quiz-actions">
          {isMyQuiz ? (
            <Button variant="secondary" onClick={onEdit}>
              Edit Quiz
            </Button>
          ) : (
            <Button variant="primary" onClick={onParticipate}>
              Participate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;

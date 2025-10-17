import React from 'react';
import '../../styles/components/learner/ParticipatedQuizCard.scss';

interface ParticipatedQuiz {
  id: number;
  name: string;
  level: string;
  score: number;
  total: number;
  date: string;
  timeTaken: number;
}

interface Props {
  quiz: ParticipatedQuiz;
}

const ParticipatedQuizCard: React.FC<Props> = ({ quiz }) => {
  const scorePercent = Math.round((quiz.score / quiz.total) * 100);

  return (
    <div className="universe-participated-card">
      <div className="universe-participated-header">
        <h4>{quiz.name}</h4>
        <span className="universe-participated-level">{quiz.level}</span>
      </div>

      <div className="universe-participated-details">
        <div>
          <strong>Score:</strong> {quiz.score}/{quiz.total} ({scorePercent}%)
        </div>
        <div>
          <strong>Time Taken:</strong> {quiz.timeTaken} min
        </div>
        <div>
          <strong>Date:</strong> {quiz.date}
        </div>
      </div>
    </div>
  );
};

export default ParticipatedQuizCard;

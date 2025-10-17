import React from "react";
import "../../styles/components/mentor/StudentCard.scss";

interface StudentCardProps {
  student: {
    id: number;
    name: string;
    level: string;
    interests: string;
    description: string;
    joinDate: string;
    image?: string;
    isActive?: boolean;
  };
  onAccept: (studentId: number) => void;
  onMessage: (studentId: number) => void;
  onScheduleSession?: (studentId: number) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  onAccept, 
  onMessage, 
  onScheduleSession 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`student-card student-card--modern ${!student.isActive ? 'student-card--inactive' : ''}`}>
      {!student.isActive && (
        <div className="student-card__status-badge student-card__status-badge--inactive">
          Inactive
        </div>
      )}
      
      <div className="student-card__avatar-section">
        {student.image && (
          <img 
            src={student.image} 
            alt={student.name} 
            className="student-card__image" 
          />
        )}
        <div className="student-card__level-badge">
          {student.level}
        </div>
      </div>

      <div className="student-card__content">
        <h3 className="student-card__name">{student.name}</h3>
        
        <div className="student-card__interests">
          <strong>Interests:</strong> {student.interests}
        </div>
        
        <p className="student-card__description">
          {student.description}
        </p>
        
        <div className="student-card__meta">
          <span className="student-card__join-date">
            Joined: {formatDate(student.joinDate)}
          </span>
          {student.isActive && (
            <span className="student-card__status-badge student-card__status-badge--active">
              Active Learner
            </span>
          )}
        </div>

        <div className="student-card__actions">
          <button 
            className="student-card__btn student-card__btn--primary"
            onClick={() => onAccept(student.id)}
            disabled={!student.isActive}
          >
            View Profile
          </button>
          
          <button 
            className="student-card__btn student-card__btn--secondary"
            onClick={() => onMessage(student.id)}
          >
            Message
          </button>
          
          {onScheduleSession && student.isActive && (
            <button 
              className="student-card__btn student-card__btn--outline"
              onClick={() => onScheduleSession(student.id)}
            >
              Schedule Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
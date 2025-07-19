import React from "react";
import "../../../styles/components/learner/MentorCard.scss";
import Button from "../../Button";

interface MentorCardProps {
  mentor: {
    id: number;
    name: string;
    expertise: string;
    description: string;
    availableSlots: number;
    image?: string;
    accepting?: boolean;
  };
  onOpen: (mentorId: number) => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, onOpen }) => {
  return (
    <div className="mentor-card mentor-card--modern">
      <div className="mentor-card__avatar-bg">
        {mentor.image && (
          <img src={mentor.image} alt={mentor.name} className="mentor-card__image" />
        )}
      </div>
      <div className="mentor-card__info">
        <h2 className="mentor-card__name">{mentor.name}</h2>
        <div className="mentor-card__expertise"><b>{mentor.expertise}</b></div>
        <div className="mentor-card__desc">{mentor.description}</div>
        <Button onClick={() => onOpen(mentor.id)}>
          Open
        </Button>
        
      </div>
    </div>
  );
};

export default MentorCard;

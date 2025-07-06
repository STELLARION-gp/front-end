import React from "react";
import "../../styles/components/learner/MentorCard.scss";

interface MentorCardProps {
  mentor: {
    id: number;
    name: string;
    expertise: string;
    availableSlots: number;
    image?: string;
  };
  onApply: (mentorId: number) => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, onApply }) => {
  return (
    <div className="mentor-card">
      {mentor.image && <img src={mentor.image} alt={mentor.name} className="mentor-card__image" />}
      <div className="mentor-card__info">
        <h2 className="mentor-card__name">{mentor.name}</h2>
        <p className="mentor-card__expertise">Expertise: {mentor.expertise}</p>
        <p className="mentor-card__slots">Available Slots: {mentor.availableSlots}</p>
        <button className="mentor-card__apply-btn" onClick={() => onApply(mentor.id)}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default MentorCard;

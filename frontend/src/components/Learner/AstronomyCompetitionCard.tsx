import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/learner/AstronomyCompetitionCard.scss";
import Button from "../Button";

interface AstronomyCompetitionCardProps {
  coverImage: string;
  name: string;
  date: string;
  description: string;
}

const AstronomyCompetitionCard: React.FC<AstronomyCompetitionCardProps> = ({
  coverImage,
  name,
  date,
  description,
}) => {
  const navigate = useNavigate();
  const handleParticipate = () => {
    navigate("/dashboard/competition");
  };
  return (
    <div className="preview-competition-card">
      <div className="preview-competition-image-wrapper">
        <img src={coverImage} alt={name} className="preview-competition-image" />
        <span className="preview-competition-date-badge">{date}</span>
      </div>
      <div className="preview-competition-content">
        <h2 className="preview-competition-title">{name}</h2>
        <p className="preview-competition-desc">{description}</p>
        <Button className="preview-competition-btn" onClick={handleParticipate}>Participate</Button>
      </div>
    </div>
  );
};

export default AstronomyCompetitionCard;
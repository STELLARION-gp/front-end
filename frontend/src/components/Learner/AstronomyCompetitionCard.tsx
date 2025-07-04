import React from "react";
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
}) => (
  <div className="competition-card">
    <div className="competition-image-wrapper">
      <img src={coverImage} alt={name} className="competition-image" />
      <span className="competition-date-badge">{date}</span>
    </div>
    <div className="competition-content">
      <h3 className="competition-title">{name}</h3>
      <p className="competition-desc">{description}</p>
      <Button>Participate</Button>
    </div>
  </div>
);

export default AstronomyCompetitionCard;
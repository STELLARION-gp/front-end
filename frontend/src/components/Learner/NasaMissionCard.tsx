import React from "react";
import "../../styles/components/learner/NasaMissionCard.scss";

interface NasaMissionCardProps {
  name: string;
  description: string;
  image: string;
  years: string;
  onClick?: () => void;
}

const NasaMissionCard: React.FC<NasaMissionCardProps> = ({ name, description, image, years, onClick }) => (
  <div className="nasa-mission-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
    <img src={image} alt={name} className="nasa-mission-image" />
    <div className="nasa-mission-info">
      <h3 className="nasa-mission-title">{name}</h3>
      <div className="nasa-mission-years">{years}</div>
      <p className="nasa-mission-desc">{description}</p>
    </div>
  </div>
);

export default NasaMissionCard;

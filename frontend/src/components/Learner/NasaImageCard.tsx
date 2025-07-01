import React from "react";
import "../../styles/components/learner/NasaImageCard.scss";

interface NasaImageCardProps {
  image: string;
  title: string;
  rating: number;
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i} className="nasa-star">&#9733;</span>);
  }
  if (halfStar) {
    stars.push(<span key="half" className="nasa-star">&#9734;</span>);
  }
  while (stars.length < 5) {
    stars.push(<span key={stars.length} className="nasa-star empty">&#9734;</span>);
  }
  return stars;
};

const NasaImageCard: React.FC<NasaImageCardProps> = ({ image, title, rating }) => (
  <div className="nasa-image-card">
    <div className="nasa-image-wrapper">
      <img src={image} alt={title} className="nasa-image" />
      <div className="nasa-image-title-overlay">{title}</div>
      <div className="nasa-image-rating-overlay">
        {renderStars(rating)}
      </div>
    </div>
  </div>
);

export default NasaImageCard;
import React from "react";
import "../../styles/components/learner/ServiceCard.scss";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  guideName: string;
  guideImage: string;
  rating: number;
  location: string;
  duration: string;
  tags: string[];
  price: number;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  image,
  guideName,
  guideImage,
  rating,
  location,
  duration,
  tags,
  price,
  onClick
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star-icon${i < Math.floor(rating) ? ' filled' : ''}`}>★</span>
    ));
  };
  return (
    <div className="service-card" onClick={onClick} tabIndex={0} role="button">
      {image && (
        <div className="service-card__image">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="service-card__content">
        <h3 className="service-card__title">{title}</h3>
        <div className="service-card__price">${price}</div>
        <div className="service-card__rating">{renderStars(rating)} <span className="rating-value">{rating.toFixed(1)}</span></div>
        <p className="service-card__desc">{description}</p>
        <div className="service-card__details">
          <span className="service-card__location">{location}</span>
          <span className="service-card__duration">{duration}</span>
        </div>
        <div className="service-card__tags">
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {tags.length > 3 && <span className="tag tag-more">+{tags.length - 3}</span>}
        </div>
        <div className="service-card__guide">
          <img src={guideImage} alt={guideName} className="service-card__guide-img" />
          <span className="service-card__guide-name">{guideName}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

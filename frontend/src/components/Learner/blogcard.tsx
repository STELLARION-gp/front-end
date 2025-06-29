import React from "react";
import "../../styles/pages/learner/blogcard.scss";
import Button from "../Button";
import { UserIcon } from '@heroicons/react/24/outline';
import { Calendar } from "lucide-react";

interface AstronomyBlogCardProps {
  image: string;
  title: string;
  author: string;
  createdAt: string;
  rating: number;
  content: string;
  onReadMore?: () => void;
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i} className="star">&#9733;</span>); // filled star
  }
  if (halfStar) {
    stars.push(<span key="half" className="star">&#9734;</span>); // half/empty star
  }
  while (stars.length < 5) {
    stars.push(<span key={stars.length} className="star empty">&#9734;</span>);
  }
  return stars;
};

const AstronomyBlogCard: React.FC<AstronomyBlogCardProps> = ({
  image,
  title,
  author,
  createdAt,
  rating,
  content,
}) => (
  <div className="astro-blog-card">
    <img src={image} alt={title} className="astro-blog-card-image" />
    <h2 className="astro-blog-card-title">{title}</h2>
    <p className="astro-blog-card-meta">
        <span>
            <UserIcon className="astro-blog-card-meta-icon" />
            <b>{author}</b>
        </span>
        <span>
            <Calendar className="astro-blog-card-meta-icon" />
            {new Date(createdAt).toLocaleDateString()}
        </span>
    </p>
    <div className="astro-blog-card-rating">
      {renderStars(rating)}
      <span className="rating-number">{rating.toFixed(1)}</span>
    </div>
    <p className="astro-blog-card-content">{content.slice(0, 80)}...</p>
    <Button>Read More</Button>
  </div>
);

export default AstronomyBlogCard;
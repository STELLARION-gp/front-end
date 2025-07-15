import React, { useEffect, useRef, useState } from 'react';
import { Satellite, Map, Users, ShoppingBag, ArrowRight } from 'lucide-react';
import '../../styles/components/FeaturesSection.scss';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  isActive: boolean;
  onHover: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  delay, 
  isActive, 
  onHover 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`feature-card ${isVisible ? 'animate' : ''} ${isActive ? 'active' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={onHover}
    >
      <div className="card-glow"></div>
      <div className="card-content">
        <div className="feature-icon">
          {icon}
        </div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
        <div className="feature-action">
          <span>Explore</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    {
      icon: <Satellite className="w-8 h-8" />,
      title: "Satellite & Spacecraft Tracker",
      description: "Track real-time positions of ISS, SpaceX launches, and more with precision timing and orbital data."
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Interactive Star Maps",
      description: "Zoom across constellations, planets, and deep-sky objects with our intuitive star chart interface."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Live Learning Sessions",
      description: "Join sessions by space tutors on black holes, rocket science, astrophysics, and more."
    }
  ];

  // Auto-rotate active feature
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section ref={sectionRef} className="features-section">
      <div className="features-container">
        <div className="features-header">
          <div className="section-badge">
            <span>✨ Core Features</span>
          </div>
          <h2 className="features-title">
            Everything You Need to 
            <span className="gradient-text"> Explore Space</span>
          </h2>
          <p className="features-subtitle">
            Discover the universe with our comprehensive suite of space exploration tools
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 150}
              isActive={activeFeature === index}
              onHover={() => setActiveFeature(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
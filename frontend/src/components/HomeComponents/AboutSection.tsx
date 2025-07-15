import React, { useEffect, useRef, useState } from 'react';
import { Telescope, Users, Zap, Heart } from 'lucide-react';
import '../../styles/components/AboutSection.scss';

const AboutSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Telescope className="w-6 h-6" />,
      title: "Latest Data",
      description: "Real-time NASA data integration"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Learn together with space enthusiasts"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Tools",
      description: "Interactive space exploration tools"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "For Everyone",
      description: "From students to researchers"
    }
  ];

  return (
    <section ref={sectionRef} className="about-section">
      <div className="about-container">
        <div className={`about-content ${isVisible ? 'animate' : ''}`}>
          <div className="about-text">
            <div className="about-badge">
              <span>🧭 About Us</span>
            </div>
            
            <h2 className="about-title">
              Our Mission: Make the Cosmos 
              <span className="gradient-text"> Accessible to All</span>
            </h2>
            
            <div className="about-description">
              <p>
                At Stellarion, we believe space should inspire and educate everyone — 
                not just astronauts or scientists. Our platform combines the latest 
                astronomical data, community-driven learning, and real-time tools to 
                connect curious minds with the wonders of the universe.
              </p>
              
              <p>
                Founded by space enthusiasts and supported by real-time NASA data, 
                Stellarion is more than a site — it's a community. Whether you're a 
                student, stargazer, researcher, or just dream of the stars, you're welcome here.
              </p>
            </div>

            <div className="about-features">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="feature-item"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <div className="feature-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-visual">
            <div className="floating-elements">
              <div className="floating-planet planet-1"></div>
              <div className="floating-planet planet-2"></div>
              <div className="floating-planet planet-3"></div>
              <div className="constellation-lines"></div>
            </div>
            
            <div className="mission-card">
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="mission-icon">
                  <Telescope className="w-12 h-12" />
                </div>
                <h3>Explore Together</h3>
                <p>Join our community of space explorers</p>
                <div className="user-avatars">
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <span className="user-count">+25K users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
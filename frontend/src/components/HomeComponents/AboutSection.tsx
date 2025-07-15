
import React, { useEffect, useRef, useState } from 'react';
import { Telescope, Users, Zap, Heart } from 'lucide-react';
import { useI18n } from '../../i18n/useI18n';
import '../../styles/components/AboutSection.scss';

const AboutSection: React.FC = () => {

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

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

  const iconMap = {
    Telescope: <Telescope className="w-6 h-6" />,
    Users: <Users className="w-6 h-6" />,
    Zap: <Zap className="w-6 h-6" />,
    Heart: <Heart className="w-6 h-6" />,
  };
  const { tArray } = useI18n();
  type Feature = { icon: keyof typeof iconMap; title: string; description: string };
  const features = tArray('about.features') as Feature[];

  return (
    <section ref={sectionRef} className="about-section">
      <div className="about-container">
        <div className={`about-content ${isVisible ? 'animate' : ''}`}>
          <div className="about-text">
            <div className="about-badge">
              <span>{t('about.badge')}</span>
            </div>
            <h2 className="about-title">{t('about.title')}</h2>
            <div className="about-description">
              <p>{t('about.description1')}</p>
              <p>{t('about.description2')}</p>
            </div>
            <div className="about-features">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="feature-item"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="feature-icon">
                    {iconMap[feature.icon]}
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
                <h3>{t('about.missionCard.title')}</h3>
                <p>{t('about.missionCard.description')}</p>
                <div className="user-avatars">
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <span className="user-count">{t('about.missionCard.userCount')}</span>
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